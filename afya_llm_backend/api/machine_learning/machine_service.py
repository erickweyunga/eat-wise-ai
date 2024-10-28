import logging
from langchain_community.chat_models import ChatDeepInfra
import os
from typing import List

import dotenv

from langchain_core.chat_history import BaseChatMessageHistory
from langchain_core.messages import BaseMessage
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.pydantic_v1 import BaseModel, Field
from langchain_core.runnables import (
    ConfigurableFieldSpec,
    RunnablePassthrough,
)
from langchain_core.runnables.history import RunnableWithMessageHistory


class InMemoryHistory(BaseChatMessageHistory, BaseModel):
    """In memory implementation of chat message history."""

    messages: List[BaseMessage] = Field(default_factory=list)

    def add_messages(self, messages: List[BaseMessage]) -> None:
        """Add a list of messages to the store"""
        self.messages.extend(messages)

    def clear(self) -> None:
        self.messages = []


store = {}


#################################################################


def get_session_history(user_id: str, conversation_id: str) -> BaseChatMessageHistory:
    if (user_id, conversation_id) not in store:
        store[(user_id, conversation_id)] = InMemoryHistory()
    return store[(user_id, conversation_id)]


##################################################################

dotenv.load_dotenv()

DEEPINFRA_API_TOKEN = os.environ["DEEPINFRA_API_TOKEN"]
DEEPINFRA_LANG_MODEL = os.environ["DEEPINFRA_LANG_MODEL"]

# Defining the model
model = ChatDeepInfra(
    model_id=DEEPINFRA_LANG_MODEL,
    deepinfra_api_token=DEEPINFRA_API_TOKEN,
    top_k=1,
    temperature=0.8,
)


def chatbot(message: str, config: dict):

    prompt = ChatPromptTemplate.from_messages(
        [
            (
                "system",
                "You're a health assistant named EatWise who is skilled in health-related topics, primarily meals and foods to maintain body fitness and prevent obesity and diabetes. You respond in English, even if the question is in Swahili. Be strict and concise, and keep your response organized and under 200 words.",
            ),
            (
                "system",
                "You should answer all questions referring to the provided knowledge base. The following is the knowledge base: {knowledge_base}",
            ),
            (
                "system",
                "Always start conversations with a warm and friendly greeting, showing interest in the user's health. Example: 'Hello! How can I assist you with your health today?'",
            ),
            (
                "system",
                "Politely ask users to share their current weight and target weight to offer personalized health advice. For example: 'Please share your current weight and target weight. I'll help you with a plan to reach those goals.'",
            ),
            (
                "system",
                "Provide concise health guidance when users ask for diet or exercise tips. Frame responses as supportive suggestions, like 'To lose weight, it's beneficial to focus on natural foods like vegetables and fruits. Light exercise, such as walking for 30 minutes each day, will also help.'",
            ),
            (
                "system",
                "If users ask questions outside of health, nutrition, and fitness, politely decline with a friendly response. Example: 'I'm sorry, I can only assist with questions about health, nutrition, and fitness. Please ask me something related to your health goals.'",
            ),
            (
                "system",
                "Encourage users to ask more questions if they need clarification or further guidance. Example: 'Is there anything else you'd like to know about your diet or exercise plan?'",
            ),
            (
                "system",
                "If users continue to ask unrelated questions, respond firmly but kindly to redirect the conversation. Example: 'I'm here to help with health-related questions only. Let's focus on your wellness!'",
            ),
            (
                "system",
                "Acknowledge users' efforts and motivate them positively when they share their progress. Example: 'Congratulations on your efforts! Taking small steps every day can lead to great results.'",
            ),
            (
                "system",
                "When users ask for immediate services like pharmacies or hospitals, provide information on nearby health facilities. Example: 'If you need immediate services like a pharmacy, clinic, or nearby hospital, I can help you find a location. Please choose the service you need.'",
            ),
            (
                "system",
                "Always remain focused on providing health-related advice. If users attempt to divert to unrelated topics, kindly and respectfully bring the focus back to health, fitness, or wellness goals.",
            ),
            MessagesPlaceholder(variable_name="history"),
            ("human", "{question}"),
        ]
    )

    chain = prompt | model | RunnablePassthrough()

    chain_ = RunnableWithMessageHistory(
        chain,
        get_session_history,
        input_messages_key="question",
        history_messages_key="history",
        history_factory_config=[
            ConfigurableFieldSpec(
                id="user_id",
                annotation=str,
                name="User ID",
                description="Unique identifier for the user.",
                default="",
                is_shared=True,
            ),
            ConfigurableFieldSpec(
                id="conversation_id",
                annotation=str,
                name="Conversation ID",
                description="Unique identifier for the conversation.",
                default="",
                is_shared=True,
            ),
        ],
    )

    AI_RESPONSE = chain_.invoke(
        {
            "question": message,
            "knowledge_base": config.get("knowledge_base"),
        },
        config={
            "configurable": {
                "user_id": config.get("user_id"),
                "conversation_id": config.get("conversation_id"),
            }
        },
    )

    logging.info(f"AI_RESPONSE: {AI_RESPONSE}")

    return AI_RESPONSE
