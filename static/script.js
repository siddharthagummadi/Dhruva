// --- Configuration & Elements ---
const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const chatContainer = document.getElementById('chat-container');
const reflectionSidebar = document.getElementById('reflection-sidebar');

// --- Mock Reflection Data ---
const reflections = [
    { sanskrit: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।", english: "Perform your duty with a calm mind, without attachment to the results.", source: "GITA 2.47" },
    { sanskrit: "योऽन्तःसुखोऽन्तरारामस्तथा", english: "He who finds happiness within is truly free.", source: "GITA 5.24" },
    { sanskrit: "सत्यमेव जयते नानृतम्", english: "Truth alone triumphs, not falsehood.", source: "MUNDAKA UPANISHAD / RAMAYANA" },
    { sanskrit: "धर्मो रक्षति रक्षितः", english: "Dharma protects those who protect it.", source: "MAHABHARATA" },
    { sanskrit: "यतो धर्मस्ततो जयः", english: "Where there is Dharma, there is Victory.", source: "MAHABHARATA — BHISHMA PARVA" }
];

// --- Calendar UI Manager ---
class UIManager {
    constructor() {
        this.date = new Date();
        this.calendarPopover = document.getElementById('calendar-popover');
        this.calendarBtn = document.getElementById('calendar-btn');
        this.init();
    }

    init() {
        this.setupCalendar();
        this.setupEventListeners();
        this.setupMidnightRefresh();
    }

    setupCalendar() {
        this.daysContainer = document.getElementById('calendar-days');
        this.monthYearTitle = document.getElementById('current-month-year');
        this.todayText = document.getElementById('today-text');
        this.renderCalendar();
    }

    setupEventListeners() {
        // Calendar Toggle
        this.calendarBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.calendarPopover.classList.toggle('hidden');
        });

        // Close Button
        document.getElementById('close-calendar').addEventListener('click', () => this.calendarPopover.classList.add('hidden'));

        // Calendar Nav
        document.getElementById('prev-month').addEventListener('click', () => this.changeMonth(-1));
        document.getElementById('next-month').addEventListener('click', () => this.changeMonth(1));
        
        // Click Outside
        document.addEventListener('click', (e) => {
            if (!this.calendarPopover.contains(e.target) && !this.calendarBtn.contains(e.target)) {
                this.calendarPopover.classList.add('hidden');
            }
        });
    }

    changeMonth(delta) {
        this.date.setMonth(this.date.getMonth() + delta);
        this.renderCalendar();
    }

    renderCalendar() {
        const year = this.date.getFullYear();
        const month = this.date.getMonth();
        const today = new Date();
        
        this.monthYearTitle.innerText = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(this.date);
        this.todayText.innerText = `Today: ${new Intl.DateTimeFormat('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }).format(today)}`;

        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        this.daysContainer.innerHTML = '';
        for (let i = 0; i < firstDay; i++) {
            const empty = document.createElement('div');
            empty.className = 'day empty';
            this.daysContainer.appendChild(empty);
        }

        for (let d = 1; d <= daysInMonth; d++) {
            const dayEl = document.createElement('div');
            dayEl.className = 'day';
            dayEl.innerText = d;
            if (d === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
                dayEl.classList.add('today');
            }
            this.daysContainer.appendChild(dayEl);
        }
    }

    setupMidnightRefresh() {
        const now = new Date();
        const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
        setTimeout(() => {
            this.renderCalendar();
            this.setupMidnightRefresh();
        }, tomorrow - now);
    }
}

// --- Cosmic Symbol Tooltips ---
function initCosmicTooltips() {
    const tooltip = document.getElementById('cosmic-tooltip');
    const ctSanskrit = tooltip.querySelector('.ct-sanskrit');
    const ctRoman    = tooltip.querySelector('.ct-roman');
    const ctMeaning  = tooltip.querySelector('.ct-meaning');
    let activeSymbol = null;
    let hideTimer = null;

    document.querySelectorAll('.cosmic-sym').forEach(sym => {
        sym.addEventListener('click', (e) => {
            e.stopPropagation();
            clearTimeout(hideTimer);

            // Toggle off if clicking the same symbol
            if (activeSymbol === sym && !tooltip.classList.contains('hidden')) {
                showHide(false);
                activeSymbol = null;
                return;
            }

            activeSymbol = sym;
            ctSanskrit.textContent = sym.dataset.name;
            ctRoman.textContent    = sym.dataset.roman;
            ctMeaning.textContent  = sym.dataset.meaning;

            tooltip.classList.remove('hidden');
            tooltip.style.animation = 'tooltip-in 260ms cubic-bezier(0.4,0,0.2,1) forwards';

            // Auto-dismiss after 4 seconds
            hideTimer = setTimeout(() => showHide(false), 4000);
        });
    });

    document.addEventListener('click', () => {
        showHide(false);
        activeSymbol = null;
    });

    function showHide(show) {
        clearTimeout(hideTimer);
        if (!show) {
            tooltip.classList.add('hidden');
        }
    }
}

// --- Theme Toggle ---
function initTheme() {
    const btn = document.getElementById('theme-btn');
    // Apply saved preference immediately
    if (localStorage.getItem('dhruva-theme') === 'light') {
        document.documentElement.classList.add('light');
    }

    btn.addEventListener('click', () => {
        const isLight = document.documentElement.classList.toggle('light');
        localStorage.setItem('dhruva-theme', isLight ? 'light' : 'dark');
        btn.setAttribute('title', isLight ? 'Switch to Dark' : 'Switch to Light');
    });
}

// --- Initialization ---
function init() {
    new UIManager();
    initCosmicTooltips();
    initTheme();
    renderReflections();
    userInput.focus();
}

// --- Sidebar Logic ---
function renderReflections() {
    reflectionSidebar.innerHTML = '<h4 style="font-size: 0.75rem; letter-spacing: 2px; color: var(--text-muted); margin-bottom: 12px;">DAILY REFLECTIONS</h4>';
    
    reflections.forEach((ref, index) => {
        const card = document.createElement('div');
        card.className = 'quote-card';
        card.innerHTML = `
            <div class="quote-sanskrit">${ref.sanskrit}</div>
            <p class="quote-text">${ref.english}</p>
            <span class="source-label">${ref.source}</span>
        `;
        
        card.addEventListener('click', () => {
            card.classList.toggle('expanded');
        });
        
        reflectionSidebar.appendChild(card);
    });
}

// --- Chat Logic ---
let chatHistory = [];

chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const message = userInput.value.trim();
    if (!message) return;

    addMessage(message, 'user');
    userInput.value = '';
    
    chatHistory.push({ role: 'user', content: message });
    const loadingId = addMessage('...', 'assistant');

    try {
        const response = await fetch('/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                message: message,
                history: chatHistory.slice(0, -1)
            })
        });

        const data = await response.json();
        
        if (data.status === 'success') {
            updateMessage(loadingId, data.reply);
            chatHistory.push({ role: 'assistant', content: data.reply });
        } else {
            updateMessage(loadingId, 'We are experiencing an interruption. Please try again.');
        }
    } catch (error) {
        updateMessage(loadingId, 'Connection lost. Please check your path.');
    }
});

function addMessage(text, role) {
    const id = Date.now();
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role}`;
    messageDiv.id = id;
    
    messageDiv.innerHTML = `
        <div class="bubble">
            ${parseContent(text)}
        </div>
    `;
    
    chatContainer.appendChild(messageDiv);
    chatContainer.scrollIntoView({ behavior: 'smooth', block: 'end' });
    return id;
}

function updateMessage(id, text) {
    const messageDiv = document.getElementById(id);
    if (messageDiv) {
        const bubble = messageDiv.querySelector('.bubble');
        bubble.innerHTML = parseContent(text);
        chatContainer.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
}

function parseContent(text) {
    // 1. Detect full Devanagari stanzas FIRST (before any other processing)
    const slokaRegex = /((?:.*[\u0900-\u097F].*\n?)+)/g;
    let parsed = text.replace(slokaRegex, (match) => {
        const verseHtml = match.trim().replace(/\n/g, '<br>');
        return `\n<div class="verse-block"><span class="verse-text">${verseHtml}</span></div>\n`;
    });

    // 2. Render markdown — line by line for block elements, then inline
    const lines = parsed.split('\n');
    const output = [];
    let inList = false;
    let listTag = '';

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];

        // Already a verse-block HTML? Pass through as-is
        if (line.trim().startsWith('<div class="verse-block"')) {
            if (inList) { output.push(`</${listTag}>`); inList = false; }
            output.push(line);
            continue;
        }

        // Headers
        if (line.match(/^### (.+)/))      { if (inList) { output.push(`</${listTag}>`); inList = false; } output.push(`<h4 class="md-h4">${line.replace(/^### /, '')}</h4>`); continue; }
        if (line.match(/^## (.+)/))       { if (inList) { output.push(`</${listTag}>`); inList = false; } output.push(`<h3 class="md-h3">${line.replace(/^## /, '')}</h3>`); continue; }
        if (line.match(/^# (.+)/))        { if (inList) { output.push(`</${listTag}>`); inList = false; } output.push(`<h2 class="md-h2">${line.replace(/^# /, '')}</h2>`); continue; }

        // Horizontal rule
        if (line.match(/^---+$|^\*\*\*+$/)) { output.push('<hr class="md-hr">'); continue; }

        // Unordered list items
        if (line.match(/^[-*] (.+)/)) {
            if (!inList || listTag !== 'ul') { if (inList) output.push(`</${listTag}>`); output.push('<ul class="md-ul">'); inList = true; listTag = 'ul'; }
            output.push(`<li>${line.replace(/^[-*] /, '')}</li>`);
            continue;
        }

        // Ordered list items
        if (line.match(/^\d+\. (.+)/)) {
            if (!inList || listTag !== 'ol') { if (inList) output.push(`</${listTag}>`); output.push('<ol class="md-ol">'); inList = true; listTag = 'ol'; }
            output.push(`<li>${line.replace(/^\d+\. /, '')}</li>`);
            continue;
        }

        // Close any open list
        if (inList && line.trim() === '') { output.push(`</${listTag}>`); inList = false; }

        output.push(line);
    }
    if (inList) output.push(`</${listTag}>`);

    parsed = output.join('\n');

    // 3. Inline markdown: bold, italic, inline code
    parsed = parsed
        .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
        .replace(/\*\*(.+?)\*\*/g,      '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g,           '<em>$1</em>')
        .replace(/`([^`]+)`/g,           '<code class="md-code">$1</code>');

    // 4. Convert remaining newlines to <br>
    parsed = parsed.replace(/\n/g, '<br>');

    return parsed;
}

init();
