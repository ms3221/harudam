"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle } from "lucide-react";

export function FloatingContact() {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleClick = () => {
    setShowTooltip(true);
    setTimeout(() => setShowTooltip(false), 2500);
  };

  return (
    <div className="fixed bottom-24 right-6 z-40">
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.9 }}
            className="absolute bottom-full right-0 mb-3 bg-warm-800 text-white text-xs font-medium px-4 py-2 rounded-lg whitespace-nowrap shadow-lg"
          >
            카카오톡 상담은 준비중입니다
            <div className="absolute -bottom-1 right-5 w-2 h-2 bg-warm-800 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={handleClick}
        className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-105"
        style={{ backgroundColor: "#FEE500" }}
        aria-label="카카오톡 문의"
      >
        <MessageCircle size={24} className="text-warm-900" />
      </button>
    </div>
  );
}
