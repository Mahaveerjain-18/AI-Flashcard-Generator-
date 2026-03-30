# FlashAI - AI-Powered Flashcard Generator

FlashAI is a modern, intelligent flashcard application that helps you master any subject using the power of AI and spaced repetition.

![FlashAI Preview](https://picsum.photos/seed/flashcards/1200/600)

## ✨ Features

- **🤖 AI Generation**: Instantly turn your study notes, articles, or textbook content into high-quality flashcards using Google Gemini or Anthropic Claude.
- **🧠 Spaced Repetition**: Optimized learning using a custom implementation of the SM-2 algorithm to ensure you review cards at the perfect time.
- **📊 Learning Dashboard**: Track your progress with detailed stats on total cards, due items, and mastered content.
- **🎨 Modern UI/UX**: A beautiful, responsive interface built with Tailwind CSS and smooth animations using Motion.
- **🔒 Privacy First**: Your data and API keys are stored locally in your browser. No server-side storage of your personal study material.

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/flash-ai.git
   cd flash-ai
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## ⚙️ Configuration

### AI Engines

- **Google Gemini (Default)**: FlashAI uses the Gemini API for free, automatic flashcard generation. No setup is required for the default experience.
- **Anthropic Claude (Optional)**: If you prefer using Claude 3.5 Sonnet, you can provide your own API key in the **Settings** menu within the app.

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite
- **Styling**: Tailwind CSS
- **Animations**: Motion (formerly Framer Motion)
- **Icons**: Lucide React
- **AI Integration**: @google/genai, Anthropic API
- **Utilities**: UUID, clsx, tailwind-merge

## 📖 How to Use

1. **Create a Deck**: Click "Create New Deck" on the dashboard.
2. **Paste Content**: Paste your study material (notes, text, etc.) into the generator.
3. **Generate**: Click "Generate Cards" and watch the AI create your study set.
4. **Review**: Preview and edit the cards, then save the deck.
5. **Study**: Click the review icon on any deck to start your spaced repetition session.

---

Built with ❤️ using AI.
