import * as cheerio from "cheerio";

const BASE_URL = "https://www.hankyeong.kr";

export interface HotProduct {
  rank: number;
  code: string;
  name: string;
  originalPrice: number | null;
  salePrice: number | null;
  discountRate: string | null;
  image: string | null;
  detailUrl: string;
}

export interface CrawlSnapshot {
  id: string;
  crawledAt: string;
  products: HotProduct[];
}

function parsePrice(text: string): number | null {
  const match = text.replace(/[,\s]/g, "").match(/(\d+)/);
  return match ? parseInt(match[1]) : null;
}

export async function crawlHot6(): Promise<CrawlSnapshot> {
  const res = await fetch(BASE_URL, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    },
  });

  if (!res.ok) {
    throw new Error(`페이지를 불러올 수 없습니다: ${res.status}`);
  }

  const html = await res.text();
  const $ = cheerio.load(html);

  const products: HotProduct[] = [];

  // "시골농부 HOT 6" 섹션의 각 상품 아이템 파싱
  $(".brd-recommen .panel.prod").each((_, el) => {
    const $item = $(el);

    // 상품 코드 & 상세 URL
    const code = $item.find(".itemprod").attr("data-mgcode") || "";
    const detailUrl = code ? `${BASE_URL}/Goods/Detail/${code}` : "";

    // 순위
    const rankText = $item.find(".dc-rank").text().trim();
    const rank = parseInt(rankText) || products.length + 1;

    // 이미지
    const image = $item.find("img.img-responsive").attr("src") || null;

    // 상품명
    const name = $item.find(".prod-title").text().trim();

    // 원가
    const originalPrice = parsePrice(
      $item.find(".org-price").text()
    );

    // 판매가
    const salePrice = parsePrice(
      $item.find(".price").not(".org-price").first().text()
    );

    // 할인율
    const discountRate = $item.find(".dc-rate").text().trim() || null;

    if (name) {
      products.push({
        rank,
        code,
        name,
        originalPrice,
        salePrice,
        discountRate,
        image,
        detailUrl,
      });
    }
  });

  if (products.length === 0) {
    throw new Error("HOT 6 상품을 찾을 수 없습니다. 사이트 구조가 변경되었을 수 있습니다.");
  }

  return {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
    crawledAt: new Date().toISOString(),
    products,
  };
}

// 개별 상품 상세 크롤링 (URL 직접 입력용)
export async function crawlProductDetail(url: string) {
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    },
  });

  if (!res.ok) {
    throw new Error(`페이지를 불러올 수 없습니다: ${res.status}`);
  }

  const html = await res.text();
  const $ = cheerio.load(html);

  let name = "";
  let image: string | null = null;
  let salePrice: number | null = null;
  let originalPrice: number | null = null;
  let description: string | null = null;
  let rating: string | null = null;
  let reviewCount: string | null = null;

  // JSON-LD에서 추출
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const json = JSON.parse($(el).text());
      if (json["@type"] === "Product" || json.name) {
        name = name || json.name || "";
        const img = json.image;
        image = image || (Array.isArray(img) ? img[0] : img) || null;
        description = description || json.description || null;
        if (json.offers) {
          const offer = Array.isArray(json.offers) ? json.offers[0] : json.offers;
          salePrice = salePrice || parseFloat(offer.price) || null;
        }
        if (json.aggregateRating) {
          rating = rating || String(json.aggregateRating.ratingValue) || null;
          reviewCount = reviewCount || String(json.aggregateRating.reviewCount) || null;
        }
      }
    } catch {
      // 무시
    }
  });

  if (!name) {
    name = $('meta[property="og:title"]').attr("content") || $("title").text() || "";
  }
  if (!image) {
    image = $('meta[property="og:image"]').attr("content") || null;
  }
  if (!description) {
    description = $('meta[property="og:description"]').attr("content") || null;
  }

  return {
    url,
    name: name.trim(),
    originalPrice,
    salePrice,
    image,
    description,
    rating,
    reviewCount,
  };
}
