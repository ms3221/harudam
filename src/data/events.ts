export interface EventItem {
  id: string;
  title: string;
  description: string;
  date: string;
  badge?: string;
  isActive: boolean;
}

export const events: EventItem[] = [
  {
    id: "1",
    title: "하루담 온라인 스토어 오픈 준비중",
    description:
      "저당·저자극·저칼로리 웰니스 디저트를 만나볼 수 있는 온라인 스토어를 준비하고 있습니다. 곧 만나보실 수 있어요!",
    date: "Coming Soon",
    badge: "준비중",
    isActive: true,
  },
  {
    id: "2",
    title: "오픈 기념 첫 주문 할인 이벤트",
    description:
      "하루담 오픈을 기념하여 첫 주문 고객님께 특별 할인 혜택을 드릴 예정입니다. 오픈 알림을 신청해 주세요!",
    date: "오픈 후 진행",
    badge: "예정",
    isActive: true,
  },
  {
    id: "3",
    title: "정기 구독 서비스 준비중",
    description:
      "매주 새로운 저당 디저트를 정기적으로 받아보실 수 있는 구독 서비스를 기획하고 있습니다.",
    date: "Coming Soon",
    badge: "준비중",
    isActive: true,
  },
  {
    id: "4",
    title: "밀키트·건강식품 카테고리 확장 예정",
    description:
      "디저트를 시작으로 밀키트, 과일, 채소·육류, 건강기능식품까지 가족의 건강한 식탁을 완성해 나갑니다.",
    date: "기획중",
    badge: "예정",
    isActive: true,
  },
];
