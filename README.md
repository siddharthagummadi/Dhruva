# ध्रुव — Dhruva

> *"As Dhruva, the Pole Star, stands unwavering in the cosmos — so too shall wisdom anchor your path."*

**Dhruva** is a premium, wellness-grade AI guide grounded in the philosophical depths of the Valmiki Ramayana and Mahabharata. It offers calm, meditative responses enriched with Sanskrit verses, IAST transliterations, and universal ethical reflections.

---

## ✨ Features

- **Gemini-powered Chat** — Backed by `gemini-2.5-flash` for intelligent, contextual dharmic guidance
- **Premium Deep-Space UI** — Dark cosmic aesthetic with soft cyan accents and glassmorphism
- **Custom SVG Logo** — Minimal Fixed Star + Gravitational Rings mark (CSS geometry, no images)
- **CSS-only Cosmic Symbols** — 5 animated celestial symbols in the top bar with Sanskrit name tooltips on click
- **Light / Dark Theme Toggle** — Full palette switch with `localStorage` persistence
- **Sanskrit Verse Rendering** — Devanagari stanzas auto-detected and rendered as styled verse blocks
- **Markdown Rendering** — Bold, italic, headers, bullet lists, and inline code fully formatted
- **Functional Calendar Popover** — Month navigation, today highlight, midnight auto-refresh
- **Daily Reflections Sidebar** — 5 dual-language (Sanskrit + English) quote cards from Gita, Ramayana, Mahabharata
- **Mobile Responsive** — Adapts cleanly at 768px and 480px breakpoints

---

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/dhruva-bot.git
cd dhruva-bot
```

### 2. Install dependencies
```bash
pip install flask flask-cors google-generativeai python-dotenv
```

### 3. Set up your API key
Create a `.env` file in the project root:
```
GEMINI_API_KEY=your_api_key_here
```
> Get your free API key at [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)

### 4. Run the app
```bash
python main.py
```
Open your browser at **http://127.0.0.1:5000**

---

## 🗂️ Project Structure

```
dhruva-bot/
├── main.py                 # Flask server + Gemini API logic
├── templates/
│   └── index.html          # App shell & UI structure
├── static/
│   ├── style.css           # Design system (Deep Space + Slate)
│   ├── script.js           # UI logic (Calendar, Tooltips, Theme, Markdown)
│   └── dhruva-logo.svg     # Custom North Star logo
├── data/
│   ├── gita_ch1.json       # Bhagavad Gita reference data
│   ├── gita_ch2.json
│   ├── gita_ch3.json
│   └── ramayana.json       # Ramayana reference data
├── .env                    # API keys (not committed)
├── .gitignore
└── requirements.txt
```

---

## 🎨 Design System

| Token | Value | Usage |
|-------|-------|-------|
| `--bg-primary` | `#0B0C10` | Page background |
| `--bg-surface` | `#1F2833` | Cards, bubbles |
| `--accent` | `#66FCF1` | Cyan highlights |
| `--text-primary` | `#C5C6C7` | Body text |
| `--text-muted` | `#8892b0` | Labels |

**Light mode** uses a clean slate palette (`#F1F5F9`) with deeper teal accents.

---

## 🔮 Cosmic Symbols

Five CSS-only animated symbols in the top bar. Click any to reveal its Sanskrit name:

| Symbol | Sanskrit | Meaning |
|--------|---------|---------|
| Orbit Ring | कक्षा (Kakṣā) | The orbital path |
| 4-Point Star | ध्रुव (Dhruva) | The Pole Star |
| Diamond | वज्र (Vajra) | The Indestructible |
| Concentric Ring | मण्डल (Maṇḍala) | Sacred Circle |
| Breathing Dot | बिन्दु (Bindu) | The Primal Point |

---

## ⚙️ Environment Variables

| Variable | Description |
|----------|-------------|
| `GEMINI_API_KEY` | Your Google AI Studio API key |

---

## 📦 Requirements

```
flask
flask-cors
google-generativeai
python-dotenv
```

---

## 📄 License

MIT License — feel free to use, modify, and distribute.

---

*Built with calm intention. Guided by ancient wisdom. Powered by modern AI.*
