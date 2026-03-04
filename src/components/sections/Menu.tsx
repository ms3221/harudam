"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Sparkles, ThumbsUp, ShoppingCart } from "lucide-react";
import { FadeIn } from "@/components/ui/FadeIn";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { menuItems, menuCategories, formatPrice } from "@/data/menu";
import { cafeInfo } from "@/data/cafe-info";
import type { MenuItem } from "@/data/menu";

function MenuCard({ item, index }: { item: MenuItem; index: number }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative"
    >
      {/* Image */}
      <div className="aspect-[4/3] bg-green-50 relative overflow-hidden">
        <div
          className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
          style={{ backgroundImage: `url('${item.image}')` }}
        />
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {item.isSignature && (
            <span className="flex items-center gap-1 bg-green-600 text-white text-xs font-medium px-2.5 py-1 rounded-full">
              <Star size={12} /> 대표
            </span>
          )}
          {item.isNew && (
            <span className="flex items-center gap-1 bg-rose-500 text-white text-xs font-medium px-2.5 py-1 rounded-full">
              <Sparkles size={12} /> NEW
            </span>
          )}
          {item.isRecommended && (
            <span className="flex items-center gap-1 bg-blue-500 text-white text-xs font-medium px-2.5 py-1 rounded-full">
              <ThumbsUp size={12} /> 추천
            </span>
          )}
        </div>

        {/* 준비중 오버레이 */}
        {item.isSoldOut && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white/90 text-warm-700 font-bold text-sm px-4 py-2 rounded-full">
              준비중
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-bold text-warm-800 text-sm leading-snug flex-1 mr-2">
            {item.name}
          </h3>
          <span className="text-green-700 font-bold text-base whitespace-nowrap">
            {formatPrice(item.price)}
          </span>
        </div>
        <p className="text-xs text-warm-500 leading-relaxed mb-3">
          {item.description}
        </p>
        <button
          disabled
          className="w-full flex items-center justify-center gap-2 py-2 bg-gray-100 text-gray-400 text-sm font-medium rounded-lg cursor-not-allowed"
        >
          <ShoppingCart size={14} />
          구매 준비중
        </button>
      </div>
    </motion.div>
  );
}

export function Menu() {
  const [activeCategory, setActiveCategory] = useState<string>("dessert");

  const filteredItems = menuItems.filter(
    (item) => item.category === activeCategory
  );

  return (
    <section id="products" className="py-24 bg-cream-100">
      <div className="mx-auto max-w-6xl px-6">
        <SectionTitle subtitle="Products" title="정성을 담은 상품" />

        {/* Category Tabs */}
        <FadeIn>
          <div className="flex justify-start md:justify-center gap-2 mb-12 overflow-x-auto pb-2 -mx-6 px-6 scrollbar-hide">
            {menuCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap shrink-0 ${
                  activeCategory === cat.id
                    ? "bg-green-600 text-white shadow-md"
                    : "bg-white text-warm-600 hover:bg-green-50"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </FadeIn>

        {/* Product Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredItems.map((item, idx) => (
              <MenuCard key={item.id} item={item} index={idx} />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* 안내 문구 */}
        <FadeIn delay={0.2}>
          <div className="mt-12 text-center">
            <p className="text-sm text-warm-400">
              산지: {cafeInfo.origin}
            </p>
            <p className="text-xs text-warm-300 mt-2">
              * 모든 상품은 현재 준비중이며, 오픈 시 구매하실 수 있습니다.
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
