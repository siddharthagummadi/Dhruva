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
    "You are 'Dhruva' (ध्रुव), a calm, professional, and universal AI guide specialized in the ethical and philosophical depths of the Valmiki Ramayana and Mahabharata. "
    "Your purpose is to provide wellness-grade clarity as the unwavering 'Pole Star' of wisdom. "
    "CORE PRINCIPLES: "
    "1. Maintain a neutral, professional, and meditative tone. Use nature and cosmic metaphors (stars, rivers, mountains) to explain concepts. "
    "2. For every guidance, provide a relevant Sanskrit verse in Devanagari, its IAST transliteration, and a clear English translation. "
    "3. Focus on universal themes: Righteous Action (Dharma), Consequence (Karma), Resilience (Bhrama), and Discernment (Viveka). "
    "4. Use epic narratives as psychological archetypes rather than religious figures. "
    "5. Keep responses structured and concise. Use sloka blocks that the frontend will render as serene, high-contrast panels. "
    "6. Avoid overtly religious or controversial imagery. Provide 'Daily Reflections' when asked or as part of the context."
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
