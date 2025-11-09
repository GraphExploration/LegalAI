import os

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any

# LangChain Imports
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_groq import ChatGroq
from langchain.chains import RetrievalQA
from fastapi.middleware.cors import CORSMiddleware



# Load environment variables
load_dotenv()

class ChatRequest(BaseModel):
    """Defines the expected structure for a chat request."""
    query: str

class SourceDocument(BaseModel):
    """Defines the structure for a source document."""
    page_content: str
    metadata: Dict[str, Any]

class ChatResponse(BaseModel):
    """Defines the structure for a chat response."""
    answer: str
    source_documents: List[SourceDocument] = [] 

app = FastAPI(
    title="LegalAI Chatbot API",
    description="Backend service for a Legal AI Chatbot powered by RAG",
    version="1.0.0"
)


app.add_middleware(
  CORSMiddleware,
  allow_origins=["*"],  
  allow_methods=["*"],
  allow_headers=["*"],
  allow_credentials=True,
)

# --- Configuration Constants ---
PERSIST_DIRECTORY = os.getenv("PERSIST_DIRECTORY")
COLLECTION_NAME = os.getenv("COLLECTION_NAME")
EMBEDDINGS_MODEL = os.getenv("EMBEDDINGS_MODEL")

# --- Initialization Function for RAG Components ---
@app.on_event("startup")
def startup_event():
    """Initializes global resources when the app starts."""
    groq_api_key = os.getenv("GROQ_API_KEY")
    if not groq_api_key:
        
        print("CRITICAL: GROQ_API_KEY environment variable not set.")
        
        app.state.groq_api_key = None 
    else:
        app.state.groq_api_key = groq_api_key
    


    # 2. ChromaDB Setup
    print("Loading Embeddings and Vector Store...")
    try:
        embeddings = HuggingFaceEmbeddings(model_name=EMBEDDINGS_MODEL)
        vectordb = Chroma(
            persist_directory=PERSIST_DIRECTORY,
            embedding_function=embeddings,
            collection_name=COLLECTION_NAME
        )
        app.state.vectordb = vectordb
        print("Vector Store loaded successfully.")
    except Exception as e:
        print(f"Error loading Vector Store: {e}")
        app.state.vectordb = None 

    # 3. LLM and Chain Setup 
    if app.state.groq_api_key and app.state.vectordb:
        print("Initializing LLM and Retrieval Chain...")
        try:
            llm = ChatGroq(
                api_key=app.state.groq_api_key,
                model = os.getenv("MODEL"),
                temperature=0.2
            )
            
            # RetrievalQA Chain
            qa_chain = RetrievalQA.from_chain_type(
                llm=llm,
                retriever=app.state.vectordb.as_retriever(search_kwargs={"k": 4}),
                return_source_documents=True
            )
            app.state.qa_chain = qa_chain
            print("Retrieval Chain initialized successfully.")
        except Exception as e:
            print(f"Error initializing LLM/Chain: {e}")
            app.state.qa_chain = None
    else:
        app.state.qa_chain = None

    # print("ENV:", os.environ)
    # print("Files in chroma dir:", os.listdir(PERSIST_DIRECTORY) if os.path.exists(PERSIST_DIRECTORY) else "Not Found")



# --- FastAPI Chat Endpoint ---

@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    """
    Handles chat requests by querying the RetrievalQA chain.
    """
    # Check if the chain was successfully initialized
    if not hasattr(app.state, 'qa_chain') or app.state.qa_chain is None:
        if not os.getenv("GROQ_API_KEY"):
             raise HTTPException(
                status_code=503, 
                detail="GROQ_API_KEY is not set. Service unavailable."
            )
        else:
            raise HTTPException(
                status_code=500, 
                detail="RAG Chain not initialized. Check server logs for VectorDB or LLM loading errors."
            )

    try:
        # Execute the RetrievalQA chain
        result = app.state.qa_chain.invoke({"query": request.query})
        
        # Extract the answer and source documents
        answer = result.get("result", "Sorry, I couldn't find an answer.")
        source_docs = result.get("source_documents", [])
        
        # Format source documents for the Pydantic response model
        formatted_sources = [
            SourceDocument(
                page_content=doc.page_content, 
                metadata=doc.metadata
            ) for doc in source_docs
        ]
        
        return ChatResponse(answer=answer, source_documents=formatted_sources)

    except Exception as e:
        print(f"Error during chain execution: {e}")
        raise HTTPException(
            status_code=500, 
            detail=f"An error occurred during chain execution: {str(e)}"
        )

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.get("/docs-info")
def docs_info():
    return {
        "collection": COLLECTION_NAME,
        "persist_dir": PERSIST_DIRECTORY,
        "vector_count": app.state.vectordb._collection.count() if hasattr(app.state, 'vectordb') else "unknown"
    }

# --- How to Run This ---
# Save the code above as a Python file (e.g., main.py).
# Install the necessary libraries:
# pip install fastapi uvicorn python-dotenv pydantic langchain-community langchain-groq "langchain<0.2.0"
# Run the application using Uvicorn:
# uvicorn main:app --reload

# The API will then be available at http://127.0.0.1:8000/
# You can test the endpoint using:
# POST http://127.0.0.1:8000/chat
# Body (JSON): {"query": "What are the main points of the contract?"}



# uvicorn app.chatbot:app --reload --port 9004 
# uvicorn app.chatbot:app --host 0.0.0.0 --port 8000 --reload
# npm run dev