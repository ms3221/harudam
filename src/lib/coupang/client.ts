// 쿠팡 WING API 클라이언트
// 독립 모듈 - 프로젝트 의존성 없음

import { generateSignature } from "./auth";

const BASE_URL = "https://api-gateway.coupang.com";

export class CoupangClient {
  private accessKey: string;
  private secretKey: string;

  constructor(accessKey: string, secretKey: string) {
    this.accessKey = accessKey;
    this.secretKey = secretKey;
  }

  async request<T>(method: string, path: string, body?: unknown): Promise<T> {
    const authorization = generateSignature({
      method: method.toUpperCase(),
      path,
      accessKey: this.accessKey,
      secretKey: this.secretKey,
    });

    const headers: Record<string, string> = {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: authorization,
    };

    const res = await fetch(`${BASE_URL}${path}`, {
      method: method.toUpperCase(),
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    const json = await res.json().catch(() => null);

    if (!res.ok) {
      const msg = json?.message || `HTTP ${res.status}`;
      throw new Error(`Coupang API error ${res.status}: ${msg}`);
    }

    // 쿠팡은 200이어도 code: "ERROR"로 에러를 보냄
    if (json?.code === "ERROR") {
      throw new Error(json.message || "쿠팡 API 오류");
    }

    return json;
  }

  /** API 키 유효성을 확인하는 헬스체크 (카테고리 조회 API 호출) */
  async healthCheck(): Promise<{ ok: boolean; message: string }> {
    try {
      await this.request("GET", "/v2/providers/seller_api/apis/api/v1/marketplace/meta/category-related-metas/display-category-codes/37544");
      return { ok: true, message: "인증 성공" };
    } catch (error) {
      const msg = error instanceof Error ? error.message : "알 수 없는 오류";
      return { ok: false, message: `인증 실패: ${msg}` };
    }
  }
}
