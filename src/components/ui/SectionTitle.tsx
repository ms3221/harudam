"use client";

import { motion } from "framer-motion";
import { FadeIn } from "./FadeIn";

interface SectionTitleProps {
  subtitle: string;
  title: string;
}

export function SectionTitle({ subtitle, title }: SectionTitleProps) {
  return (
    <FadeIn className="text-center mb-12">
      <p className="text-green-600 text-sm font-medium tracking-widest uppercase mb-2">
        {subtitle}
      </p>
      <h2 className="text-3xl md:text-4xl font-bold text-green-900">
        {title}
      </h2>
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: 64 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true }}
        className="mt-4 mx-auto h-0.5 bg-green-300"
      />
    </FadeIn>
  );
}
