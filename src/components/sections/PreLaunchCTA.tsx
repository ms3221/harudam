"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, ShieldCheck, Truck, Leaf } from "lucide-react";
import { FadeIn } from "@/components/ui/FadeIn";

const trustBadges = [
  { icon: ShieldCheck, label: "안심 원재료" },
  { icon: Truck, label: "전국 배송" },
  { icon: Leaf, label: "올가닉 인증" },
];

export function PreLaunchCTA() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubmitted(true);
      setEmail("");
    }
  };

  return (
    <section
      id="signup"
      className="py-24 relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #14532d 0%, #166534 40%, #15803d 100%)",
      }}
    >
      <div className="mx-auto max-w-3xl px-6 text-center relative z-10">
        <FadeIn>
          <div className="inline-flex items-center gap-2 bg-white/10 text-green-200 text-sm font-medium px-4 py-2 rounded-full mb-6">
            <Bell size={16} />
            <span>오픈 알림 신청</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            가족의 하루를 담을 준비,
            <br />
            거의 다 되었어요
          </h2>
          <p className="text-green-200 text-lg mb-10 leading-relaxed">
            오픈 소식을 가장 먼저 받아보세요.
            <br className="hidden sm:block" />
            첫 주문 특별 할인 혜택도 함께 드립니다.
          </p>
        </FadeIn>

        <FadeIn delay={0.2}>
          {isSubmitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-10"
            >
              <p className="text-white text-lg font-bold mb-2">
                신청이 완료되었습니다!
              </p>
              <p className="text-green-200 text-sm">
                오픈 소식을 가장 먼저 알려드릴게요.
              </p>
            </motion.div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-10"
            >
              <input
                type="email"
                placeholder="이메일을 입력해 주세요"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 px-5 py-3.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-green-300/60 focus:outline-none focus:border-white/50 transition-colors text-sm"
              />
              <button
                type="submit"
                className="px-8 py-3.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-full transition-colors whitespace-nowrap text-sm"
              >
                알림 신청
              </button>
            </form>
          )}
        </FadeIn>

        <FadeIn delay={0.3}>
          <div className="flex justify-center gap-8">
            {trustBadges.map((badge) => (
              <div key={badge.label} className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                  <badge.icon size={18} className="text-green-300" />
                </div>
                <span className="text-green-300 text-xs font-medium">
                  {badge.label}
                </span>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
