"use client";

import { motion } from "framer-motion";
import { FadeIn } from "@/components/ui/FadeIn";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { cafeInfo } from "@/data/cafe-info";

const stats = [
  { label: "저당", sub: "설탕 걱정 없이" },
  { label: "저자극", sub: "누구나 안심" },
  { label: "저칼로리", sub: "매일 가볍게" },
];

export function About() {
  return (
    <section id="about" className="py-24 bg-cream-50">
      <div className="mx-auto max-w-6xl px-6">
        <SectionTitle subtitle="About HARUDAM" title="브랜드 소개" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <FadeIn direction="left">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-green-100">
              <div
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1486427944544-d2c246c4df14?w=800&h=600&fit=crop')" }}
              />
            </div>
          </FadeIn>

          {/* Text */}
          <FadeIn direction="right" delay={0.2}>
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-green-800">
                하루(日)를 담다, 온기를 잇다
              </h3>
              <p className="text-warm-600 leading-relaxed">
                {cafeInfo.story}
              </p>
              <div className="grid grid-cols-3 gap-6 pt-4">
                {stats.map((stat) => (
                  <motion.div
                    key={stat.label}
                    whileInView={{ scale: [0.8, 1] }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    viewport={{ once: true }}
                    className="text-center"
                  >
                    <p className="text-3xl font-bold text-green-600">{stat.label}</p>
                    <p className="text-sm text-warm-400 mt-1">{stat.sub}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
