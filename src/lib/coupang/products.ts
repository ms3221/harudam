// 쿠팡 상품 API
// 독립 모듈 - 프로젝트 의존성 없음

import type { CoupangClient } from "./client";
import type {
  CoupangProductRequest,
  CoupangResponse,
  CoupangProductCreateResponse,
  CoupangApproveResponse,
  CoupangCategoryPrediction,
  CoupangProductDetail,
} from "./types";

const PRODUCTS_PATH =
  "/v2/providers/seller_api/apis/api/v1/marketplace/seller-products";

const CATEGORY_PREDICT_PATH =
  "/v2/providers/openapi/apis/api/v1/categorization/predict";

export async function createProduct(
  client: CoupangClient,
  productData: CoupangProductRequest
): Promise<CoupangResponse<CoupangProductCreateResponse>> {
  return client.request("POST", PRODUCTS_PATH, productData);
}

export async function approveProduct(
  client: CoupangClient,
  sellerProductId: number
): Promise<CoupangResponse<CoupangApproveResponse>> {
  return client.request(
    "PUT",
    `${PRODUCTS_PATH}/${sellerProductId}/approvals`
  );
}

// 상품 수정 (승인불필요) - 배송/반품지 관련 정보만 수정
export async function updateProductPartial(
  client: CoupangClient,
  sellerProductId: number,
  partialData: Record<string, unknown>
): Promise<CoupangResponse<CoupangProductCreateResponse>> {
  return client.request("PUT", `${PRODUCTS_PATH}/${sellerProductId}/partial`, {
    sellerProductId,
    ...partialData,
  });
}

// 상품 수정 (승인필요) - 전체 상품 정보 수정
export async function updateProduct(
  client: CoupangClient,
  sellerProductId: number,
  productData: CoupangProductRequest
): Promise<CoupangResponse<CoupangProductCreateResponse>> {
  return client.request("PUT", PRODUCTS_PATH, {
    sellerProductId,
    ...productData,
  });
}

export async function getProduct(
  client: CoupangClient,
  sellerProductId: number
): Promise<CoupangResponse<CoupangProductDetail>> {
  return client.request("GET", `${PRODUCTS_PATH}/${sellerProductId}`);
}

// 카테고리 추천 API
export async function predictCategory(
  client: CoupangClient,
  params: {
    productName: string;
    productDescription?: string;
    brand?: string;
    attributes?: Record<string, string>;
  }
): Promise<CoupangResponse<CoupangCategoryPrediction>> {
  return client.request("POST", CATEGORY_PREDICT_PATH, params);
}
