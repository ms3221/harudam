"use client";

import { Heart } from "lucide-react";
import { FadeIn } from "@/components/ui/FadeIn";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { instagramPosts } from "@/data/gallery";
import { cafeInfo } from "@/data/cafe-info";

export function Instagram() {
  return (
    <section className="py-24 bg-cream-100">
      <div className="mx-auto max-w-6xl px-6">
        <SectionTitle subtitle="SNS" title="하루담 소식" />

        <FadeIn>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {instagramPosts.map((post) => (
              <div
                key={post.id}
                className="group relative aspect-square rounded-xl overflow-hidden bg-green-100"
              >
                <div
                  className="w-full h-full bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
                  style={{ backgroundImage: `url('${post.thumbnail}')` }}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity text-center text-white p-4">
                    <Heart size={28} className="mx-auto mb-2" />
                    {post.caption && (
                      <p className="text-xs leading-relaxed">{post.caption}</p>
                    )}
                    <p className="text-xs mt-1 text-white/70">준비중</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div className="text-center mt-8">
            <p className="text-warm-400 text-sm">
              SNS 채널 준비중입니다. 곧 만나보세요!
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
