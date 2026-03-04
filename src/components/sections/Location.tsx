"use client";

import { MapPin, Clock, Phone, Navigation } from "lucide-react";
import { FadeIn } from "@/components/ui/FadeIn";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { cafeInfo } from "@/data/cafe-info";

export function Location() {
  return (
    <section id="location" className="py-24 bg-cream-100">
      <div className="mx-auto max-w-6xl px-6">
        <SectionTitle subtitle="Location" title="오시는 길" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Map */}
          <FadeIn direction="left">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-warm-200 shadow-sm">
              <iframe
                src="https://maps.google.com/maps?q=35.125323,126.931564&z=17&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="카페 쉐어링 위치 지도"
              />
            </div>
          </FadeIn>

          {/* Info */}
          <FadeIn direction="right" delay={0.2}>
            <div className="space-y-8">
              {/* Address */}
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-warm-100 rounded-xl flex items-center justify-center shrink-0">
                  <MapPin className="text-warm-500" size={22} />
                </div>
                <div>
                  <h3 className="font-bold text-warm-800 mb-1">주소</h3>
                  <p className="text-warm-600">{cafeInfo.address}</p>
                  <p className="text-sm text-warm-400 mt-1">
                    {cafeInfo.addressDetail}
                  </p>
                </div>
              </div>

              {/* Directions */}
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-warm-100 rounded-xl flex items-center justify-center shrink-0">
                  <Navigation className="text-warm-500" size={22} />
                </div>
                <div>
                  <h3 className="font-bold text-warm-800 mb-1">찾아오시는 방법</h3>
                  <p className="text-warm-600">
                    {cafeInfo.directions}
                  </p>
                </div>
              </div>

              {/* Business Hours */}
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-warm-100 rounded-xl flex items-center justify-center shrink-0">
                  <Clock className="text-warm-500" size={22} />
                </div>
                <div>
                  <h3 className="font-bold text-warm-800 mb-1">영업시간</h3>
                  <ul className="space-y-1">
                    {cafeInfo.businessHours.map((schedule) => (
                      <li key={schedule.day} className="text-warm-600">
                        {schedule.hours}
                      </li>
                    ))}
                  </ul>
                  <p className="text-sm text-warm-400 mt-2">
                    * {cafeInfo.closedDay}
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-warm-100 rounded-xl flex items-center justify-center shrink-0">
                  <Phone className="text-warm-500" size={22} />
                </div>
                <div>
                  <h3 className="font-bold text-warm-800 mb-1">전화번호</h3>
                  <a
                    href={`tel:${cafeInfo.phone}`}
                    className="text-warm-600 hover:text-warm-800"
                  >
                    {cafeInfo.phone}
                  </a>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
