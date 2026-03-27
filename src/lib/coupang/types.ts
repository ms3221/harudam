// 쿠팡 WING API 타입 정의
// 독립 모듈 - 프로젝트 의존성 없음

export interface CoupangImage {
  imageOrder: number;
  imageType: "REPRESENTATION" | "DETAIL";
  vendorPath: string;
}

export interface CoupangNotice {
  noticeCategoryName: string;
  noticeCategoryDetailName: string;
  content: string;
}

export interface CoupangAttribute {
  attributeTypeName: string;
  attributeValueName: string;
}

export interface CoupangProductItem {
  itemName: string;
  originalPrice: number;
  salePrice: number;
  maximumBuyCount: number;
  maximumBuyForPerson: number;
  maximumBuyForPersonPeriod: number;
  outboundShippingTimeDay: number;
  unitCount: number;
  adultOnly: "ADULT_ONLY" | "EVERYONE";
  taxType: "TAX" | "FREE";
  parallelImported: "NOT_PARALLEL_IMPORTED" | "PARALLEL_IMPORTED";
  overseasPurchased: "NOT_OVERSEAS_PURCHASED" | "OVERSEAS_PURCHASED";
  pccNeeded: boolean;
  bestPriceGuaranteed3P: boolean;
  searchTags: string;
  images: CoupangImage[];
  notices: CoupangNotice[];
  attributes: CoupangAttribute[];
  contents: { contentType: "TEXT" | "IMAGE"; content: string }[];
  offerCondition: "NEW" | "REFURBISHED" | "USED_BEST" | "USED_GOOD" | "USED_NORMAL";
  offerDescription: string;
  barcode?: string;
  modelNo?: string;
  extraProperties?: Record<string, string>;
}

export interface CoupangProductRequest {
  displayCategoryCode: number;
  sellerProductName: string;
  vendorId: string;
  saleStartedAt: string;
  saleEndedAt: string;
  displayProductName: string;
  brand: string;
  generalProductName: string;
  productGroup: string;
  deliveryMethod: "SEQUENCIAL" | "COLD_FRESH" | "MAKE_ORDER" | "AGENT_BUY" | "VENDOR_DIRECT";
  deliveryCompanyCode: string;
  deliveryChargeType: "FREE" | "NOT_FREE" | "CHARGE_RECEIVED" | "CONDITIONAL_FREE";
  deliveryCharge: number;
  freeShipOverAmount: number;
  deliveryChargeOnReturn: number;
  remoteAreaDeliverable: "N" | "Y";
  unionDeliveryType: "UNION_DELIVERY" | "NOT_UNION_DELIVERY";
  returnCenterCode: string;
  returnChargeName: string;
  companyContactNumber: string;
  returnZipCode: string;
  returnAddress: string;
  returnAddressDetail: string;
  returnCharge: number;
  returnChargeVendor: "VENDOR" | "BUYER";
  afterServiceInformation: string;
  afterServiceContactNumber: string;
  outboundShippingPlaceCode: number;
  vendorUserId: string;
  requested: boolean;
  items: CoupangProductItem[];
  extraInfoMessage?: string;
  manufacture?: string;
}

export interface CoupangResponse<T = unknown> {
  code: string;
  message: string;
  data: T;
}

export interface CoupangProductCreateResponse {
  sellerProductId: number;
}

export interface CoupangApproveResponse {
  statusCode: number;
  message: string;
}

export interface CoupangCategoryPrediction {
  autoCategorizationPredictionResultType: "SUCCESS" | "FAILURE";
  predictedCategoryId: string;
  predictedCategoryName: string;
  comment: string | null;
}

export type CoupangStatusName =
  | "심사중"
  | "임시저장"
  | "승인대기중"
  | "승인완료"
  | "부분승인완료"
  | "승인반려"
  | "상품삭제";

export interface CoupangProductDetailItem {
  sellerProductItemId: number;
  vendorItemId: number;
  itemName: string;
  salePrice: number;
  originalPrice: number;
}

export interface CoupangProductDetail {
  sellerProductId: number;
  sellerProductName: string;
  statusName: CoupangStatusName;
  displayProductName: string;
  items: CoupangProductDetailItem[];
}
