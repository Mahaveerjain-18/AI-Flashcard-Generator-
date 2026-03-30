import React from "react";
import { Plus, Trash2, BookOpen, Clock, AlertCircle, TrendingUp, CheckCircle } from "lucide-react";
import { Deck, View } from "../types";
import { cn, formatDate } from "../lib/utils";
import { motion, AnimatePresence } from "motion/react";

interface DashboardProps {
  decks: Deck[];
  onViewChange: (view: View) => void;
  onDeckSelect: (deck: Deck) => void;
  onDeleteDeck: (id: string) => void;
  apiKey: string | null;
}

export default function Dashboard({ decks, onViewChange, onDeckSelect, onDeleteDeck, apiKey }: DashboardProps) {
  const getDueCount = (deck: Deck) => {
    const now = new Date();
    return deck.cards.filter((card) => new Date(card.nextReview) <= now).length;
  };

  const totalCards = decks.reduce((acc, deck) => acc + deck.cards.length, 0);
  const totalDue = decks.reduce((acc, deck) => acc + getDueCount(deck), 0);
  const masteredCards = decks.reduce((acc, deck) => 
    acc + deck.cards.filter(c => c.easeFactor > 3).length, 0
  );

  const [deleteConfirmId, setDeleteConfirmId] = React.useState<string | null>(null);

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-8">
      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirmId && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteConfirmId(null)}
              className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl border border-gray-100 text-center"
            >
              <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Trash2 size={40} strokeWidth={2.5} />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">Delete Deck?</h3>
              <p className="text-gray-500 font-medium mb-8 leading-relaxed">
                This will permanently remove the deck and all its study progress. This action cannot be undone.
              </p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => {
                    onDeleteDeck(deleteConfirmId);
                    setDeleteConfirmId(null);
                  }}
                  className="w-full bg-red-500 text-white font-black py-4 rounded-2xl hover:bg-red-600 transition-all uppercase tracking-widest text-sm shadow-xl shadow-red-100"
                >
                  Delete Permanently
                </button>
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="w-full bg-gray-50 text-gray-500 font-black py-4 rounded-2xl hover:bg-gray-100 transition-all uppercase tracking-widest text-sm"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Hero Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">Welcome Back</h1>
          <p className="text-gray-500 font-medium">Ready to master your knowledge today?</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onViewChange("generate")}
          className="flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-600 transition-all"
        >
          <Plus size={20} />
          <span>Create New Deck</span>
        </motion.button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Cards", value: totalCards, icon: BookOpen, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Due Today", value: totalDue, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Mastered", value: masteredCards, icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className={cn("p-3 rounded-2xl", stat.bg, stat.color)}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">{stat.label}</p>
              <p className="text-2xl font-black text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {decks.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
          <BookOpen className="mx-auto mb-4 text-gray-400" size={48} />
          <p className="text-gray-500 text-lg">Create your first deck to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {decks.map((deck, idx) => {
            const dueCount = getDueCount(deck);
            return (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                key={deck.id}
                className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-blue-100 transition-all group relative flex flex-col"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-gray-50 rounded-2xl group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                    <BookOpen size={24} />
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteConfirmId(deck.id);
                    }}
                    className="text-gray-300 hover:text-red-500 p-2 rounded-xl hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="flex-1 mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                    {deck.title}
                  </h3>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    {deck.cards.length} Cards • {formatDate(deck.created)}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-auto">
                  {dueCount > 0 ? (
                    <div className="flex items-center gap-1.5 text-amber-600 bg-amber-50 px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider">
                      <Clock size={14} />
                      <span>{dueCount} Due</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider">
                      <CheckCircle size={14} />
                      <span>Completed</span>
                    </div>
                  )}
                  
                  <button
                    onClick={() => onDeckSelect(deck)}
                    className="p-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all shadow-lg shadow-blue-100"
                  >
                    <TrendingUp size={20} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
