import React, { useState } from "react";
import { ArrowLeft, Save, Key, ShieldCheck, ExternalLink, CheckCircle2 } from "lucide-react";
import { View } from "../types";
import { motion } from "motion/react";
import { cn } from "../lib/utils";

interface SettingsProps {
  onViewChange: (view: View) => void;
  apiKey: string | null;
  onSaveApiKey: (key: string) => void;
}

export default function Settings({ onViewChange, apiKey, onSaveApiKey }: SettingsProps) {
  const [tempKey, setTempKey] = useState(apiKey || "");
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    onSaveApiKey(tempKey);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-8">
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => onViewChange("dashboard")}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-8 transition-colors font-bold text-sm uppercase tracking-wider"
      >
        <ArrowLeft size={20} />
        <span>Back</span>
      </motion.button>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-gray-100 overflow-hidden relative"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-blue-500 opacity-10" />
        
        <div className="flex items-center gap-4 mb-12">
          <div className="p-4 bg-blue-50 text-blue-500 rounded-2xl">
            <Key size={32} strokeWidth={2.5} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Settings</h2>
            <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-1">Configure your AI engines</p>
          </div>
        </div>

        <div className="space-y-10">
          <div className="p-6 bg-blue-50/50 border border-blue-100 rounded-[2rem] relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 text-blue-100 group-hover:text-blue-200 transition-colors">
              <ShieldCheck size={120} strokeWidth={1} />
            </div>
            <div className="relative">
              <h3 className="font-black text-blue-900 mb-2 uppercase tracking-wider text-sm">Default Engine: Gemini</h3>
              <p className="text-sm text-blue-700/80 leading-relaxed font-medium">
                The app uses Gemini for free, automatic flashcard generation. No setup required.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Optional: Anthropic API Key</label>
                <p className="text-xs text-gray-400 font-medium max-w-xs">Use Claude 3.5 Sonnet for high-quality card generation.</p>
              </div>
              <a 
                href="https://console.anthropic.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-[10px] font-black text-blue-500 hover:text-blue-600 uppercase tracking-widest transition-colors"
              >
                <span>Get Key</span>
                <ExternalLink size={12} />
              </a>
            </div>
            
            <div className="relative">
              <input
                type="password"
                value={tempKey}
                onChange={(e) => setTempKey(e.target.value)}
                placeholder="sk-ant-..."
                className="w-full px-6 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none font-mono transition-all"
              />
            </div>
          </div>

          <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-[2rem] border border-gray-100">
            <div className="p-2 bg-white rounded-xl shadow-sm">
              <ShieldCheck className="text-emerald-500" size={20} />
            </div>
            <div className="text-xs text-gray-500 leading-relaxed">
              <p className="font-black text-gray-900 uppercase tracking-wider mb-1">Privacy & Security</p>
              <p className="font-medium">Your API key is stored locally in your browser's encrypted storage. We never see or store your keys on our servers.</p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            className={cn(
              "w-full font-black py-5 rounded-2xl transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-sm shadow-xl shadow-blue-100",
              isSaved ? "bg-emerald-500 text-white shadow-emerald-100" : "bg-blue-500 text-white hover:bg-blue-600"
            )}
          >
            {isSaved ? (
              <>
                <CheckCircle2 size={20} />
                <span>Saved Successfully</span>
              </>
            ) : (
              <>
                <Save size={20} />
                <span>Save Changes</span>
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
