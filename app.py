import os
import streamlit as st
import torch
import torch.nn as nn
from torchvision import transforms, models
from PIL import Image

# -------------------- Set Page Configuration (MUST be the first Streamlit command) --------------------
st.set_page_config(page_title="Document Classifier", layout="centered")

# -------------------- Device Setup --------------------
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
st.info(f"💻 Running on: {device}")

# -------------------- Class Labels --------------------
training_data_path = 'dataset'

if not os.path.exists(training_data_path):
    st.error("❌ Training data folder not found! Ensure 'dataset' exists.")
    st.stop()

class_labels = sorted(os.listdir(training_data_path))
num_classes = len(class_labels)
st.write(f"🔍 Found {num_classes} classes: {class_labels}")

# -------------------- Build Model (ResNet50) --------------------
from torchvision.models import resnet50, ResNet50_Weights

# Load pretrained ResNet50 using ImageNet weights
base_model = resnet50(weights=ResNet50_Weights.IMAGENET1K_V2)

# Freeze all parameters (as done during training)
for param in base_model.parameters():
    param.requires_grad = False

# Replace classifier to match your training configuration
in_features = base_model.fc.in_features
base_model.fc = nn.Sequential(
    nn.Linear(in_features, 128),
    nn.ReLU(),
    nn.BatchNorm1d(128),
    nn.Dropout(0.4),
    nn.Linear(128, num_classes)  # Adjust number of classes dynamically
)

model = base_model.to(device)
model.eval()

# -------------------- Load Trained Weights --------------------
checkpoint_path = 'document_classifier_model_final.pth'

try:
    state_dict = torch.load(checkpoint_path, map_location=device)

    # Extract number of classes from saved model
    saved_num_classes = state_dict["fc.4.weight"].shape[0]

    # Ensure that trained model matches current dataset
    if saved_num_classes != num_classes:
        st.error(f"⚠ Model trained with {saved_num_classes} classes, but found {num_classes} classes in dataset.")
        st.stop()

    model.load_state_dict(state_dict)
    st.success("✅ Model loaded successfully!")
except Exception as e:
    st.error(f"❌ Error loading model: {e}")
    st.stop()

# -------------------- Image Preprocessing --------------------
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406],
                         std=[0.229, 0.224, 0.225]),
])

# -------------------- Streamlit UI --------------------
st.title("🧠 Document Image Classifier")
st.markdown("Upload a document image to predict its category using GPU.")

# File uploader widget
uploaded_file = st.file_uploader("📂 Upload Image", type=["jpg", "jpeg", "png"])

if uploaded_file is not None:
    try:
        # Open, display, and preprocess image
        img = Image.open(uploaded_file).convert("RGB")
        st.image(img, caption="📷 Uploaded Image", use_column_width=True)

        img_tensor = transform(img).unsqueeze(0).to(device)

        # Model prediction
        with torch.no_grad():
            output = model(img_tensor)
            _, pred_idx = torch.max(output, dim=1)
            predicted_class = class_labels[pred_idx.item()]
            confidence = torch.nn.functional.softmax(output, dim=1)[0][pred_idx].item()

        st.success(f"✅ Prediction: {predicted_class}")
        st.info(f"📊 Confidence: {confidence:.2f}")

    except Exception as e:
        st.error(f"❌ Error processing image: {e}")