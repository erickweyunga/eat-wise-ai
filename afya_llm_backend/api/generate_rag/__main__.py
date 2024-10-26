from api.machine_learning.rag_service import generate_rag_vector_store

#  Define the root directory
from api.config import ROOT_DIR

# Document loader
rag_data_dir = ROOT_DIR / "storage/datastore"

def main():
    # generate_rag_vector_store()
    promise = generate_rag_vector_store(rag_data_dir=rag_data_dir, ROOT_DIR=ROOT_DIR)

    # print(promise)
    print(f"Sucessful, {promise}")
    
if __name__ == "__main__":
    main()
