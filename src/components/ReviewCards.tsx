import React, { useState, useEffect, useCallback } from "react";
import { ArrowLeft, CheckCircle2, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Deck, Card, View } from "../types";
import { calculateNextReview } from "../lib/sm2";
import { cn } from "../lib/utils";

interface ReviewCardsProps {
  deck: Deck;
  onViewChange: (view: View) => void;
  onUpdateCard: (deckId: string, card: Card) => void;
}

export default function ReviewCards({ deck, onViewChange, onUpdateCard }: ReviewCardsProps) {
  const [dueCards, setDueCards] = useState<Card[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const now = new Date();
    const filtered = deck.cards.filter((card) => new Date(card.nextReview) <= now);
    setDueCards(filtered);
  }, [deck]);

  const handleRate = useCallback(
    (rating: number) => {
      if (!isFlipped) return;

      const currentCard = dueCards[currentIndex];
      const updatedCard = calculateNextReview(currentCard, rating);
      onUpdateCard(deck.id, updatedCard);

      if (currentIndex < dueCards.length - 1) {
        setIsFlipped(false);
        setCurrentIndex((prev) => prev + 1);
      } else {
        setIsComplete(true);
      }
    },
    [currentIndex, dueCards, isFlipped, deck.id, onUpdateCard]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isComplete) return;

      if (e.code === "Space") {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      } else if (["Digit1", "Digit2", "Digit3", "Digit4"].includes(e.code)) {
        const rating = parseInt(e.code.replace("Digit", "")) - 1;
        handleRate(rating);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFlipped, isComplete, handleRate]);

  if (dueCards.length === 0 && !isComplete) {
    return (
      <div className="max-w-2xl mx-auto p-4 md:p-8 text-center">
        <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100">
          <CheckCircle2 className="mx-auto mb-4 text-green-500" size={64} />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">All caught up! 🎉</h2>
          <p className="text-gray-500 mb-8">You've reviewed all cards in this deck for today.</p>
          <button
            onClick={() => onViewChange("dashboard")}
            className="bg-blue-500 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-600 transition-all"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (isComplete) {
    return (
      <div className="max-w-2xl mx-auto p-4 md:p-8 text-center">
        <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100">
          <CheckCircle2 className="mx-auto mb-4 text-green-500" size={64} />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Review Complete!</h2>
          <p className="text-gray-500 mb-8">Great job! You've finished your study session for this deck.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => onViewChange("dashboard")}
              className="bg-blue-500 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-600 transition-all"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentCard = dueCards[currentIndex];

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 min-h-[80vh] flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={() => onViewChange("dashboard")}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors font-bold text-sm uppercase tracking-wider"
        >
          <ArrowLeft size={20} />
          <span>Exit</span>
        </button>
        <div className="flex-1 max-w-xs mx-8">
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-blue-500"
              initial={{ width: 0 }}
              animate={{ width: `${((currentIndex + 1) / dueCards.length) * 100}%` }}
            />
          </div>
        </div>
        <div className="text-xs font-black text-blue-500 bg-blue-50 px-4 py-1.5 rounded-full uppercase tracking-widest">
          {currentIndex + 1} / {dueCards.length}
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-12">
        {/* Flashcard */}
        <div
          className="relative w-full max-w-[650px] h-[450px] cursor-pointer perspective-1000 group"
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <motion.div
            className="w-full h-full relative transition-all duration-500 preserve-3d"
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
          >
            {/* Front */}
            <div className="absolute inset-0 w-full h-full backface-hidden bg-white rounded-[3rem] shadow-2xl shadow-blue-100 border border-gray-100 flex items-center justify-center p-12 text-center overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-blue-500 opacity-20" />
              <p className="text-3xl md:text-4xl font-black text-gray-900 leading-tight tracking-tight">{currentCard.front}</p>
              <div className="absolute bottom-10 flex items-center gap-2 text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] opacity-0 group-hover:opacity-100 transition-opacity">
                <RotateCcw size={12} />
                <span>Tap to reveal</span>
              </div>
            </div>

            {/* Back */}
            <div
              className="absolute inset-0 w-full h-full backface-hidden bg-blue-600 rounded-[3rem] shadow-2xl border border-blue-500 flex items-center justify-center p-12 text-center overflow-hidden"
              style={{ transform: "rotateY(180deg)" }}
            >
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500 to-blue-700 opacity-50" />
              <p className="relative text-2xl md:text-3xl font-bold text-white leading-relaxed tracking-tight">{currentCard.back}</p>
            </div>
          </motion.div>
        </div>

        {/* Rating Buttons */}
        <div className="w-full max-w-[600px]">
          <AnimatePresence mode="wait">
            {isFlipped ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-2 sm:grid-cols-4 gap-3"
              >
                {[
                  { label: "Again", rating: 0, color: "bg-red-500 hover:bg-red-600", sub: "1 day" },
                  { label: "Hard", rating: 1, color: "bg-amber-500 hover:bg-amber-600", sub: "1.2x" },
                  { label: "Good", rating: 2, color: "bg-emerald-500 hover:bg-emerald-600", sub: "Ease" },
                  { label: "Easy", rating: 3, color: "bg-blue-500 hover:bg-blue-600", sub: "Ease+" },
                ].map((btn) => (
                  <button
                    key={btn.label}
                    onClick={() => handleRate(btn.rating)}
                    className={cn(
                      "flex flex-col items-center justify-center py-4 rounded-2xl text-white transition-all hover:scale-105 active:scale-95",
                      btn.color
                    )}
                  >
                    <span className="font-bold text-lg">{btn.label}</span>
                    <span className="text-[10px] opacity-80 uppercase tracking-wider font-medium">{btn.sub}</span>
                  </button>
                ))}
              </motion.div>
            ) : (
              <div className="text-center text-gray-400 font-medium animate-pulse">
                Press Space or Click to reveal answer
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
