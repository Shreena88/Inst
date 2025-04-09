from fastapi import FastAPI, File, UploadFile, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from PIL import Image
import torch
from torchvision import transforms, models
import os
import io
import json
import time
from typing import Dict, Any
import uuid
from pathlib import Path

# Get the current directory
BASE_DIR = Path(__file__).resolve().parent

app = FastAPI()

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://shreena88.github.io",
        "http://localhost:8000",
        "http://localhost:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables for progress tracking
processing_status: Dict[str, Dict[str, Any]] = {}

# Load class labels and model
TRAINING_DATA_DIR = BASE_DIR / "training_data"
class_labels = sorted(os.listdir(TRAINING_DATA_DIR))
num_classes = len(class_labels)

# Load model
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = models.resnet50(weights=None)

# Replace final layer
model.fc = torch.nn.Sequential(
    torch.nn.Linear(model.fc.in_features, 128),
    torch.nn.ReLU(),
    torch.nn.BatchNorm1d(128),
    torch.nn.Dropout(0.4),
    torch.nn.Linear(128, num_classes)
)

# Load trained weights
MODEL_PATH = BASE_DIR / "document_classifier_model_final.pth"
model.load_state_dict(torch.load(MODEL_PATH, map_location=device))
model.to(device)
model.eval()

# Image transform
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406],
                        std=[0.229, 0.224, 0.225])
])

# Create upload directory if it doesn't exist
UPLOAD_DIR = BASE_DIR / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)

async def process_document(file_path: str, task_id: str):
    """Background task to process the document"""
    try:
        # Simulate processing steps
        for i in range(101):
            processing_status[task_id]["progress"] = i
            time.sleep(0.1)  # Simulate processing time

        # Load and process the document
        with open(file_path, "rb") as f:
            image = Image.open(io.BytesIO(f.read())).convert("RGB")
            input_tensor = transform(image).unsqueeze(0).to(device)

            with torch.no_grad():
                output = model(input_tensor)
                _, pred_idx = torch.max(output, dim=1)
                prediction = class_labels[pred_idx.item()]

        # Load master format for information extraction
        MASTER_FORMAT_PATH = BASE_DIR / "Master Format.json"
        with open(MASTER_FORMAT_PATH, "r") as f:
            master_format = json.load(f)

        # Extract information based on document type
        extracted_info = {
            "document_type": prediction,
            "status": "completed",
            "extracted_data": master_format.get(prediction, {})
        }

        processing_status[task_id]["result"] = extracted_info
        processing_status[task_id]["status"] = "completed"

    except Exception as e:
        processing_status[task_id]["status"] = "error"
        processing_status[task_id]["error"] = str(e)

@app.post("/upload")
async def upload_document(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...)
):
    """Upload and process document"""
    try:
        # Generate unique task ID
        task_id = str(uuid.uuid4())
        
        # Save uploaded file
        file_path = UPLOAD_DIR / f"{task_id}_{file.filename}"
        contents = await file.read()
        with open(file_path, "wb") as f:
            f.write(contents)

        # Initialize processing status
        processing_status[task_id] = {
            "status": "processing",
            "progress": 0,
            "result": None
        }

        # Start background processing
        background_tasks.add_task(process_document, str(file_path), task_id)

        return JSONResponse({
            "task_id": task_id,
            "status": "processing",
            "message": "Document upload successful"
        })

    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"error": str(e)}
        )

@app.get("/status/{task_id}")
async def get_status(task_id: str):
    """Get processing status"""
    if task_id not in processing_status:
        return JSONResponse(
            status_code=404,
            content={"error": "Task not found"}
        )
    
    status = processing_status[task_id]
    if status["status"] == "completed":
        return JSONResponse(status)
    elif status["status"] == "error":
        return JSONResponse(
            status_code=500,
            content=status
        )
    else:
        return JSONResponse({
            "status": "processing",
            "progress": status["progress"]
        })

@app.get("/")
async def root():
    """Root endpoint for health check"""
    return {"status": "API is running"}