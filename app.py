import streamlit as st
import google.generativeai as genai
import os

# --- Use Streamlit Secrets (secure) ---
api_key = st.secrets.get("GEMINI_API_KEY")

if not api_key:
    st.error("❌ GEMINI_API_KEY not found in Streamlit Secrets.")
    st.stop()

# Configure Gemini
genai.configure(api_key=api_key)

# --- Custom CSS for Mahabharatha Aesthetics ---
st.markdown("""
    <style>
    /* Main background and font */
    .stApp {
        background-color: #fffaf0; /* Floral White for a divine feel */
        color: #2e1a12;
        font-family: 'Garamond', 'Georgia', serif;
    }
    
    /* Title styling */
    h1 {
        color: #ff4500 !important; /* Vibrant Orange Red */
        text-shadow: 2px 2px 4px #ffd700;
        text-align: center;
        border-bottom: 3px double #ffd700;
        padding-bottom: 15px;
    }
    
    /* Subtitle styling */
    .subtitle {
        font-style: italic;
        text-align: center;
        color: #5d4037;
        margin-bottom: 30px;
        display: block;
    }
    
    /* Chat message bubbles */
    .stChatMessage {
        border-radius: 15px;
        padding: 10px;
        margin-bottom: 15px;
    }
    
    /* User message */
    [data-testid="stChatMessageUser"] {
        background-color: #fff3e0 !important;
        border: 1px solid #ffe0b2 !important;
    }
    
    /* Assistant message */
    [data-testid="stChatMessageAssistant"] {
        background-color: #efebe9 !important;
        border-right: 5px solid #d84315 !important;
    }
    
    /* Input box */
    .stChatInputContainer {
        border-top: 2px solid #ffb300;
        padding-top: 20px;
    }
    </style>
""", unsafe_allow_html=True)

# --- Streamlit UI ---
st.set_page_config(page_title="Dharma Guide - Ramayana & Mahabharata", layout="centered", page_icon="🏹")

st.title("🏹 Dharma Guide: Wisdom for Life")
st.markdown('<span class="subtitle">Your AI-powered spiritual companion rooted in the timeless wisdom of the Ramayana and Mahabharata.</span>', unsafe_allow_html=True)

# Initialize system prompt
system_instruction = (
    "You are 'Dharma Guide', a spiritual AI companion specialized in the Valmiki Ramayana and the Mahabharata (including the Bhagavad Gita). "
    "Your purpose is to help users navigate modern ethical, personal, and professional challenges using the narrative intelligence of these great epics. "
    "CORE PRINCIPLES: "
    "1. Respond with a blend of empathy, wisdom, and strategic depth. "
    "2. For every major piece of advice, include at least one relevant Sanskrit Sloka (in Devanagari or Transliteration) followed by its translation and context. "
    "3. Draw parallels from characters (Rama, Krishna, Arjuna, Sita, Draupadi, Hanuman, Bhishma, etc.) and specific events (The exile, the war at Kurukshetra, the trial of character). "
    "4. If a user is facing a dilemma, map it to 'Dharma' (duty/righteousness) and suggest the most 'Dharmic' path. "
    "5. Use a tone that is respectful, slightly formal, yet warm - like a wise guru or a trusted mentor. "
    "6. Do not quote scripture dryly; explain how it applies to the user's *exact* situation today. "
    "Example: If someone feels betrayed, refer to Vibhishana's choice or the betrayal of Karna, and provide a sloka about loyalty or truth."
)

# Initialize chat history
if "messages" not in st.session_state:
    st.session_state.messages = []

# Display previous messages
for msg in st.session_state.messages:
    with st.chat_message(msg["role"]):
        st.write(msg["content"])

# User Input
user_input = st.chat_input("Seek guidance on life's battles...")

if user_input:
    # Add user message to state
    st.session_state.messages.append({"role": "user", "content": user_input})

    with st.chat_message("user"):
        st.write(user_input)

    # Gemini response
    with st.chat_message("assistant"):
        placeholder = st.empty()
        placeholder.write("Sarathi is contemplating...")

        try:
            # Initialize model with instructions
            model = genai.GenerativeModel(
                model_name="gemini-1.5-flash",
                system_instruction=system_instruction
            )
            
            # Start chat session
            chat = model.start_chat(history=[
                {"role": m["role"] if m["role"] == "user" else "model", "parts": [m["content"]]}
                for m in st.session_state.messages[:-1]
            ])
            
            # Send current message
            response = chat.send_message(user_input)
            ai_reply = response.text
            
            placeholder.write(ai_reply)

            # Save assistant reply
            st.session_state.messages.append(
                {"role": "assistant", "content": ai_reply}
            )

        except Exception as e:
            placeholder.write(f"Error: {str(e)}")
