import { Heart, Phone, MapPin, Clock, Instagram } from "lucide-react";
import { cafeInfo } from "@/data/cafe-info";

export function Footer() {
  return (
    <footer className="bg-green-900 text-green-200 py-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* 브랜드 정보 */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">
              {cafeInfo.name}
            </h3>
            <p className="text-green-300 text-sm leading-relaxed mb-4">
              {cafeInfo.catchphrase}
            </p>
            <div className="inline-flex items-center gap-2 text-green-400 mb-4">
              <Heart size={16} />
              <span className="text-sm">하루의 온기를 담아</span>
            </div>
            <div className="flex items-center gap-3 mt-2">
              <a
                href={cafeInfo.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-green-300 hover:text-white transition-colors text-sm"
              >
                <Instagram size={18} />
                <span>{cafeInfo.instagramId}</span>
              </a>
            </div>
          </div>

          {/* 연락처 */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">연락처</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin size={16} className="mt-0.5 shrink-0" />
                <div>
                  <span>{cafeInfo.address}</span>
                  <br />
                  <span className="text-green-400 text-xs">
                    {cafeInfo.addressDetail}
                  </span>
                </div>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="shrink-0" />
                <span>{cafeInfo.phone}</span>
              </li>
            </ul>
          </div>

          {/* 운영 안내 */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">운영 안내</h3>
            <ul className="space-y-2 text-sm">
              {cafeInfo.businessHours.map((schedule) => (
                <li key={schedule.day} className="flex items-center gap-2">
                  <Clock size={16} className="shrink-0" />
                  <span>
                    {schedule.day}: {schedule.hours}
                  </span>
                </li>
              ))}
              <li className="text-green-400 text-xs mt-2">
                * {cafeInfo.closedDay}
              </li>
            </ul>
            <p className="text-green-400 text-xs mt-4">
              {cafeInfo.directions}
            </p>
          </div>
        </div>

        <div className="border-t border-green-800 mt-12 pt-8 text-center text-sm text-green-500">
          <p>&copy; 2026 {cafeInfo.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
