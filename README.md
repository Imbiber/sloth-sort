# 🦥 SlothSort

> **The Zero-Effort File & Clutter Tidier for International Sloth Day**  
> Powered by **Google Gemma 2** (running 100% locally via Ollama) and **ElevenLabs Voice AI**.  
> Built for the **Hacktoberfest Open-Source AI Challenge: Week 3 — Slow and Steady**.

[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](https://opensource.org/licenses/MIT)
[![Gemma 2](https://img.shields.io/badge/Google_Gemma_2-Ollama-4285F4)](https://ollama.com/library/gemma2)
[![ElevenLabs](https://img.shields.io/badge/ElevenLabs-TTS_v2-black)](https://elevenlabs.io)

---

## 🦥 The Prompt & Theme: Slow and Steady

International Sloth Day reminds us that sloths have it figured out: move at your own pace, conserve energy, and let automation do the work so you don't have to.

Everyone has a messy `Downloads/` or `Desktop/` folder loaded with chaotic filenames like:
- `Screen Shot 2026-10-21 at 11.45.12 PM.png`
- `final_pitch_deck_v3_revised_FINAL2.pptx`
- `Receipt_Uber_Eats_Oct14.pdf`
- `IMG_20261019_142311.jpg`

Sorting these manually requires hundreds of clicks, drag-and-drops, and cognitive energy you'd rather spend relaxing.

**SlothSort** is a lazy person's dream:
1. Drag or paste in your messy files.
2. Local **Gemma 2** inspects, understands, and categorizes every file into clean directories with clean semantic names.
3. **ElevenLabs** plays a witty, soothing audio debrief celebrating how lazy you get to be today.
4. Provides a 1-click **Bash execution script** so your files are sorted instantly on your computer.

---

## 🔒 Why Open Innovation Matters

1. **100% Privacy on Personal Files**: Your desktop clutter contains sensitive tax forms, private invoices, client NDAs, and confidential photos. By running **Gemma 2 locally on-device**, your files and filenames never touch an external third-party server.
2. **Zero Recurring LLM Fees**: Cloud APIs charge per token. A user cleaning 500 files a day would rack up bills. Running Gemma 2 locally via Ollama costs $0 forever.
3. **True Offline Resilience**: Works in an airplane or off the grid without an internet connection.

---

## 🏆 Prize Categories

- **Best Use of Gemma ($200)**: Employs Google's open-weight Gemma 2 model locally via Ollama for semantic classification, intelligent renaming, and sloth debrief generation.
- **Best Use of ElevenLabs ($100)**: Uses ElevenLabs Multilingual v2 to generate relaxing spoken voice debriefs.

---

## 🚀 Getting Started

### 1. Prerequisites
- [Ollama](https://ollama.com/) installed and running:
  ```bash
  ollama run gemma2:latest
  ```
- Node.js 18+ and npm.

### 2. Installation
```bash
git clone https://github.com/Imbiber/sloth-sort.git
cd sloth-sort
npm install
```

### 3. Environment Variables
Copy `.env.example` to `.env.local`:
```env
OLLAMA_BASE_URL=http://localhost:11434
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 License

MIT License.
