import torch, torch.nn as nn


# Encoder: processes source sequence (input text)
class Encoder(nn.Module):
    def __init__(self, vocab, d_model=512, hidden=512, layers=2, dropout=0.2, pad_id=0):
        super().__init__()
        # Token embedding layer: converts token IDs -> vectors
        self.emb = nn.Embedding(vocab, d_model, padding_idx=pad_id)
        # LSTM encoder: processes embeddings into hidden representations
        self.lstm = nn.LSTM(
            input_size=d_model,
            hidden_size=hidden,
            num_layers=layers,
            batch_first=True,   # input shape = (batch, seq_len, features)
            dropout=dropout
        )
        # Dropout for regularization
        self.dropout = nn.Dropout(dropout)

    def forward(self, src, src_mask):
        # Embed tokens and apply dropout
        x = self.dropout(self.emb(src))    # (B, S, d_model)
        # Pass through LSTM
        out, (h, c) = self.lstm(x)         # out: (B, S, H), h/c: (layers, B, H)
        return out, (h, c)                 # out = encoder outputs for attention



# Decoder: generates output sequence one token at a time
class Decoder(nn.Module):
    def __init__(self, vocab, d_model=512, hidden=512, layers=2, dropout=0.2, pad_id=0):
        super().__init__()
        # Token embedding for decoder input
        self.emb = nn.Embedding(vocab, d_model, padding_idx=pad_id)
        # LSTM decoder: input = embedding + attention context
        self.lstm = nn.LSTM(
            input_size=d_model + hidden,
            hidden_size=hidden,
            num_layers=layers,
            batch_first=True,
            dropout=dropout
        )
        # Output projection to vocabulary
        self.out = nn.Linear(hidden, vocab)
        self.dropout = nn.Dropout(dropout)

    def step(self, y_prev, h_c, context):
        """
        Perform one decoding step.
        y_prev:   previous token IDs (B, 1)
        h_c:      (hidden_state, cell_state) tuple for LSTM
        context:  attention context vector (B, 1, H)
        """
        # Embed token and apply dropout
        y = self.dropout(self.emb(y_prev))        # (B, 1, d_model)
        # Concatenate embedding with context
        inp = torch.cat([y, context], dim=-1)     # (B, 1, d_model+H)
        # Pass through LSTM
        out, h_c = self.lstm(inp, h_c)            # out: (B, 1, H)
        # Project to vocabulary logits
        logits = self.out(out)                    # (B, 1, V)
        # Return logits, updated LSTM state, and decoder hidden output
        return logits, h_c, out                   # out used for attention query



# Seq2Seq: coordinates Encoder, Attention, and Decoder
class Seq2Seq(nn.Module):
    def __init__(self, vocab, d_model=512, hidden=512, layers=2, dropout=0.2, pad_id=0):
        super().__init__()
        self.enc = Encoder(vocab, d_model, hidden, layers, dropout, pad_id)
        self.dec = Decoder(vocab, d_model, hidden, layers, dropout, pad_id)
        self.pad_id = pad_id

    @staticmethod
    def _dot_attn(query, keys, mask):
        """
        Dot-product attention.
        query: (B, 1, H)   -> current decoder hidden state
        keys:  (B, S, H)   -> encoder outputs
        mask:  (B, S)      -> True for real tokens, False for PAD
        """
        # Compute similarity scores between query and each key
        scores = torch.bmm(keys, query.transpose(1, 2)).squeeze(-1)  # (B, S)
        # Mask out PAD positions
        scores = scores.masked_fill(~mask, -1e9)
        # Softmax over sequence length to get attention weights
        w = scores.softmax(dim=-1).unsqueeze(1)                      # (B, 1, S)
        # Weighted sum of encoder outputs -> context vector
        ctx = torch.bmm(w, keys)                                     # (B, 1, H)
        return ctx, w

    def forward(self, src, src_mask, dec_in, teacher_forcing=True):
        """
        src:     encoder input IDs  (B, S)
        src_mask:mask for encoder inputs (B, S)
        dec_in:  decoder input IDs  (B, T)
        """
        B, T = dec_in.size()

        # Encode source sequence
        keys, h_c = self.enc(src, src_mask)

        # Initial attention context = zeros
        ctx = keys.new_zeros((B, 1, keys.size(-1)))
        logits_all = []

        # Initial query = context (zero state)
        query = ctx

        for t in range(T):
            step_in = dec_in[:, t:t+1]   # Current token for decoder step (B, 1)

            # First decoding pass (with old context)
            logit, h_c, dec_out = self.dec.step(step_in, h_c, ctx)

            # Compute attention context from decoder output
            ctx, _ = self._dot_attn(dec_out, keys, src_mask)

            # Second decoding pass with updated context
            logit, h_c, dec_out = self.dec.step(step_in, h_c, ctx)

            # Collect logits for this time step
            logits_all.append(logit)

        # Concatenate logits over all time steps -> (B, T, V)
        logits = torch.cat(logits_all, dim=1)
        return logits
