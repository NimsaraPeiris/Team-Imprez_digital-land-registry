import torch, sentencepiece as spm
from .model import Seq2Seq

# Automatically use GPU if available
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"


# Load trained model + tokenizer
def load_model():
    # Load SentencePiece tokenizer from artifacts
    sp = spm.SentencePieceProcessor(model_file="artifacts/tokenizer.model")

    # Load model checkpoint (weights + pad_id) from disk
    ckpt = torch.load("artifacts/best.pkl", map_location=DEVICE)

    # Recreate Seq2Seq model with same vocab + pad_id
    model = Seq2Seq(vocab=sp.get_piece_size(), pad_id=ckpt["pad_id"]).to(DEVICE)

    # Load trained weights into the model
    model.load_state_dict(ckpt["model"])
    model.eval()  # Set to evaluation mode (disable dropout)

    return sp, model, ckpt["pad_id"]


# Generate a reply from the model using top-k / top-p sampling
@torch.no_grad()  # Disable gradient calculation for faster inference
def sample_reply(sp, model, sys, history, user, max_new=80, top_k=40, top_p=0.9, temperature=1.0):
    """
    sp          → tokenizer
    model       → trained Seq2Seq model
    sys         → system message (e.g., role or instructions)
    history     → conversation history (USER/BOT turns)
    user        → latest user input
    max_new     → maximum number of tokens to generate
    top_k       → keep only top-k probable tokens at each step
    top_p       → keep tokens whose cumulative probability <= top_p (nucleus sampling)
    temperature → controls randomness (lower = more deterministic)
    """

    bos, eos = sp.bos_id(), sp.eos_id()

    # Build source sequence with special tags
    src_text = f"[SYS] {sys} [/SYS]\n[HIST] {history} [/HIST]\n[USER] {user} [/USER]\n[BOT] "

    # Encode into token IDs with BOS/EOS around it
    src = [bos] + sp.encode(src_text, out_type=int) + [eos]
    src = torch.tensor(src, dtype=torch.long)[None, :]  # Add batch dimension

    # Mask for attention (True = not padding)
    pad_id = sp.piece_to_id("<pad>")
    src_mask = (src != pad_id)

    # Start decoder input with <bos>
    y = torch.tensor([[bos]], dtype=torch.long).to(DEVICE)
    src, src_mask = src.to(DEVICE), src_mask.to(DEVICE)

   
    # Prime encoder
    # Directly use encoder and decoder from the trained model
    enc = model.enc
    dec = model.dec

    # Run encoder to get hidden states ("keys" for attention) + LSTM hidden state
    keys, h_c = enc(src, src_mask)

    # Initial context vector is zero (shape: B=1, seq=1, hidden_size)
    ctx = keys.new_zeros((1, 1, keys.size(-1)))

    out_tokens = []  # Generated token IDs (excluding BOS)

 
    # Autoregressive decoding loop
    for _ in range(max_new):
        # First step: get decoder output with current context
        logit, h_c, dec_out = dec.step(y[:, -1:], h_c, ctx)

        # Compute attention weights over encoder outputs
        scores = (keys @ dec_out.transpose(1, 2)).squeeze(-1)   # (B,S)
        scores = scores.masked_fill(~src_mask, -1e9)            # Mask out padding
        w = scores.softmax(-1).unsqueeze(1)                     # (B,1,S)
        ctx = w @ keys                                          # New context vector

        # Second pass: refine prediction with updated context
        logit, h_c, dec_out = dec.step(y[:, -1:], h_c, ctx)

        # Get logits for the next token and apply temperature scaling
        logits = logit[0, 0, :] / temperature


        # Apply top-k and/or top-p filtering
        probs = torch.softmax(logits, dim=-1)

        if top_k:
            # Keep only top-k most probable tokens
            topk = torch.topk(probs, top_k)
            mask = torch.full_like(probs, 0.0)
            mask.scatter_(0, topk.indices, topk.values)
            probs = mask / mask.sum()

        if top_p:
            # Nucleus sampling: keep smallest set of tokens with cumulative prob ≤ top_p
            sorted_probs, sorted_idx = torch.sort(probs, descending=True)
            cumsum = torch.cumsum(sorted_probs, dim=0)
            keep = cumsum <= top_p
            keep[0] = True  # Always keep the most probable token
            filtered = torch.zeros_like(probs)
            filtered.scatter_(0, sorted_idx[keep], sorted_probs[keep])
            probs = filtered / filtered.sum()

        # Sample next token ID from filtered distribution
        next_id = torch.multinomial(probs, 1).item()

        # Stop if EOS token is generated
        if next_id == sp.eos_id():
            break

        # Append to output and update decoder input
        out_tokens.append(next_id)
        y = torch.cat([y, torch.tensor([[next_id]], device=DEVICE)], dim=1)

    # Decode token IDs into text
    return sp.decode(out_tokens)



