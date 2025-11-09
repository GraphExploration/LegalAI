import os
from langchain_community.document_loaders import PyMuPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import HuggingFaceEmbeddings


def extract_pdf_text(pdf_path):
    loader = PyMuPDFLoader(pdf_path)
    docs = loader.load()
    return "\n".join([doc.page_content for doc in docs])


def chunk_text(text, chunk_size=500, overlap=50):
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=overlap,
        separators=["\n\n", "\n", ".", "!", "?", " "]
    )
    return splitter.split_text(text)


def store_chunks_in_chromadb(chunks, collection_name="pdf_chunks"):
    persist_directory = "/Users/apple/Documents/Projects/LegalAI/chroma_db"
    embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

    vectordb = Chroma.from_texts(
        texts=chunks,
        embedding=embeddings,
        persist_directory=persist_directory,
        collection_name=collection_name
    )
    vectordb.persist()
    print(f"✅ Stored {len(chunks)} chunks in {persist_directory}.")


def process_pdf_to_chromadb(pdf_path):
    text = extract_pdf_text(pdf_path)
    chunks = chunk_text(text)
    store_chunks_in_chromadb(chunks)


if __name__ == "__main__":
    pdf_file = "/Users/apple/Documents/Projects/LegalAI/Data/CISF Act.pdf"
    process_pdf_to_chromadb(pdf_file)
    print("PDF text extracted, chunked, and stored in ChromaDB.")
