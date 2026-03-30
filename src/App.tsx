import React, { useState, useEffect } from "react";
import { Settings as SettingsIcon, BrainCircuit, Sparkles } from "lucide-react";
import { View, Deck, Card, FlashcardDecks } from "./types";
import { cn } from "./lib/utils";
import Dashboard from "./components/Dashboard";
import GenerateFlashcards from "./components/GenerateFlashcards";
import ReviewCards from "./components/ReviewCards";
import Settings from "./components/Settings";
import { motion, AnimatePresence } from "motion/react";

const STORAGE_KEY = "flashcard_decks";
const API_KEY_STORAGE = "anthropic_api_key";

export default function App() {
  const [view, setView] = useState<View>("dashboard");
  const [decks, setDecks] = useState<Deck[]>([]);
  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null);
  const [apiKey, setApiKey] = useState<string | null>(null);

  // Load data on mount
  useEffect(() => {
    const savedDecks = localStorage.getItem(STORAGE_KEY);
    if (savedDecks) {
      try {
        const parsed = JSON.parse(savedDecks) as FlashcardDecks;
        setDecks(parsed.decks || []);
      } catch (e) {
        console.error("Failed to parse saved decks", e);
      }
    }

    const savedKey = localStorage.getItem(API_KEY_STORAGE);
    if (savedKey) {
      setApiKey(savedKey);
    }
  }, []);

  // Save data on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ decks }));
    } catch (e) {
      if (e instanceof DOMException && e.name === "QuotaExceededError") {
        alert("Storage quota exceeded. Please delete some decks to save more.");
      }
    }
  }, [decks]);

  const handleSaveDeck = (newDeck: Deck) => {
    setDecks((prev) => [newDeck, ...prev]);
  };

  const handleDeleteDeck = (id: string) => {
    setDecks((prev) => prev.filter((d) => d.id !== id));
  };

  const handleUpdateCard = (deckId: string, updatedCard: Card) => {
    setDecks((prev) =>
      prev.map((deck) => {
        if (deck.id === deckId) {
          return {
            ...deck,
            cards: deck.cards.map((card) => (card.id === updatedCard.id ? updatedCard : card)),
          };
        }
        return deck;
      })
    );
  };

  const handleSaveApiKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem(API_KEY_STORAGE, key);
  };

  const handleDeckSelect = (deck: Deck) => {
    setSelectedDeck(deck);
    setView("review");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50/50 font-sans selection:bg-blue-100 selection:text-blue-600">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-20 flex justify-between items-center">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setView("dashboard")}
          >
            <div className="p-2.5 bg-blue-500 text-white rounded-2xl shadow-lg shadow-blue-100 group-hover:rotate-12 transition-transform duration-300">
              <BrainCircuit size={28} strokeWidth={2.5} />
            </div>
            <span className="text-2xl font-black tracking-tight text-gray-900">FlashAI</span>
          </motion.div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest bg-blue-50 text-blue-500 border border-blue-100">
              <Sparkles size={14} />
              <span>Gemini Active</span>
            </div>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 15 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setView("settings")}
              className="p-3 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-2xl transition-all"
              title="Settings"
            >
              <SettingsIcon size={24} />
            </motion.button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "circOut" }}
            className="w-full"
          >
            {view === "dashboard" && (
              <Dashboard
                decks={decks}
                onViewChange={setView}
                onDeckSelect={handleDeckSelect}
                onDeleteDeck={handleDeleteDeck}
                apiKey={apiKey}
              />
            )}

            {view === "generate" && (
              <GenerateFlashcards
                onViewChange={setView}
                onSaveDeck={handleSaveDeck}
                apiKey={apiKey}
              />
            )}

            {view === "review" && selectedDeck && (
              <ReviewCards
                deck={selectedDeck}
                onViewChange={setView}
                onUpdateCard={handleUpdateCard}
              />
            )}

            {view === "settings" && (
              <Settings
                onViewChange={setView}
                apiKey={apiKey}
                onSaveApiKey={handleSaveApiKey}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="py-12 text-center border-t border-gray-100 bg-white">
        <div className="max-w-6xl mx-auto px-6 flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 text-gray-300">
            <BrainCircuit size={20} />
            <span className="font-black uppercase tracking-widest text-[10px]">FlashAI</span>
          </div>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">
            © 2026 • Powered by Gemini AI
          </p>
        </div>
      </footer>
    </div>
  );
}
