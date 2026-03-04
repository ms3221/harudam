"use client";

import { Sunrise, Package, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { FadeIn } from "@/components/ui/FadeIn";
import { SectionTitle } from "@/components/ui/SectionTitle";

const values = [
  {
    icon: Sunrise,
    title: "매일의 건강함",
    description:
      "저당·저자극·저칼로리. 매일 먹어도 부담 없는 웰니스 디저트로 가족의 하루를 가볍게 시작합니다.",
    color: "bg-amber-50",
    iconColor: "text-amber-600",
  },
  {
    icon: Package,
    title: "정성껏 담은 한 박스",
    description:
      "올가닉 원재료를 엄선하고, 한 박스 한 박스에 정성을 담습니다. 안심하고 드실 수 있도록.",
    color: "bg-green-50",
    iconColor: "text-green-600",
  },
  {
    icon: Heart,
    title: "가족의 식탁을 위해",
    description:
      "아이부터 어르신까지, 온 가족이 안심하고 즐길 수 있는 건강한 먹거리를 만들어 갑니다.",
    color: "bg-clay-50",
    iconColor: "text-clay-600",
  },
];

export function Values() {
  return (
    <section className="py-24 bg-cream-100">
      <div className="mx-auto max-w-6xl px-6">
        <SectionTitle subtitle="Our Promise" title="하루담의 약속" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((value, idx) => (
            <FadeIn key={value.title} delay={idx * 0.15}>
              <motion.div
                whileInView={{ scale: [0.95, 1] }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 text-center shadow-sm hover:shadow-md transition-shadow h-full"
              >
                <div
                  className={`w-16 h-16 ${value.color} rounded-2xl flex items-center justify-center mx-auto mb-6`}
                >
                  <value.icon className={value.iconColor} size={28} />
                </div>
                <h3 className="text-xl font-bold text-warm-800 mb-3">
                  {value.title}
                </h3>
                <p className="text-sm text-warm-500 leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
