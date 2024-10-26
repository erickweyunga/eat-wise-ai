# defining the views for the machine learning api
import json
import os, logging
import pathlib
from flask import Blueprint, request, jsonify, Response, session
from bson import ObjectId

# service imports
from api.machine_learning.machine_service import chatbot
from api.machine_learning.rag_service import (
    generate_rag_vector_store,
    vector_store_retriever,
)

bp_name = "machine"
bp = Blueprint(bp_name, __name__)

# root directory
from api.config import ROOT_DIR

restricted_questions = []

restricted_answeres = []


@bp.route("/respond", methods=["POST", "GET"])
# @authorization_guard
def run():
    if request.method == "POST":
        data = request.json
        if not data:
            return Response("No data provided", status=400)

        message = data["message"]

        # Rag Directory
        storage_dir = ROOT_DIR / "storage"

        if not storage_dir.exists():
            return Response("Storage directory not found", status=404)
        try:
            retriever = vector_store_retriever(ROOT_DIR=ROOT_DIR)
            logging.info(f"Retriever retrieved successfully!")
            if retriever:
                response_ = retriever.invoke(input=message)

                config = {
                    "user_id": "1",
                    "conversation_id": "1",
                    "knowledge_base": response_,
                }

                # Response from machine
                res = chatbot(config=config, message=message)
                return jsonify({"message": res.content})
            else:
                logging.error("Retriever unregistered")
                return Response("Retriever unregistered", status=404)
        except Exception as e:
            logging.error(f"{e}")
            return Response("Unable to retrieve knowledge base", status=404)

    else:
        return Response("Method not allowed", status=405)


@bp.route("/rag", methods=["GET"])
def rag():
    # Rag Directory
    storage_dir = ROOT_DIR / "storage"
    rag_data_dir = ROOT_DIR / "storage/datastore/mwongozo_wa_chakula_bora_tanzania.pdf"

    if not storage_dir.exists():
        return Response("Storage directory not found", status=404)
    try:
        promise = generate_rag_vector_store(
            rag_data_dir=rag_data_dir, ROOT_DIR=ROOT_DIR
        )
        if promise["status"] == "success":
            return Response("RAG generated", status=200)
        else:
            return Response("RAG not generated", status=404)
    except Exception as e:
        logging.error(f"Error: {e}")
        return Response("RAG not generated", status=404)


@bp.route("/rag/vector", methods=["GET"])
def rag_vector():
    # Rag Directory
    storage_dir = ROOT_DIR / "storage"
    # rag_data_dir = ROOT_DIR / "storage/datastore/career_guidance.pdf"

    if not storage_dir.exists():
        return Response("Storage directory not found", status=404)
    try:
        retriever = vector_store_retriever(ROOT_DIR=ROOT_DIR)
        if retriever:
            response_ = retriever.invoke("Chakula ni nini?")
            print(response_[0].page_content)
            return Response("rag"), 200
        else:
            return Response("RAG not generated", status=404)
    except Exception as e:
        logging.error(f"Error: {e}")
        return Response("RAG not generated", status=404)
