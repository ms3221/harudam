"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { galleryImages } from "@/data/gallery";

export function Gallery() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 4000, stopOnInteraction: false }),
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  return (
    <section id="gallery" className="py-24 bg-cream-50">
      <div className="mx-auto max-w-6xl px-6">
        <SectionTitle subtitle="Gallery" title="하루담의 이야기" />

        <div className="relative">
          {/* Carousel */}
          <div className="embla rounded-2xl overflow-hidden" ref={emblaRef}>
            <div className="embla__container">
              {galleryImages.map((image) => (
                <div key={image.id} className="embla__slide">
                  <div className="aspect-[16/9] bg-green-100 relative">
                    <div
                      className="w-full h-full bg-cover bg-center"
                      style={{ backgroundImage: `url('${image.src}')` }}
                    />
                    {image.caption && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                        <p className="text-white text-sm">{image.caption}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={scrollPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors"
            aria-label="이전 사진"
          >
            <ChevronLeft size={20} className="text-green-700" />
          </button>
          <button
            onClick={scrollNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors"
            aria-label="다음 사진"
          >
            <ChevronRight size={20} className="text-green-700" />
          </button>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {galleryImages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => emblaApi?.scrollTo(idx)}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === selectedIndex
                    ? "bg-green-600 w-6"
                    : "bg-green-200"
                }`}
                aria-label={`슬라이드 ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
