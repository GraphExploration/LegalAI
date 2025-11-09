# app/Dockerfile
FROM python:3.11-slim

# Set working directory inside the container
WORKDIR /app

# Copy requirements first (for better caching)
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy your app code
COPY . .

# 🔹 Copy your Chroma DB and Data directories
COPY ../chroma_db /app/chroma_db
COPY ../Data /app/Data

# Expose port for Cloud Run (FastAPI default)
EXPOSE 8000

# Run your app
# If you use FastAPI + uvicorn, this is ideal:
CMD ["uvicorn", "chatbot:app", "--host", "0.0.0.0", "--port", "8000"]
