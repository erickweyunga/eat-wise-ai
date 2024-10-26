# AFYA AI CHATBOT Backend 🌐

**EatWise Backend** – The Powerhouse Behind the Health Chatbot

---

This backend service is the backbone of **EatWise**, an open-source AI-powered chatbot for healthcare assistance. It’s responsible for managing the chatbot’s AI model, handling user requests, and ensuring seamless interactions with the frontend.

---

## 🚀 Tech Stack

The EatWise backend is built on a solid foundation of open-source tools:

- **Flask** – A lightweight, efficient web framework for managing backend API operations
- **LangChain** – Integrates and orchestrates the language model for context-rich, reliable AI responses
- **Llama 3 (70B)** – A high-performance language model delivering accurate and empathetic health-related information

These tools enable the EatWise backend to be flexible, scalable, and responsive.

---

### 📁 Project Structure

The backend is organized for modularity and ease of development:

├── afya_llm_backend/ │ ├── api/ # core of the APIs │ ├── machine_learning/ # API route definitions for machine learing microservice │ ├── generate_rag/ # RAG generating service │ └── main.py # Main root API ├── config.py # Configuration settings ├── /_init.py # API core ├── requirements.txt # Project dependencies └── README.md # Documentation

---

### 🌱 Getting Started

To set up the backend locally:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/am-eric-kweyunga/eat-wise-ai
   cd eat-wise-ai/afya_llm_backend
   ```

2. **Install dependencies:**

   ```bash
   pip install -r requirements.txt
   ```

3. **Set up the environment variables:**
   Configure variables for API keys, model paths, and Flask settings in a .env file.

4. **Run the backend:**

    ```bash
    flask run
    ```

---

### 🤝 Contributin

We welcome contributions! If you have ideas, find bugs, or want to suggest features, feel free to open an issue or submit a pull request.

- [EatWise Backend on GitHub](https://github.com/am-eric-kweyunga/eat-wise-ai/afya_llm_backend)

Let’s build a more accessible healthcare solution, together. 🌍✨
