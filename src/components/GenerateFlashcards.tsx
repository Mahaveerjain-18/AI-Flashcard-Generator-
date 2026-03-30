import React, { useState } from "react";
import { ArrowLeft, Sparkles, Loader2, Save, X, Edit2 } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { View, Deck, Card } from "../types";
import { generateFlashcardsWithGemini } from "../services/gemini";
import { generateFlashcards as generateWithAnthropic, GeneratedCard } from "../services/anthropic";
import { cn } from "../lib/utils";
import { motion } from "motion/react";

interface GenerateFlashcardsProps {
  onViewChange: (view: View) => void;
  onSaveDeck: (deck: Deck) => void;
  apiKey: string | null;
}

export default function GenerateFlashcards({ onViewChange, onSaveDeck, apiKey }: GenerateFlashcardsProps) {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCards, setGeneratedCards] = useState<GeneratedCard[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [engine, setEngine] = useState<"gemini" | "anthropic">("gemini");

  const handleGenerate = async () => {
    if (engine === "anthropic" && !apiKey) {
      setError("Please set your Anthropic API key in settings first.");
      return;
    }
    if (content.length < 100) {
      setError("Content must be at least 100 characters.");
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const cards = engine === "gemini" 
        ? await generateFlashcardsWithGemini(content)
        : await generateWithAnthropic(content, apiKey!);
      setGeneratedCards(cards);
    } catch (err: any) {
      setError(err.message || "Failed to generate flashcards. Please check your content and try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    if (!title) {
      setError("Please provide a deck title.");
      return;
    }

    const newDeck: Deck = {
      id: uuidv4(),
      title,
      created: new Date().toISOString(),
      cards: generatedCards.map((c) => ({
        id: uuidv4(),
        front: c.front,
        back: c.back,
        difficulty: c.difficulty,
        nextReview: new Date().toISOString(),
        easeFactor: 2.5,
        interval: 0,
        repetitions: 0,
      })),
    };

    onSaveDeck(newDeck);
    onViewChange("dashboard");
  };

  const handleEditCard = (index: number, field: "front" | "back", value: string) => {
    const newCards = [...generatedCards];
    newCards[index] = { ...newCards[index], [field]: value };
    setGeneratedCards(newCards);
  };

  const removeCard = (index: number) => {
    setGeneratedCards(generatedCards.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8">
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => onViewChange("dashboard")}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-8 transition-colors font-bold text-sm uppercase tracking-wider"
      >
        <ArrowLeft size={20} />
        <span>Back</span>
      </motion.button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Section */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 sticky top-24">
            <h2 className="text-3xl font-black text-gray-900 mb-8 tracking-tight">Create Deck</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Deck Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Intro to Biology"
                  className="w-full px-5 py-3 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">AI Engine</label>
                <div className="flex p-1.5 bg-gray-50 rounded-2xl border border-gray-100">
                  <button
                    onClick={() => setEngine("gemini")}
                    className={cn(
                      "flex-1 py-2 text-xs font-black rounded-xl transition-all uppercase tracking-widest",
                      engine === "gemini" ? "bg-white text-blue-500 shadow-sm" : "text-gray-400 hover:text-gray-600"
                    )}
                  >
                    Gemini
                  </button>
                  <button
                    onClick={() => setEngine("anthropic")}
                    className={cn(
                      "flex-1 py-2 text-xs font-black rounded-xl transition-all uppercase tracking-widest",
                      engine === "anthropic" ? "bg-white text-blue-500 shadow-sm" : "text-gray-400 hover:text-gray-600"
                    )}
                  >
                    Claude
                  </button>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Study Content</label>
                  <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full", content.length > 10000 ? "bg-red-50 text-red-500" : "bg-gray-100 text-gray-400")}>
                    {content.length.toLocaleString()} / 10,000
                  </span>
                </div>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Paste your study notes here..."
                  className="w-full h-80 px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none resize-none transition-all font-medium leading-relaxed"
                />
              </div>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold leading-relaxed border border-red-100"
                >
                  {error}
                </motion.div>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleGenerate}
                disabled={isGenerating || content.length < 100 || content.length > 10000}
                className="w-full bg-blue-500 text-white font-black py-4 rounded-2xl hover:bg-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-xl shadow-blue-100 uppercase tracking-widest text-sm"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={20} />
                    <span>Generate Cards</span>
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Preview Section */}
        <div className="lg:col-span-7">
          {generatedCards.length > 0 ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-black text-gray-900 tracking-tight">Preview</h3>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSave}
                  className="flex items-center gap-2 bg-emerald-500 text-white px-8 py-3 rounded-2xl hover:bg-emerald-600 transition-all font-black uppercase tracking-widest text-sm shadow-xl shadow-emerald-100"
                >
                  <Save size={20} />
                  <span>Save Deck</span>
                </motion.button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {generatedCards.map((card, index) => (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    key={index} 
                    className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm group relative hover:shadow-lg transition-all"
                  >
                    <div className="flex justify-between items-start gap-6">
                      <div className="flex-1 space-y-6">
                        <div>
                          <label className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">Front</label>
                          {editingIndex === index ? (
                            <textarea
                              value={card.front}
                              onChange={(e) => handleEditCard(index, "front", e.target.value)}
                              className="w-full mt-2 p-3 bg-gray-50 border border-blue-100 rounded-xl outline-none focus:ring-4 focus:ring-blue-50 font-medium"
                            />
                          ) : (
                            <p className="text-xl font-bold text-gray-900 mt-2 leading-tight">{card.front}</p>
                          )}
                        </div>
                        <div>
                          <label className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">Back</label>
                          {editingIndex === index ? (
                            <textarea
                              value={card.back}
                              onChange={(e) => handleEditCard(index, "back", e.target.value)}
                              className="w-full mt-2 p-3 bg-gray-50 border border-blue-100 rounded-xl outline-none focus:ring-4 focus:ring-blue-50 font-medium"
                            />
                          ) : (
                            <p className="text-gray-600 mt-2 leading-relaxed font-medium">{card.back}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                        <button
                          onClick={() => setEditingIndex(editingIndex === index ? null : index)}
                          className="p-3 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-2xl transition-all"
                        >
                          {editingIndex === index ? <Save size={20} /> : <Edit2 size={20} />}
                        </button>
                        <button
                          onClick={() => removeCard(index)}
                          className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                        >
                          <X size={20} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-12 bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
              <div className="p-6 bg-gray-50 rounded-full mb-6">
                <Sparkles className="text-gray-300" size={48} />
              </div>
              <h3 className="text-xl font-bold text-gray-400 mb-2">No Preview Available</h3>
              <p className="text-gray-300 max-w-xs font-medium">
                Enter your study content on the left and click generate to see your flashcards here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
