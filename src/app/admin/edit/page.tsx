"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

interface ConfigDefaults {
  vendorId: string;
  vendorUserId: string;
  returnCenterCode: string;
  returnChargeName: string;
  companyContactNumber: string;
  returnZipCode: string;
  returnAddress: string;
  returnAddressDetail: string;
  outboundShippingPlaceCode: string;
}

interface AttributeRow {
  id: string;
  attributeTypeName: string;
  attributeValueName: string;
}

interface NoticeRow {
  id: string;
  noticeCategoryName: string;
  noticeCategoryDetailName: string;
  content: string;
}

interface ContentRow {
  id: string;
  contentType: "TEXT" | "IMAGE";
  content: string;
}

export default function EditPageWrapper() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-warm-900 flex items-center justify-center text-cream-100">
          로딩 중...
        </div>
      }
    >
      <EditPage />
    </Suspense>
  );
}

function EditPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const registeredProductId = searchParams.get("id");

  // 설정 상태
  const [defaults, setDefaults] = useState<ConfigDefaults | null>(null);

  // 폼 상태 - 기본 정보
  const [sellerProductName, setSellerProductName] = useState("");
  const [displayProductName, setDisplayProductName] = useState("");
  const [brand, setBrand] = useState("");
  const [generalProductName, setGeneralProductName] = useState("");
  const [displayCategoryCode, setDisplayCategoryCode] = useState("");
  const [productGroup, setProductGroup] = useState("");

  // 가격/재고
  const [originalPrice, setOriginalPrice] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [maximumBuyCount, setMaximumBuyCount] = useState("999");
  const [maximumBuyForPerson, setMaximumBuyForPerson] = useState("0");
  const [outboundShippingTimeDay, setOutboundShippingTimeDay] = useState("2");

  // 배송
  const [deliveryMethod, setDeliveryMethod] = useState("SEQUENCIAL");
  const [deliveryCompanyCode, setDeliveryCompanyCode] = useState("KGB");
  const [deliveryChargeType, setDeliveryChargeType] = useState("FREE");
  const [deliveryCharge, setDeliveryCharge] = useState("0");
  const [freeShipOverAmount, setFreeShipOverAmount] = useState("0");
  const [returnCharge, setReturnCharge] = useState("5000");
  const [remoteAreaDeliverable, setRemoteAreaDeliverable] = useState("N");
  const [unionDeliveryType, setUnionDeliveryType] = useState("NOT_UNION_DELIVERY");

  // 반품/출고지
  const [returnCenterCode, setReturnCenterCode] = useState("");
  const [returnChargeName, setReturnChargeName] = useState("");
  const [companyContactNumber, setCompanyContactNumber] = useState("");
  const [returnZipCode, setReturnZipCode] = useState("");
  const [returnAddress, setReturnAddress] = useState("");
  const [returnAddressDetail, setReturnAddressDetail] = useState("");
  const [outboundShippingPlaceCode, setOutboundShippingPlaceCode] = useState("");
  const [vendorId, setVendorId] = useState("");
  const [vendorUserId, setVendorUserId] = useState("");

  // 이미지
  const [representImage, setRepresentImage] = useState("");
  const [detailImages, setDetailImages] = useState<string[]>([""]);

  // 속성
  const [attributes, setAttributes] = useState<AttributeRow[]>([]);

  // 상품고시
  const [notices, setNotices] = useState<NoticeRow[]>([]);

  // 상세 컨텐츠
  const [contents, setContents] = useState<ContentRow[]>([
    { id: crypto.randomUUID(), contentType: "TEXT", content: "" },
  ]);

  // 기타
  const [taxType, setTaxType] = useState("TAX");
  const [adultOnly, setAdultOnly] = useState("EVERYONE");
  const [parallelImported, setParallelImported] = useState("NOT_PARALLEL_IMPORTED");
  const [overseasPurchased, setOverseasPurchased] = useState("NOT_OVERSEAS_PURCHASED");
  const [afterServiceInfo, setAfterServiceInfo] = useState("");
  const [afterServiceContact, setAfterServiceContact] = useState("");
  const [searchTags, setSearchTags] = useState<string[]>([]);

  // UI 상태
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  // 카테고리 추천
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [categoryResult, setCategoryResult] = useState<{ id: string; name: string } | null>(null);
  const [metaLoading, setMetaLoading] = useState(false);

  // 반품지/출고지 조회
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupData, setLookupData] = useState<{
    returnCenters: any;
    shippingPlaces: any;
    errors?: { returnCenters?: string | null; shippingPlaces?: string | null };
  } | null>(null);

  // request_data (쿠팡 API 형식)에서 폼 필드 복원
  const restoreFromRequestData = useCallback((data: any) => {
    if (!data) return;

    // 기본 정보
    if (data.sellerProductName) setSellerProductName(data.sellerProductName);
    if (data.displayProductName) setDisplayProductName(data.displayProductName);
    if (data.brand) setBrand(data.brand);
    if (data.generalProductName) setGeneralProductName(data.generalProductName);
    if (data.displayCategoryCode) setDisplayCategoryCode(String(data.displayCategoryCode));
    if (data.productGroup) setProductGroup(data.productGroup);

    // 배송
    if (data.deliveryMethod) setDeliveryMethod(data.deliveryMethod);
    if (data.deliveryCompanyCode) setDeliveryCompanyCode(data.deliveryCompanyCode);
    if (data.deliveryChargeType) setDeliveryChargeType(data.deliveryChargeType);
    if (data.deliveryCharge !== undefined) setDeliveryCharge(String(data.deliveryCharge));
    if (data.freeShipOverAmount !== undefined) setFreeShipOverAmount(String(data.freeShipOverAmount));
    if (data.deliveryChargeOnReturn !== undefined) setReturnCharge(String(data.deliveryChargeOnReturn));
    else if (data.returnCharge !== undefined) setReturnCharge(String(data.returnCharge));
    if (data.remoteAreaDeliverable) setRemoteAreaDeliverable(data.remoteAreaDeliverable);
    if (data.unionDeliveryType) setUnionDeliveryType(data.unionDeliveryType);

    // 반품/출고지
    if (data.returnCenterCode) setReturnCenterCode(String(data.returnCenterCode));
    if (data.returnChargeName) setReturnChargeName(data.returnChargeName);
    if (data.companyContactNumber) setCompanyContactNumber(data.companyContactNumber);
    if (data.returnZipCode) setReturnZipCode(data.returnZipCode);
    if (data.returnAddress) setReturnAddress(data.returnAddress);
    if (data.returnAddressDetail) setReturnAddressDetail(data.returnAddressDetail);
    if (data.outboundShippingPlaceCode) setOutboundShippingPlaceCode(String(data.outboundShippingPlaceCode));
    if (data.vendorId) setVendorId(String(data.vendorId));
    if (data.vendorUserId) setVendorUserId(String(data.vendorUserId));

    // A/S
    if (data.afterServiceInformation) setAfterServiceInfo(data.afterServiceInformation);
    if (data.afterServiceContactNumber) setAfterServiceContact(data.afterServiceContactNumber);

    // items[0]에서 가격/재고/이미지/속성/고시 복원
    const item = data.items?.[0];
    if (item) {
      if (item.originalPrice) setOriginalPrice(String(item.originalPrice));
      if (item.salePrice) setSalePrice(String(item.salePrice));
      if (item.maximumBuyCount) setMaximumBuyCount(String(item.maximumBuyCount));
      if (item.maximumBuyForPerson !== undefined) setMaximumBuyForPerson(String(item.maximumBuyForPerson));
      if (item.outboundShippingTimeDay) setOutboundShippingTimeDay(String(item.outboundShippingTimeDay));
      if (item.taxType) setTaxType(item.taxType);
      if (item.adultOnly) setAdultOnly(item.adultOnly === "GENERAL" ? "EVERYONE" : item.adultOnly);
      if (item.parallelImported) setParallelImported(item.parallelImported);
      if (item.overseasPurchased) setOverseasPurchased(item.overseasPurchased);

      // 검색 태그
      if (item.searchTags && Array.isArray(item.searchTags)) {
        setSearchTags(item.searchTags);
      }

      // 이미지 (cdnPath 우선, 없으면 vendorPath)
      if (item.images && Array.isArray(item.images)) {
        const getImagePath = (img: any) => img.cdnPath || img.vendorPath || "";
        const repImg = item.images.find((img: any) => img.imageType === "REPRESENTATION");
        if (repImg) setRepresentImage(getImagePath(repImg));
        const detImgs = item.images
          .filter((img: any) => img.imageType === "DETAIL")
          .sort((a: any, b: any) => (a.imageOrder || 0) - (b.imageOrder || 0))
          .map((img: any) => getImagePath(img));
        if (detImgs.length > 0) setDetailImages(detImgs);
      }

      // 속성
      if (item.attributes && Array.isArray(item.attributes)) {
        setAttributes(
          item.attributes.map((a: any) => ({
            id: crypto.randomUUID(),
            attributeTypeName: a.attributeTypeName || "",
            attributeValueName: a.attributeValueName || "",
          }))
        );
      }

      // 고시정보
      if (item.notices && Array.isArray(item.notices)) {
        setNotices(
          item.notices.map((n: any) => ({
            id: crypto.randomUUID(),
            noticeCategoryName: n.noticeCategoryName || "",
            noticeCategoryDetailName: n.noticeCategoryDetailName || "",
            content: n.content || "",
          }))
        );
      }

      // 상세 컨텐츠 (생성 형식: contentType/content, 수정 형식: contentsType/contentDetails)
      if (item.contents && Array.isArray(item.contents)) {
        setContents(
          item.contents.map((c: any) => {
            // 수정 API 형식 (contentsType + contentDetails)
            if (c.contentsType) {
              const detail = c.contentDetails?.[0];
              return {
                id: crypto.randomUUID(),
                contentType: (c.contentsType || "TEXT") as "TEXT" | "IMAGE",
                content: detail?.content || "",
              };
            }
            // 생성 API 형식 (contentType + content)
            return {
              id: crypto.randomUUID(),
              contentType: (c.contentType || "TEXT") as "TEXT" | "IMAGE",
              content: c.content || "",
            };
          })
        );
      }
    }
  }, []);

  // 설정 로드
  useEffect(() => {
    fetch("/api/admin/coupang/config")
      .then((r) => r.json())
      .then((data) => {
        if (data.defaults) {
          setDefaults(data.defaults);
        }
      })
      .catch(() => {});
  }, []);

  // 상품 데이터 로드
  useEffect(() => {
    if (!registeredProductId) {
      setLoading(false);
      return;
    }
    fetch(`/api/admin/coupang/products?id=${registeredProductId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.request_data) {
          restoreFromRequestData(data.request_data);
        }
      })
      .catch(() => {
        setResult({ success: false, message: "상품 데이터를 불러오지 못했습니다." });
      })
      .finally(() => setLoading(false));
  }, [registeredProductId, restoreFromRequestData]);

  // 카테고리 추천
  const handleCategoryPredict = useCallback(async () => {
    const name = sellerProductName || displayProductName || generalProductName;
    if (!name.trim()) return alert("카테고리 추천을 위해 상품명을 먼저 입력하세요.");
    setCategoryLoading(true);
    setCategoryResult(null);
    try {
      const res = await fetch("/api/admin/coupang/category", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productName: name, brand: brand || undefined }),
      });
      const data = await res.json();
      if (res.ok && data.data?.predictedCategoryId) {
        setCategoryResult({ id: data.data.predictedCategoryId, name: data.data.predictedCategoryName });
        setDisplayCategoryCode(data.data.predictedCategoryId);
      } else {
        alert(data.error || data.data?.comment || "카테고리 추천 실패");
      }
    } catch { alert("카테고리 추천 요청 실패"); }
    finally { setCategoryLoading(false); }
  }, [sellerProductName, displayProductName, generalProductName, brand]);

  // 메타정보 로드
  const handleLoadMeta = useCallback(async () => {
    if (!displayCategoryCode.trim()) return alert("카테고리 코드를 먼저 입력하세요.");
    setMetaLoading(true);
    try {
      const res = await fetch(`/api/admin/coupang/meta?categoryCode=${displayCategoryCode}`);
      const data = await res.json();
      if (!res.ok) return alert(data.error || "메타정보 조회 실패");
      const meta = data.data || data;
      if (meta.noticeCategories?.length > 0) {
        const firstNotice = meta.noticeCategories[0];
        const newNotices = (firstNotice.noticeCategoryDetailNames || []).map(
          (detail: { noticeCategoryDetailName: string }) => ({
            id: crypto.randomUUID(),
            noticeCategoryName: firstNotice.noticeCategoryName,
            noticeCategoryDetailName: detail.noticeCategoryDetailName,
            content: "상세페이지 참조",
          })
        );
        if (newNotices.length > 0) setNotices(newNotices);
      }
      if (meta.attributes?.length > 0) {
        const newAttrs = meta.attributes
          .filter((a: { required: string }) => a.required === "MANDATORY")
          .map((a: { attributeTypeName: string }) => ({
            id: crypto.randomUUID(),
            attributeTypeName: a.attributeTypeName,
            attributeValueName: "",
          }));
        if (newAttrs.length > 0) setAttributes(newAttrs);
      }
      alert("메타정보를 불러왔습니다.");
    } catch { alert("메타정보 조회 요청 실패"); }
    finally { setMetaLoading(false); }
  }, [displayCategoryCode]);

  // 반품지/출고지 조회
  const handleLookup = useCallback(async () => {
    setLookupLoading(true);
    try {
      const res = await fetch("/api/admin/coupang/lookup");
      const data = await res.json();
      if (res.ok) setLookupData(data);
      else alert(data.error || "조회 실패");
    } catch { alert("조회 요청 실패"); }
    finally { setLookupLoading(false); }
  }, []);

  const applyReturnCenter = (center: any) => {
    setReturnCenterCode(String(center.returnCenterCode || ""));
    setReturnChargeName(center.shippingPlaceName || center.returnChargeName || "");
    setCompanyContactNumber(center.placeAddresses?.[0]?.companyContactNumber || center.companyContactNumber || "");
    setReturnZipCode(center.placeAddresses?.[0]?.returnZipCode || center.returnZipCode || "");
    setReturnAddress(center.placeAddresses?.[0]?.returnAddress || center.returnAddress || "");
    setReturnAddressDetail(center.placeAddresses?.[0]?.returnAddressDetail || center.returnAddressDetail || "");
  };

  const applyShippingPlace = (place: any) => {
    setOutboundShippingPlaceCode(String(place.outboundShippingPlaceCode || ""));
  };

  // 수정 제출
  const handleSubmit = async () => {
    if (!sellerProductName.trim()) return alert("등록상품명을 입력하세요.");
    if (!displayCategoryCode.trim()) return alert("카테고리 코드를 입력하세요.");
    if (!salePrice.trim()) return alert("판매가격을 입력하세요.");

    setSubmitting(true);
    setResult(null);

    const toImageEntry = (url: string, order: number, type: "REPRESENTATION" | "DETAIL") => {
      const isCdn = url.startsWith("vendor_inventory/");
      return {
        imageOrder: order,
        imageType: type,
        // cdnPath인 경우 둘 다 보내야 함 (vendorPath 필수)
        ...(isCdn
          ? { cdnPath: url, vendorPath: url }
          : { vendorPath: url }),
      };
    };
    const images = [
      toImageEntry(representImage, 0, "REPRESENTATION"),
      ...detailImages
        .filter((url) => url.trim())
        .map((url, i) => toImageEntry(url, i + 1, "DETAIL")),
    ];

    const now = new Date();
    const saleStartedAt = now.toISOString().slice(0, 19);
    const saleEndedAt = "2099-01-01T23:59:59";

    const requestBody = {
      registeredProductId,
      displayCategoryCode: Number(displayCategoryCode),
      sellerProductName,
      vendorId: vendorId || defaults?.vendorId || "",
      saleStartedAt,
      saleEndedAt,
      displayProductName,
      brand,
      generalProductName,
      productGroup: productGroup || "",
      deliveryMethod,
      deliveryCompanyCode,
      deliveryChargeType,
      deliveryCharge: Number(deliveryCharge),
      freeShipOverAmount: Number(freeShipOverAmount),
      deliveryChargeOnReturn: Number(returnCharge),
      remoteAreaDeliverable,
      unionDeliveryType,
      returnCenterCode: returnCenterCode || defaults?.returnCenterCode || "",
      returnChargeName: returnChargeName || defaults?.returnChargeName || "",
      companyContactNumber: companyContactNumber || defaults?.companyContactNumber || "",
      returnZipCode: returnZipCode || defaults?.returnZipCode || "",
      returnAddress: returnAddress || defaults?.returnAddress || "",
      returnAddressDetail: returnAddressDetail || defaults?.returnAddressDetail || "",
      returnCharge: Number(returnCharge),
      returnChargeVendor: "BUYER",
      afterServiceInformation: afterServiceInfo || "판매자 문의",
      afterServiceContactNumber: afterServiceContact || defaults?.companyContactNumber || "",
      outboundShippingPlaceCode: Number(outboundShippingPlaceCode || defaults?.outboundShippingPlaceCode || "0"),
      vendorUserId: vendorUserId || defaults?.vendorUserId || "",
      requested: true,
      items: [
        {
          itemName: sellerProductName,
          originalPrice: Number(originalPrice) || Number(salePrice),
          salePrice: Number(salePrice),
          maximumBuyCount: Number(maximumBuyCount),
          maximumBuyForPerson: Number(maximumBuyForPerson),
          maximumBuyForPersonPeriod: 1,
          outboundShippingTimeDay: Number(outboundShippingTimeDay),
          unitCount: 1,
          adultOnly,
          taxType,
          parallelImported,
          overseasPurchased,
          pccNeeded: false,
          bestPriceGuaranteed3P: false,
          searchTags: searchTags.filter((t) => t.trim()),
          images,
          notices: notices
            .filter((n) => n.noticeCategoryName && n.content)
            .map(({ noticeCategoryName, noticeCategoryDetailName, content }) => ({
              noticeCategoryName, noticeCategoryDetailName, content,
            })),
          attributes: attributes
            .filter((a) => a.attributeTypeName && a.attributeValueName)
            .map(({ attributeTypeName, attributeValueName }) => ({
              attributeTypeName, attributeValueName,
            })),
          contents: contents
            .filter((c) => c.content.trim())
            .map(({ contentType, content }) => ({
              contentsType: contentType,
              contentDetails: [{ content, detailType: contentType }],
            })),
          offerCondition: "NEW",
          offerDescription: "",
        },
      ],
    };

    try {
      const res = await fetch("/api/admin/coupang/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });
      const data = await res.json();
      if (res.ok) {
        setResult({ success: true, message: "상품 수정이 완료되었습니다. 쿠팡에서 임시저장 상태로 변경됩니다." });
        setTimeout(() => router.push("/admin?tab=products"), 1500);
      } else {
        setResult({ success: false, message: data.error || "수정 실패" });
      }
    } catch (error) {
      setResult({ success: false, message: error instanceof Error ? error.message : "요청 실패" });
    } finally {
      setSubmitting(false);
    }
  };

  // 헬퍼 함수들
  const addAttribute = () =>
    setAttributes((prev) => [...prev, { id: crypto.randomUUID(), attributeTypeName: "", attributeValueName: "" }]);
  const removeAttribute = (id: string) =>
    setAttributes((prev) => prev.filter((a) => a.id !== id));
  const updateAttribute = (id: string, field: keyof AttributeRow, value: string) =>
    setAttributes((prev) => prev.map((a) => (a.id === id ? { ...a, [field]: value } : a)));

  const addNotice = () =>
    setNotices((prev) => [...prev, { id: crypto.randomUUID(), noticeCategoryName: "", noticeCategoryDetailName: "", content: "" }]);
  const removeNotice = (id: string) =>
    setNotices((prev) => prev.filter((n) => n.id !== id));
  const updateNotice = (id: string, field: keyof NoticeRow, value: string) =>
    setNotices((prev) => prev.map((n) => (n.id === id ? { ...n, [field]: value } : n)));

  const addContent = () =>
    setContents((prev) => [...prev, { id: crypto.randomUUID(), contentType: "TEXT", content: "" }]);
  const removeContent = (id: string) =>
    setContents((prev) => prev.filter((c) => c.id !== id));
  const updateContent = (id: string, field: keyof ContentRow, value: string) =>
    setContents((prev) => prev.map((c) => (c.id === id ? { ...c, [field]: value } : c)));

  const addDetailImage = () => setDetailImages((prev) => [...prev, ""]);
  const removeDetailImage = (idx: number) =>
    setDetailImages((prev) => prev.filter((_, i) => i !== idx));
  const updateDetailImage = (idx: number, value: string) =>
    setDetailImages((prev) => prev.map((v, i) => (i === idx ? value : v)));

  const inputClass =
    "w-full px-3 py-2 bg-warm-700 border border-warm-600 rounded-lg text-cream-100 placeholder:text-warm-500 focus:outline-none focus:border-green-500 text-sm";
  const selectClass =
    "w-full px-3 py-2 bg-warm-700 border border-warm-600 rounded-lg text-cream-100 focus:outline-none focus:border-green-500 text-sm";
  const labelClass = "block text-sm font-medium text-warm-300 mb-1";

  if (!registeredProductId) {
    return (
      <div className="min-h-screen bg-warm-900 flex items-center justify-center text-cream-100">
        <div className="text-center">
          <p className="text-warm-400 mb-4">상품 ID가 지정되지 않았습니다.</p>
          <button onClick={() => router.push("/admin?tab=products")} className="px-4 py-2 bg-warm-700 hover:bg-warm-600 rounded-lg transition-colors text-sm">
            돌아가기
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-warm-900 flex items-center justify-center text-cream-100">
        <span className="w-6 h-6 border-2 border-warm-500 border-t-cream-100 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-900 text-cream-100">
      {/* 헤더 */}
      <header className="sticky top-0 z-10 bg-warm-800/95 backdrop-blur border-b border-warm-700">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/admin?tab=products")}
              className="text-warm-400 hover:text-cream-100 transition-colors text-sm"
            >
              &larr; 돌아가기
            </button>
            <h1 className="text-xl font-bold text-orange-400">쿠팡 상품 수정</h1>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* 1. 기본 정보 */}
        <Section title="기본 정보">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>등록상품명 *</label>
              <input className={inputClass} value={sellerProductName} onChange={(e) => setSellerProductName(e.target.value)} placeholder="쿠팡에 등록될 상품명" />
            </div>
            <div>
              <label className={labelClass}>노출상품명</label>
              <input className={inputClass} value={displayProductName} onChange={(e) => setDisplayProductName(e.target.value)} placeholder="고객에게 노출될 이름" />
            </div>
            <div>
              <label className={labelClass}>브랜드</label>
              <input className={inputClass} value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="브랜드명" />
            </div>
            <div>
              <label className={labelClass}>제품명</label>
              <input className={inputClass} value={generalProductName} onChange={(e) => setGeneralProductName(e.target.value)} placeholder="일반 제품명" />
            </div>
            <div>
              <label className={labelClass}>카테고리 코드 *</label>
              <div className="flex gap-2">
                <input className={inputClass + " flex-1"} value={displayCategoryCode} onChange={(e) => setDisplayCategoryCode(e.target.value)} placeholder="쿠팡 카테고리 코드 (숫자)" />
                <button type="button" onClick={handleCategoryPredict} disabled={categoryLoading} className="px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 whitespace-nowrap">
                  {categoryLoading ? "추천중..." : "AI 추천"}
                </button>
                <button type="button" onClick={handleLoadMeta} disabled={metaLoading || !displayCategoryCode.trim()} className="px-3 py-2 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 disabled:opacity-50 whitespace-nowrap">
                  {metaLoading ? "조회중..." : "메타 불러오기"}
                </button>
              </div>
              {categoryResult && (
                <p className="mt-1 text-sm text-green-400">추천: {categoryResult.name} ({categoryResult.id})</p>
              )}
            </div>
            <div>
              <label className={labelClass}>상품그룹</label>
              <input className={inputClass} value={productGroup} onChange={(e) => setProductGroup(e.target.value)} placeholder="상품그룹 (선택)" />
            </div>
          </div>
        </Section>

        {/* 2. 가격/재고 */}
        <Section title="가격 / 재고">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>할인율기준가 (원가)</label>
              <input type="number" className={inputClass} value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value)} placeholder="정가" />
            </div>
            <div>
              <label className={labelClass}>판매가격 *</label>
              <input type="number" className={inputClass} value={salePrice} onChange={(e) => setSalePrice(e.target.value)} placeholder="실제 판매가" />
            </div>
            <div>
              <label className={labelClass}>판매가능수량</label>
              <input type="number" className={inputClass} value={maximumBuyCount} onChange={(e) => setMaximumBuyCount(e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>인당 최대 구매 수량 (0=무제한)</label>
              <input type="number" className={inputClass} value={maximumBuyForPerson} onChange={(e) => setMaximumBuyForPerson(e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>출고 소요일</label>
              <input type="number" className={inputClass} value={outboundShippingTimeDay} onChange={(e) => setOutboundShippingTimeDay(e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>검색 태그</label>
              <div className="space-y-2">
                {searchTags.map((tag, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input
                      className={inputClass}
                      value={tag}
                      onChange={(e) =>
                        setSearchTags((prev) =>
                          prev.map((t, i) => (i === idx ? e.target.value : t))
                        )
                      }
                      placeholder="검색 키워드"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setSearchTags((prev) => prev.filter((_, i) => i !== idx))
                      }
                      className="px-3 py-2 bg-red-900/50 hover:bg-red-800 text-red-300 rounded-lg text-sm shrink-0"
                    >
                      삭제
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setSearchTags((prev) => [...prev, ""])}
                  className="text-sm text-green-400 hover:text-green-300"
                >
                  + 태그 추가
                </button>
              </div>
            </div>
          </div>
        </Section>

        {/* 3. 배송 설정 */}
        <Section title="배송 설정">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>배송방법</label>
              <select className={selectClass} value={deliveryMethod} onChange={(e) => setDeliveryMethod(e.target.value)}>
                <option value="SEQUENCIAL">순차배송</option>
                <option value="COLD_FRESH">냉장/냉동</option>
                <option value="MAKE_ORDER">주문제작</option>
                <option value="AGENT_BUY">구매대행</option>
                <option value="VENDOR_DIRECT">업체직송</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>택배사</label>
              <select className={selectClass} value={deliveryCompanyCode} onChange={(e) => setDeliveryCompanyCode(e.target.value)}>
                <option value="KGB">로젠택배</option>
                <option value="CJGLS">CJ대한통운</option>
                <option value="HANJIN">한진택배</option>
                <option value="HYUNDAI">현대택배</option>
                <option value="EPOST">우체국택배</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>배송비 종류</label>
              <select className={selectClass} value={deliveryChargeType} onChange={(e) => setDeliveryChargeType(e.target.value)}>
                <option value="FREE">무료</option>
                <option value="NOT_FREE">유료</option>
                <option value="CONDITIONAL_FREE">조건부 무료</option>
                <option value="CHARGE_RECEIVED">착불</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>기본배송비 (원)</label>
              <input type="number" className={inputClass} value={deliveryCharge} onChange={(e) => setDeliveryCharge(e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>무료배송 기준금액 (원)</label>
              <input type="number" className={inputClass} value={freeShipOverAmount} onChange={(e) => setFreeShipOverAmount(e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>반품배송비 (원)</label>
              <input type="number" className={inputClass} value={returnCharge} onChange={(e) => setReturnCharge(e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>도서산간 배송</label>
              <select className={selectClass} value={remoteAreaDeliverable} onChange={(e) => setRemoteAreaDeliverable(e.target.value)}>
                <option value="N">불가</option>
                <option value="Y">가능</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>묶음배송</label>
              <select className={selectClass} value={unionDeliveryType} onChange={(e) => setUnionDeliveryType(e.target.value)}>
                <option value="NOT_UNION_DELIVERY">불가</option>
                <option value="UNION_DELIVERY">가능</option>
              </select>
            </div>
          </div>
        </Section>

        {/* 4. 반품/출고지 */}
        <Section title="반품 / 출고지">
          <div className="mb-4">
            <button type="button" onClick={handleLookup} disabled={lookupLoading} className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-warm-600 text-white rounded-lg transition-colors flex items-center gap-2">
              {lookupLoading ? (
                <><span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />조회 중...</>
              ) : "쿠팡에서 반품지/출고지 불러오기"}
            </button>
          </div>

          {lookupData?.returnCenters?.data?.content && lookupData.returnCenters.data.content.length > 0 && (
            <div className="mb-4 p-4 bg-warm-700/50 rounded-xl space-y-2">
              <p className="text-sm font-medium text-green-400 mb-2">반품지 목록 (클릭하여 적용)</p>
              {lookupData.returnCenters.data.content.map((center: any, i: number) => (
                <button key={i} type="button" onClick={() => applyReturnCenter(center)} className="w-full text-left p-3 bg-warm-700 hover:bg-warm-600 rounded-lg transition-colors text-sm">
                  <span className="font-medium">{center.shippingPlaceName || center.returnChargeName || `반품지 ${i + 1}`}</span>
                  <span className="text-warm-400 ml-2">코드: {center.returnCenterCode}</span>
                </button>
              ))}
            </div>
          )}

          {(lookupData?.shippingPlaces?.content || lookupData?.shippingPlaces?.data?.content) &&
            (lookupData.shippingPlaces.content || lookupData.shippingPlaces.data?.content).length > 0 && (
            <div className="mb-4 p-4 bg-warm-700/50 rounded-xl space-y-2">
              <p className="text-sm font-medium text-green-400 mb-2">출고지 목록 (클릭하여 적용)</p>
              {(lookupData.shippingPlaces.content || lookupData.shippingPlaces.data.content).map((place: any, i: number) => (
                <button key={i} type="button" onClick={() => applyShippingPlace(place)} className="w-full text-left p-3 bg-warm-700 hover:bg-warm-600 rounded-lg transition-colors text-sm">
                  <span className="font-medium">{place.shippingPlaceName || `출고지 ${i + 1}`}</span>
                  <span className="text-warm-400 ml-2">코드: {place.outboundShippingPlaceCode}</span>
                </button>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>판매자 ID</label>
              <input className={inputClass} value={vendorId} onChange={(e) => setVendorId(e.target.value)} placeholder="Vendor ID" />
            </div>
            <div>
              <label className={labelClass}>판매자 User ID</label>
              <input className={inputClass} value={vendorUserId} onChange={(e) => setVendorUserId(e.target.value)} placeholder="Vendor User ID" />
            </div>
            <div>
              <label className={labelClass}>반품지 센터코드</label>
              <input className={inputClass} value={returnCenterCode} onChange={(e) => setReturnCenterCode(e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>반품지명</label>
              <input className={inputClass} value={returnChargeName} onChange={(e) => setReturnChargeName(e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>연락처</label>
              <input className={inputClass} value={companyContactNumber} onChange={(e) => setCompanyContactNumber(e.target.value)} placeholder="02-XXXX-XXXX" />
            </div>
            <div>
              <label className={labelClass}>반품지 우편번호</label>
              <input className={inputClass} value={returnZipCode} onChange={(e) => setReturnZipCode(e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>반품지 주소</label>
              <input className={inputClass} value={returnAddress} onChange={(e) => setReturnAddress(e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>반품지 상세주소</label>
              <input className={inputClass} value={returnAddressDetail} onChange={(e) => setReturnAddressDetail(e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>출고지 주소코드</label>
              <input className={inputClass} value={outboundShippingPlaceCode} onChange={(e) => setOutboundShippingPlaceCode(e.target.value)} />
            </div>
          </div>
        </Section>

        {/* 5. 이미지 */}
        <Section title="이미지">
          <div className="space-y-3">
            <div>
              <label className={labelClass}>대표이미지 URL *</label>
              <input className={inputClass} value={representImage} onChange={(e) => setRepresentImage(e.target.value)} placeholder="https://..." />
              {representImage && (
                <div className="mt-2 w-24 h-24 rounded-lg overflow-hidden bg-warm-700">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={representImage} alt="대표이미지" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
            <div>
              <label className={labelClass}>상세이미지 URL</label>
              {detailImages.map((url, idx) => (
                <div key={idx} className="flex gap-2 mb-2">
                  <input className={inputClass} value={url} onChange={(e) => updateDetailImage(idx, e.target.value)} placeholder="https://..." />
                  <button type="button" onClick={() => removeDetailImage(idx)} className="px-3 py-2 bg-red-900/50 hover:bg-red-800 text-red-300 rounded-lg text-sm shrink-0">삭제</button>
                </div>
              ))}
              <button type="button" onClick={addDetailImage} className="text-sm text-green-400 hover:text-green-300">+ 이미지 추가</button>
            </div>
          </div>
        </Section>

        {/* 6. 속성 */}
        <Section title="옵션 / 속성">
          <div className="space-y-2">
            {attributes.map((attr) => (
              <div key={attr.id} className="flex gap-2">
                <input className={inputClass} value={attr.attributeTypeName} onChange={(e) => updateAttribute(attr.id, "attributeTypeName", e.target.value)} placeholder="속성명 (예: 사이즈)" />
                <input className={inputClass} value={attr.attributeValueName} onChange={(e) => updateAttribute(attr.id, "attributeValueName", e.target.value)} placeholder="속성값 (예: 500ml)" />
                <button type="button" onClick={() => removeAttribute(attr.id)} className="px-3 py-2 bg-red-900/50 hover:bg-red-800 text-red-300 rounded-lg text-sm shrink-0">삭제</button>
              </div>
            ))}
            <button type="button" onClick={addAttribute} className="text-sm text-green-400 hover:text-green-300">+ 속성 추가</button>
          </div>
        </Section>

        {/* 7. 상품고시 */}
        <Section title="상품고시정보">
          <div className="space-y-2">
            {notices.map((notice) => (
              <div key={notice.id} className="flex gap-2">
                <input className={inputClass} value={notice.noticeCategoryName} onChange={(e) => updateNotice(notice.id, "noticeCategoryName", e.target.value)} placeholder="고시 카테고리" />
                <input className={inputClass} value={notice.noticeCategoryDetailName} onChange={(e) => updateNotice(notice.id, "noticeCategoryDetailName", e.target.value)} placeholder="고시 항목" />
                <input className={inputClass} value={notice.content} onChange={(e) => updateNotice(notice.id, "content", e.target.value)} placeholder="내용" />
                <button type="button" onClick={() => removeNotice(notice.id)} className="px-3 py-2 bg-red-900/50 hover:bg-red-800 text-red-300 rounded-lg text-sm shrink-0">삭제</button>
              </div>
            ))}
            <button type="button" onClick={addNotice} className="text-sm text-green-400 hover:text-green-300">+ 고시정보 추가</button>
          </div>
        </Section>

        {/* 8. 상세 컨텐츠 */}
        <Section title="상세 컨텐츠">
          <div className="space-y-3">
            {contents.map((c) => (
              <div key={c.id} className="space-y-2">
                <div className="flex gap-2">
                  <select className={selectClass + " !w-32"} value={c.contentType} onChange={(e) => updateContent(c.id, "contentType", e.target.value)}>
                    <option value="TEXT">텍스트/HTML</option>
                    <option value="IMAGE">이미지 URL</option>
                  </select>
                  <button type="button" onClick={() => removeContent(c.id)} className="px-3 py-2 bg-red-900/50 hover:bg-red-800 text-red-300 rounded-lg text-sm shrink-0">삭제</button>
                </div>
                {c.contentType === "TEXT" ? (
                  <textarea className={inputClass + " min-h-[120px]"} value={c.content} onChange={(e) => updateContent(c.id, "content", e.target.value)} placeholder="HTML 또는 텍스트 입력" />
                ) : (
                  <input className={inputClass} value={c.content} onChange={(e) => updateContent(c.id, "content", e.target.value)} placeholder="이미지 URL" />
                )}
              </div>
            ))}
            <button type="button" onClick={addContent} className="text-sm text-green-400 hover:text-green-300">+ 컨텐츠 추가</button>
          </div>

          {/* 미리보기 */}
          {contents.some((c) => c.content.trim()) && (
            <div className="mt-6 pt-6 border-t border-warm-600">
              <h3 className="text-sm font-medium text-warm-300 mb-3">미리보기</h3>
              <div className="bg-white rounded-lg p-4 overflow-auto max-h-[600px]">
                {contents
                  .filter((c) => c.content.trim())
                  .map((c) => (
                    <div key={c.id + "-preview"}>
                      {c.contentType === "IMAGE" ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={c.content}
                          alt="상세 이미지"
                          className="max-w-full h-auto"
                        />
                      ) : (
                        <div
                          dangerouslySetInnerHTML={{ __html: c.content }}
                          className="prose max-w-none"
                        />
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}
        </Section>

        {/* 9. 기타 설정 */}
        <Section title="기타 설정">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>과세여부</label>
              <select className={selectClass} value={taxType} onChange={(e) => setTaxType(e.target.value)}>
                <option value="TAX">과세</option>
                <option value="FREE">면세</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>19세 이상</label>
              <select className={selectClass} value={adultOnly} onChange={(e) => setAdultOnly(e.target.value)}>
                <option value="EVERYONE">전체</option>
                <option value="ADULT_ONLY">19세 이상</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>병행수입</label>
              <select className={selectClass} value={parallelImported} onChange={(e) => setParallelImported(e.target.value)}>
                <option value="NOT_PARALLEL_IMPORTED">아님</option>
                <option value="PARALLEL_IMPORTED">병행수입</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>해외구매대행</label>
              <select className={selectClass} value={overseasPurchased} onChange={(e) => setOverseasPurchased(e.target.value)}>
                <option value="NOT_OVERSEAS_PURCHASED">아님</option>
                <option value="OVERSEAS_PURCHASED">해외구매대행</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>A/S 정보</label>
              <input className={inputClass} value={afterServiceInfo} onChange={(e) => setAfterServiceInfo(e.target.value)} placeholder="A/S 안내 (기본: 판매자 문의)" />
            </div>
            <div>
              <label className={labelClass}>A/S 연락처</label>
              <input className={inputClass} value={afterServiceContact} onChange={(e) => setAfterServiceContact(e.target.value)} />
            </div>
          </div>
        </Section>

        {/* 결과 */}
        {result && (
          <div className={`p-4 rounded-xl text-sm ${
            result.success
              ? "bg-green-900/30 border border-green-800 text-green-300"
              : "bg-red-900/30 border border-red-800 text-red-300"
          }`}>
            <p>{result.message}</p>
          </div>
        )}

        {/* 제출 */}
        <div className="flex justify-end gap-3 pb-8">
          <button
            onClick={() => router.push("/admin?tab=products")}
            className="px-6 py-3 bg-warm-700 hover:bg-warm-600 rounded-lg transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="px-8 py-3 bg-orange-600 hover:bg-orange-700 disabled:bg-warm-600 text-white font-medium rounded-lg transition-colors"
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                수정 중...
              </span>
            ) : (
              "쿠팡에 수정"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-warm-800 rounded-2xl p-6">
      <h2 className="text-lg font-semibold mb-4 text-cream-100">{title}</h2>
      {children}
    </section>
  );
}
