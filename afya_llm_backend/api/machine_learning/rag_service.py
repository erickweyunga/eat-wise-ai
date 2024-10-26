import logging
import os
import dotenv
from langchain_community.document_loaders import DirectoryLoader, PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.embeddings import DeepInfraEmbeddings
from langchain_chroma import Chroma
from openai import OpenAI

# Load environment variables from a .env file
dotenv.load_dotenv()

# Get environment variables
DEEPINFRA_API_TOKEN = os.getenv("DEEPINFRA_API_TOKEN")
DEEPINFRA_EMBEDDINGS_MODEL = os.getenv("DEEPINFRA_EMBEDDINGS_MODEL")

openai = OpenAI(
    api_key=DEEPINFRA_API_TOKEN,
    base_url="https://api.deepinfra.com/v1/openai",
)


def vector_store_retriever(ROOT_DIR):
    
    if DEEPINFRA_EMBEDDINGS_MODEL:
        embeddings = DeepInfraEmbeddings(
            model_id=DEEPINFRA_EMBEDDINGS_MODEL,
            deepinfra_api_token=DEEPINFRA_API_TOKEN,
        )
        logging.info("Embedded docs")
    else:
        embeddings = None
        logging.error("No embeddings model provided")
            
    vector_store_path = os.path.join(ROOT_DIR / "storage" / "rag_store")
    vectordb = Chroma(persist_directory=vector_store_path, embedding_function=embeddings)
    retriever = vectordb.as_retriever(
        search_type="mmr",
        search_kwargs={"k": 3, "fetch_k": 100,},
    )
    return  retriever


def generate_rag_vector_store(rag_data_dir, ROOT_DIR):
    try:
        # Define the directory to load the documents from
        # loader = DirectoryLoader(rag_data_dir, glob="**/*.pdf", show_progress=True)
        loader = PyPDFLoader(rag_data_dir)

        # Load documents
        documents = loader.load()
        logging.info(f"Loaded documents...")

        # Text splitter
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            length_function=len,
            is_separator_regex=False,
        )

        # Split documents into chunks
        chunks_docs = text_splitter.split_documents(documents)
        logging.info(f"Splitted documents...")

        if DEEPINFRA_EMBEDDINGS_MODEL:
            embeddings = DeepInfraEmbeddings(
                model_id=DEEPINFRA_EMBEDDINGS_MODEL,
                deepinfra_api_token=DEEPINFRA_API_TOKEN,
            )
            logging.info("Embedded docs")
            
            # Define the vector store path
            vector_store_path = os.path.join(ROOT_DIR / "storage" / "rag_store")

            # Create and persist the vector store
            Chroma.from_documents(
                chunks_docs,
                embedding=embeddings,
                persist_directory=vector_store_path,
            )
        else:
            embeddings = None
            logging.error("No embeddings model provided")

        return {"status": "success"}

    except Exception as e:
        logging.error(f"Error in generating rag: {e}")
        return {"status": "error"}
