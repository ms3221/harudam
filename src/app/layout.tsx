import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BackToTop } from "@/components/ui/BackToTop";
import { FloatingContact } from "@/components/ui/FloatingContact";

export const metadata: Metadata = {
  title: "하루담 HARUDAM | 가족의 하루를 담다",
  description:
    "저당·저자극·저칼로리 웰니스 올가닉 디저트. 가족 모두가 안심하고 즐길 수 있는 건강한 먹거리를 담아 보내드립니다.",
  keywords: [
    "하루담",
    "HARUDAM",
    "저당 디저트",
    "웰니스",
    "올가닉",
    "글루텐프리",
    "비건 디저트",
    "저칼로리",
    "밀키트",
    "건강 먹거리",
    "건강기능식품",
  ],
  openGraph: {
    title: "하루담 HARUDAM | 가족의 하루를 담다",
    description:
      "저당·저자극·저칼로리 웰니스 디저트로 시작하는 건강한 하루.",
    type: "website",
    locale: "ko_KR",
    siteName: "하루담",
  },
  twitter: {
    card: "summary_large_image",
    title: "하루담 HARUDAM",
    description: "가족의 하루를 담다",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body className="antialiased">
        <Header />
        <main>{children}</main>
        <Footer />
        <BackToTop />
        <FloatingContact />
      </body>
    </html>
  );
}
