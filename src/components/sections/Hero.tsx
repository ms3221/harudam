"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cafeInfo } from "@/data/cafe-info";

const slogans = [
  "하루를 가볍게, 마음을 든든하게",
  "마음까지 편해지는 맛",
  "우리 집 식탁에 온기 한 스푼",
  "우리 집 루틴, 하루담",
];

export function Hero() {
  const [currentSlogan, setCurrentSlogan] = useState(0);
  const { scrollY } = useScroll();
  const backgroundY = useTransform(scrollY, [0, 800], [0, 200]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlogan((prev) => (prev + 1) % slogans.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden grain-overlay">
      {/* Background image with parallax */}
      <div className="absolute inset-0 bg-gradient-to-b from-green-900 via-green-800 to-green-900">
        <motion.div
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1486427944544-d2c246c4df14?w=1920&h=1080&fit=crop')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            y: backgroundY,
          }}
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-3xl">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-green-200 text-sm tracking-[0.3em] uppercase mb-4"
        >
          {cafeInfo.nameEn}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
        >
          {cafeInfo.catchphrase}
        </motion.h1>

        {/* Slogan Rotation */}
        <div className="h-10 md:h-12 mb-10 flex items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.p
              key={currentSlogan}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-green-100 text-lg md:text-xl"
            >
              {slogans[currentSlogan]}
            </motion.p>
          </AnimatePresence>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <a
            href="#products"
            className="inline-block px-8 py-3 bg-amber-500 text-white font-medium rounded-full hover:bg-amber-600 transition-colors"
          >
            상품 보기
          </a>
          <a
            href="#about"
            className="inline-block px-8 py-3 border border-white/40 text-white font-medium rounded-full hover:bg-white/10 transition-colors"
          >
            브랜드 소개
          </a>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <ChevronDown className="text-white/60" size={28} />
        </motion.div>
      </motion.div>
    </section>
  );
}
