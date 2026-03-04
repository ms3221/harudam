export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  caption?: string;
}

export const galleryImages: GalleryImage[] = [
  {
    id: "1",
    src: "https://images.unsplash.com/photo-1486427944544-d2c246c4df14?w=1200&h=675&fit=crop",
    alt: "정성껏 만든 디저트",
    caption: "매일의 건강을 생각하는 저당 디저트",
  },
  {
    id: "2",
    src: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=1200&h=675&fit=crop",
    alt: "티라미수 제조 과정",
    caption: "올가닉 원재료로 정성껏 만듭니다",
  },
  {
    id: "3",
    src: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=1200&h=675&fit=crop",
    alt: "글루텐프리 쿠키",
    caption: "글루텐프리, 저당으로 부담 없이",
  },
  {
    id: "4",
    src: "https://images.unsplash.com/photo-1495147466023-ac5c588e2e94?w=1200&h=675&fit=crop",
    alt: "건강한 식탁 풍경",
    caption: "가족의 식탁에 온기를 더합니다",
  },
  {
    id: "5",
    src: "https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=1200&h=675&fit=crop",
    alt: "컬러풀 마카롱",
    caption: "천연 색소로 물들인 저당 마카롱",
  },
  {
    id: "6",
    src: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&h=675&fit=crop",
    alt: "웰니스 식품 구성",
    caption: "건강한 먹거리로 채우는 하루",
  },
];

export const instagramPosts = [
  {
    id: "1",
    url: "#",
    thumbnail: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=400&fit=crop",
    caption: "저당 티라미수 클로즈업",
  },
  {
    id: "2",
    url: "#",
    thumbnail: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=400&fit=crop",
    caption: "갓 구운 글루텐프리 쿠키",
  },
  {
    id: "3",
    url: "#",
    thumbnail: "https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=400&h=400&fit=crop",
    caption: "오늘의 마카롱 컬러",
  },
  {
    id: "4",
    url: "#",
    thumbnail: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&h=400&fit=crop",
    caption: "비건 브라우니 한 조각",
  },
  {
    id: "5",
    url: "#",
    thumbnail: "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=400&h=400&fit=crop",
    caption: "계절 과일 타르트",
  },
  {
    id: "6",
    url: "#",
    thumbnail: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=400&fit=crop",
    caption: "오트밀 푸딩 모닝",
  },
  {
    id: "7",
    url: "#",
    thumbnail: "https://images.unsplash.com/photo-1509365465985-25d11c17e812?w=400&h=400&fit=crop",
    caption: "유기농 휘낭시에",
  },
  {
    id: "8",
    url: "#",
    thumbnail: "https://images.unsplash.com/photo-1495147466023-ac5c588e2e94?w=400&h=400&fit=crop",
    caption: "하루담 신선 박스 준비중",
  },
];
