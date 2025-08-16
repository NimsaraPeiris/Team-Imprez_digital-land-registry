import uvicorn, sentencepiece as spm, torch
from bot.model import Seq2Seq
from bot.infer import sample_reply, DEVICE
from pydantic import BaseModel
from fastapi import APIRouter
import os

router = APIRouter(prefix="/chat", tags=["chat"])

class ChatIn(BaseModel):
    """
    Pydantic model defining the JSON structure for the /chat request body.
    """
    system: str = "You are a helpful assistant."  
    history: str = ""                          
    user: str

current_dir = os.path.dirname(__file__)
tokenizer_path = os.path.abspath(
    os.path.join(current_dir,"..", "..", "..", "bot", "artifacts", "tokenizer.model")
)
model_path = os.path.abspath(
    os.path.join(current_dir,"..", "..", "..", "bot", "artifacts", "best.pkl")
)

# Load trained SentencePiece tokenizer
sp = spm.SentencePieceProcessor(model_file=tokenizer_path)
# Load model checkpoint
ckpt = torch.load((model_path), map_location=DEVICE)
# Create Seq2Seq model instance with vocab size + pad_id from checkpoint
model = Seq2Seq(vocab=sp.get_piece_size(), pad_id=ckpt["pad_id"]).to(DEVICE)
# Load model weights into the instance
model.load_state_dict(ckpt["model"])
# Set to evaluation mode (disable dropout, etc.)
model.eval()  


@router.post("/")
def chat(inp: ChatIn):
    text = sample_reply(sp, model, inp.system, inp.history, inp.user)
    return {"reply": text} 