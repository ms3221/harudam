export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  isSignature?: boolean;
  isNew?: boolean;
  isRecommended?: boolean;
  image: string;
  isSoldOut?: boolean;
}

export const menuCategories = [
  { id: "dessert", label: "디저트" },
  { id: "mealkit", label: "밀키트" },
  { id: "fruit", label: "과일" },
  { id: "fresh", label: "채소·육류" },
  { id: "supplement", label: "건강기능식품" },
] as const;

const img = {
  tiramisu: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&h=450&fit=crop",
  cookie: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&h=450&fit=crop",
  brownie: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&h=450&fit=crop",
  tart: "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=600&h=450&fit=crop",
  pudding: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&h=450&fit=crop",
  macaron: "https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=600&h=450&fit=crop",
  rollcake: "https://images.unsplash.com/photo-1602351447937-745cb720612f?w=600&h=450&fit=crop",
  financier: "https://images.unsplash.com/photo-1509365465985-25d11c17e812?w=600&h=450&fit=crop",
  mealkit1: "https://images.unsplash.com/photo-1536304929831-ee1ca9d44726?w=600&h=450&fit=crop",
  mealkit2: "https://images.unsplash.com/photo-1547592180-85f173990554?w=600&h=450&fit=crop",
  mealkit3: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=450&fit=crop",
  strawberry: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=600&h=450&fit=crop",
  blueberry: "https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=600&h=450&fit=crop",
  apple: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&h=450&fit=crop",
  vegebox: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&h=450&fit=crop",
  chicken: "https://images.unsplash.com/photo-1604503468506-a8da13d82571?w=600&h=450&fit=crop",
  salad: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=450&fit=crop",
  vitamin: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&h=450&fit=crop",
  probiotics: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&h=450&fit=crop",
  collagen: "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=600&h=450&fit=crop",
};

export const menuItems: MenuItem[] = [
  // ── 디저트 (메인 카테고리) ──
  {
    id: "low-sugar-tiramisu",
    name: "저당 티라미수",
    description: "설탕 60% 감량, 마스카포네 풍미 그대로",
    price: 6800,
    category: "dessert",
    isSignature: true,
    image: img.tiramisu,
    isSoldOut: true,
  },
  {
    id: "glutenfree-cookie",
    name: "글루텐프리 쿠키 세트",
    description: "쌀가루·아몬드가루 베이스, 바삭한 식감",
    price: 4500,
    category: "dessert",
    isNew: true,
    image: img.cookie,
    isSoldOut: true,
  },
  {
    id: "vegan-brownie",
    name: "비건 브라우니",
    description: "두부·코코넛오일 활용, 촉촉한 식감",
    price: 5200,
    category: "dessert",
    isRecommended: true,
    image: img.brownie,
    isSoldOut: true,
  },
  {
    id: "fruit-tart",
    name: "계절 과일 타르트",
    description: "저당 커스터드 + 제철 유기농 과일",
    price: 7500,
    category: "dessert",
    isNew: true,
    image: img.tart,
    isSoldOut: true,
  },
  {
    id: "oat-pudding",
    name: "오트밀 푸딩",
    description: "귀리·우유·치아시드, 칼로리 걱정 없는 간식",
    price: 3800,
    category: "dessert",
    image: img.pudding,
    isSoldOut: true,
  },
  {
    id: "low-sugar-macaron",
    name: "저당 마카롱 6종 세트",
    description: "천연 색소, 알룰로스 사용",
    price: 12000,
    category: "dessert",
    isSignature: true,
    image: img.macaron,
    isSoldOut: true,
  },
  {
    id: "rice-rollcake",
    name: "쌀 롤케이크",
    description: "국산 쌀가루, 가벼운 크림",
    price: 8900,
    category: "dessert",
    isRecommended: true,
    image: img.rollcake,
    isSoldOut: true,
  },
  {
    id: "organic-financier",
    name: "유기농 휘낭시에",
    description: "유기농 버터·아몬드, 담백한 풍미",
    price: 3200,
    category: "dessert",
    image: img.financier,
    isSoldOut: true,
  },

  // ── 밀키트 (확장 예정) ──
  {
    id: "healthy-salad-kit",
    name: "건강 샐러드 밀키트",
    description: "유기농 채소 + 저칼로리 드레싱",
    price: 9900,
    category: "mealkit",
    isNew: true,
    image: img.mealkit1,
    isSoldOut: true,
  },
  {
    id: "chicken-steak-kit",
    name: "닭가슴살 스테이크 밀키트",
    description: "고단백 저지방, 간편 조리",
    price: 11900,
    category: "mealkit",
    image: img.mealkit2,
    isSoldOut: true,
  },
  {
    id: "veggie-bowl-kit",
    name: "채소 듬뿍 비빔밥 밀키트",
    description: "5가지 나물 + 현미밥 구성",
    price: 8500,
    category: "mealkit",
    image: img.mealkit3,
    isSoldOut: true,
  },

  // ── 과일 (확장 예정) ──
  {
    id: "organic-strawberry",
    name: "유기농 딸기 500g",
    description: "논산 농가 직송, 완숙 수확",
    price: 12900,
    category: "fruit",
    isRecommended: true,
    image: img.strawberry,
    isSoldOut: true,
  },
  {
    id: "blueberry-pack",
    name: "국산 블루베리 300g",
    description: "항산화 성분 풍부, 무농약 재배",
    price: 9800,
    category: "fruit",
    image: img.blueberry,
    isSoldOut: true,
  },
  {
    id: "organic-apple",
    name: "친환경 사과 3kg",
    description: "저농약 재배, 아삭하고 달콤한",
    price: 18900,
    category: "fruit",
    image: img.apple,
    isSoldOut: true,
  },

  // ── 채소·육류 (확장 예정) ──
  {
    id: "veggie-box",
    name: "제철 채소 꾸러미",
    description: "주간 신선 채소 7종 구성",
    price: 15900,
    category: "fresh",
    image: img.vegebox,
    isSoldOut: true,
  },
  {
    id: "organic-chicken",
    name: "무항생제 닭가슴살 1kg",
    description: "HACCP 인증, 개별 포장",
    price: 12900,
    category: "fresh",
    image: img.chicken,
    isSoldOut: true,
  },

  // ── 건강기능식품 (확장 예정) ──
  {
    id: "multivitamin",
    name: "데일리 멀티비타민",
    description: "하루 한 알, 13종 비타민·미네랄",
    price: 25000,
    category: "supplement",
    image: img.vitamin,
    isSoldOut: true,
  },
  {
    id: "probiotics",
    name: "유산균 30포",
    description: "100억 보장균수, 장 건강",
    price: 19900,
    category: "supplement",
    image: img.probiotics,
    isSoldOut: true,
  },
  {
    id: "collagen-jelly",
    name: "저분자 콜라겐 젤리",
    description: "맛있게 챙기는 피부 건강",
    price: 22000,
    category: "supplement",
    image: img.collagen,
    isSoldOut: true,
  },
];

export function formatPrice(price: number): string {
  return price.toLocaleString("ko-KR") + "원";
}
