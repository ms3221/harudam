"use client";

import { Calendar } from "lucide-react";
import { FadeIn } from "@/components/ui/FadeIn";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { events } from "@/data/events";

const badgeColors: Record<string, string> = {
  준비중: "bg-green-100 text-green-700",
  예정: "bg-amber-100 text-amber-700",
  진행중: "bg-blue-100 text-blue-700",
  NEW: "bg-rose-100 text-rose-700",
};

export function Events() {
  const activeEvents = events.filter((e) => e.isActive);

  return (
    <section id="events" className="py-24 bg-cream-50">
      <div className="mx-auto max-w-6xl px-6">
        <SectionTitle subtitle="Notice" title="공지사항" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activeEvents.map((event, idx) => (
            <FadeIn key={event.id} delay={idx * 0.1}>
              <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow h-full">
                <div className="flex items-start justify-between mb-3">
                  {event.badge && (
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full ${
                        badgeColors[event.badge] || "bg-warm-100 text-warm-700"
                      }`}
                    >
                      {event.badge}
                    </span>
                  )}
                  <div className="flex items-center gap-1 text-warm-400 text-xs">
                    <Calendar size={12} />
                    <span>{event.date}</span>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-warm-800 mb-2">
                  {event.title}
                </h3>
                <p className="text-sm text-warm-500 leading-relaxed">
                  {event.description}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
