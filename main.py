from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# Configure Gemini
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    # Fallback to streamlit secrets if running in an environment that has them, 
    # but for local flask we use .env
    print("WARNING: GEMINI_API_KEY not found in environment variables.")

genai.configure(api_key=api_key)

SYSTEM_INSTRUCTION = (
    "You are 'Dhruva' (ध्रुव), a professional, academic AI guide grounded in the Valmiki Ramayana, Mahabharata, and Bhagavad Gita. "
    "Your purpose is to provide clear, factual answers first, followed by concise, relevant wisdom. "
    "CORE PRINCIPLES: "
    "1. factual FIRST: Ensure you answer the user's factual questions directly and concisely before adding any philosophical reflections. "
    "2. If applicable, optionally provide a single relevant Sanskrit verse (with Devanagari, IAST, and English translation) after the factual answer. "
    "3. Keep responses highly relevant, structured, and easy to read. Do not over-philosophize simple queries. "
    "4. Frame epics as academic or psychological archetypes rather than religious figures. "
    "5. Format verses distinctly so the frontend can render them clearly. "
    "6. [MERMAID VISUALIZATION]: If the user's query involves a process, cycle, conflict, relationship, or concept that can be visualized (like Karma, character connections, Dharma), ALWAYS output a Mermaid.js diagram block starting with ```mermaid and ending with ```. Use flowchart TD or LR. Keep it concise."
)

model = genai.GenerativeModel(
    model_name="gemini-2.5-flash",
    system_instruction=SYSTEM_INSTRUCTION
)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    user_message = data.get('message')
    history = data.get('history', [])

    if not user_message:
        return jsonify({"error": "No message provided"}), 400

    try:
        # Format history for Gemini
        formatted_history = []
        for msg in history:
            role = "user" if msg['role'] == "user" else "model"
            formatted_history.append({"role": role, "parts": [msg['content']]})

        chat_session = model.start_chat(history=formatted_history)
        response = chat_session.send_message(user_message)
        
        return jsonify({
            "reply": response.text,
            "status": "success"
        })
    except Exception as e:
        return jsonify({"error": str(e), "status": "error"}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
