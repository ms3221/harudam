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

export default function RegisterPageWrapper() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-warm-900 flex items-center justify-center text-cream-100">
          로딩 중...
        </div>
      }
    >
      <RegisterPage />
    </Suspense>
  );
}

function RegisterPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // 설정 상태
  const [configReady, setConfigReady] = useState<boolean | null>(true);
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
  const [unionDeliveryType, setUnionDeliveryType] =
    useState("NOT_UNION_DELIVERY");

  // 반품/출고지
  const [returnCenterCode, setReturnCenterCode] = useState("");
  const [returnChargeName, setReturnChargeName] = useState("");
  const [companyContactNumber, setCompanyContactNumber] = useState("");
  const [returnZipCode, setReturnZipCode] = useState("");
  const [returnAddress, setReturnAddress] = useState("");
  const [returnAddressDetail, setReturnAddressDetail] = useState("");
  const [outboundShippingPlaceCode, setOutboundShippingPlaceCode] =
    useState("");
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
  const [parallelImported, setParallelImported] = useState(
    "NOT_PARALLEL_IMPORTED",
  );
  const [overseasPurchased, setOverseasPurchased] = useState(
    "NOT_OVERSEAS_PURCHASED",
  );
  const [afterServiceInfo, setAfterServiceInfo] = useState("");
  const [afterServiceContact, setAfterServiceContact] = useState("");
  const [requested, setRequested] = useState(true);
  const [searchTags, setSearchTags] = useState<string[]>([]);

  // 드래프트 상태
  const [draftId, setDraftId] = useState<string | null>(null);
  const [draftStatus, setDraftStatus] = useState<string | null>(null);
  const [draftSaving, setDraftSaving] = useState(false);

  const [draftList, setDraftList] = useState<any[]>([]);
  const [showDraftList, setShowDraftList] = useState(false);

  // UI 상태
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    sellerProductId?: number;
  } | null>(null);
  const [healthChecking, setHealthChecking] = useState(false);
  const [healthResult, setHealthResult] = useState<{
    ok: boolean;
    message: string;
  } | null>(null);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [categoryResult, setCategoryResult] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const [lookupData, setLookupData] = useState<{
    returnCenters: any;
    shippingPlaces: any;
    errors?: { returnCenters?: string | null; shippingPlaces?: string | null };
  } | null>(null);

  // 설정 로드
  useEffect(() => {
    fetch("/api/admin/coupang/config")
      .then((r) => r.json())
      .then((data) => {
        setConfigReady(data.ready);
        if (data.defaults) {
          setDefaults(data.defaults);
          setVendorId(data.defaults.vendorId);
          setVendorUserId(data.defaults.vendorUserId);
          setReturnCenterCode(data.defaults.returnCenterCode);
          setReturnChargeName(data.defaults.returnChargeName);
          setCompanyContactNumber(data.defaults.companyContactNumber);
          setReturnZipCode(data.defaults.returnZipCode);
          setReturnAddress(data.defaults.returnAddress);
          setReturnAddressDetail(data.defaults.returnAddressDetail);
          setOutboundShippingPlaceCode(data.defaults.outboundShippingPlaceCode);
          setAfterServiceContact(data.defaults.companyContactNumber);
        }
      })
      .catch(() => setConfigReady(false));
  }, []);

  const restoreFormData = useCallback((data: any) => {
    if (data.sellerProductName) setSellerProductName(data.sellerProductName);
    if (data.displayProductName) setDisplayProductName(data.displayProductName);
    if (data.generalProductName) setGeneralProductName(data.generalProductName);
    if (data.brand) setBrand(data.brand);
    if (data.displayCategoryCode) setDisplayCategoryCode(data.displayCategoryCode);
    if (data.productGroup) setProductGroup(data.productGroup);
    if (data.originalPrice) setOriginalPrice(String(data.originalPrice));
    if (data.salePrice) setSalePrice(String(data.salePrice));
    if (data.maximumBuyCount) setMaximumBuyCount(String(data.maximumBuyCount));
    if (data.maximumBuyForPerson) setMaximumBuyForPerson(String(data.maximumBuyForPerson));
    if (data.outboundShippingTimeDay) setOutboundShippingTimeDay(String(data.outboundShippingTimeDay));
    if (data.deliveryMethod) setDeliveryMethod(data.deliveryMethod);
    if (data.deliveryCompanyCode) setDeliveryCompanyCode(data.deliveryCompanyCode);
    if (data.deliveryChargeType) setDeliveryChargeType(data.deliveryChargeType);
    if (data.deliveryCharge) setDeliveryCharge(String(data.deliveryCharge));
    if (data.freeShipOverAmount) setFreeShipOverAmount(String(data.freeShipOverAmount));
    if (data.returnCharge) setReturnCharge(String(data.returnCharge));
    if (data.remoteAreaDeliverable) setRemoteAreaDeliverable(data.remoteAreaDeliverable);
    if (data.unionDeliveryType) setUnionDeliveryType(data.unionDeliveryType);
    if (data.representImage) setRepresentImage(data.representImage);
    if (data.detailImages) setDetailImages(data.detailImages);
    if (data.attributes) setAttributes(data.attributes);
    if (data.notices) setNotices(data.notices);
    if (data.contents) setContents(data.contents);
    if (data.taxType) setTaxType(data.taxType);
    if (data.adultOnly) setAdultOnly(data.adultOnly === "GENERAL" ? "EVERYONE" : data.adultOnly);
    if (data.parallelImported) setParallelImported(data.parallelImported);
    if (data.overseasPurchased) setOverseasPurchased(data.overseasPurchased);
    if (data.afterServiceInfo) setAfterServiceInfo(data.afterServiceInfo);
    if (data.afterServiceContact) setAfterServiceContact(data.afterServiceContact);
    if (data.searchTags) {
      if (Array.isArray(data.searchTags)) {
        setSearchTags(data.searchTags);
      } else if (typeof data.searchTags === "string") {
        setSearchTags(data.searchTags.split(",").map((t: string) => t.trim()).filter(Boolean));
      }
    }
    if (data.requested !== undefined) setRequested(data.requested);
  }, []);

  const collectFormData = useCallback(() => {
    return {
      sellerProductName, displayProductName, brand, generalProductName,
      displayCategoryCode, productGroup, originalPrice, salePrice,
      maximumBuyCount, maximumBuyForPerson, outboundShippingTimeDay,
      deliveryMethod, deliveryCompanyCode, deliveryChargeType, deliveryCharge,
      freeShipOverAmount, returnCharge, remoteAreaDeliverable, unionDeliveryType,
      representImage, detailImages, attributes, notices, contents,
      taxType, adultOnly, parallelImported, overseasPurchased,
      afterServiceInfo, afterServiceContact, searchTags, requested,
    };
  }, [
    sellerProductName, displayProductName, brand, generalProductName,
    displayCategoryCode, productGroup, originalPrice, salePrice,
    maximumBuyCount, maximumBuyForPerson, outboundShippingTimeDay,
    deliveryMethod, deliveryCompanyCode, deliveryChargeType, deliveryCharge,
    freeShipOverAmount, returnCharge, remoteAreaDeliverable, unionDeliveryType,
    representImage, detailImages, attributes, notices, contents,
    taxType, adultOnly, parallelImported, overseasPurchased,
    afterServiceInfo, afterServiceContact, searchTags, requested,
  ]);

  // draftId로 드래프트 로드
  useEffect(() => {
    const draftIdParam = searchParams.get("draftId");
    if (draftIdParam) {
      setDraftId(draftIdParam);
      fetch(`/api/admin/drafts?id=${draftIdParam}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.status) setDraftStatus(data.status);
          if (data.form_data) restoreFormData(data.form_data);
        })
        .catch(() => {
          // 로드 실패 무시
        });
    }
  }, [searchParams, restoreFormData]);

  const fetchDraftList = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/drafts");
      if (res.ok) setDraftList(await res.json());
    } catch {
      // 무시
    }
  }, []);

  const handleSaveDraft = useCallback(async () => {
    setDraftSaving(true);
    try {
      const body: Record<string, unknown> = {
        product_name: sellerProductName || "임시저장",
        form_data: collectFormData(),
      };
      if (draftId) body.id = draftId;

      const res = await fetch("/api/admin/drafts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.id) {
        setDraftId(data.id);
        alert("임시저장되었습니다.");
      }
    } catch {
      alert("임시저장에 실패했습니다.");
    } finally {
      setDraftSaving(false);
    }
  }, [draftId, sellerProductName, collectFormData]);


  const handleLoadDraft = useCallback((draft: any) => {
    setDraftId(draft.id);
    if (draft.form_data) restoreFormData(draft.form_data);
    setShowDraftList(false);
  }, [restoreFormData]);

  const handleDeleteDraft = useCallback(async (id: string) => {
    if (!confirm("이 임시저장을 삭제하시겠습니까?")) return;
    try {
      await fetch("/api/admin/drafts", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      setDraftList((prev) => prev.filter((d) => d.id !== id));
      if (draftId === id) setDraftId(null);
    } catch {
      alert("삭제에 실패했습니다.");
    }
  }, [draftId]);

  // 카테고리 추천
  const handleCategoryPredict = useCallback(async () => {
    const name = sellerProductName || displayProductName || generalProductName;
    if (!name.trim()) {
      return alert("카테고리 추천을 위해 상품명을 먼저 입력하세요.");
    }
    setCategoryLoading(true);
    setCategoryResult(null);
    try {
      const res = await fetch("/api/admin/coupang/category", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName: name,
          brand: brand || undefined,
        }),
      });
      const data = await res.json();
      if (res.ok && data.data?.predictedCategoryId) {
        const predicted = data.data;
        setCategoryResult({
          id: predicted.predictedCategoryId,
          name: predicted.predictedCategoryName,
        });
        setDisplayCategoryCode(predicted.predictedCategoryId);
      } else {
        alert(data.error || data.data?.comment || "카테고리 추천 실패");
      }
    } catch {
      alert("카테고리 추천 요청 실패");
    } finally {
      setCategoryLoading(false);
    }
  }, [sellerProductName, displayProductName, generalProductName, brand]);

  // 카테고리 메타정보 불러오기 (고시정보, 옵션 자동 채움)
  const [metaLoading, setMetaLoading] = useState(false);
  const handleLoadMeta = useCallback(async () => {
    if (!displayCategoryCode.trim()) {
      return alert("카테고리 코드를 먼저 입력하세요.");
    }
    setMetaLoading(true);
    try {
      const res = await fetch(`/api/admin/coupang/meta?categoryCode=${displayCategoryCode}`);
      const data = await res.json();
      if (!res.ok) {
        return alert(data.error || "메타정보 조회 실패");
      }

      const meta = data.data || data;

      // 고시정보 자동 채움 (첫번째 카테고리 사용)
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

      // 옵션(attributes) 자동 채움
      if (meta.attributes?.length > 0) {
        const newAttrs = meta.attributes
          .filter((a: { required: string }) => a.required === "MANDATORY")
          .map((a: { attributeTypeName: string; basicUnit: string }) => ({
            id: crypto.randomUUID(),
            attributeTypeName: a.attributeTypeName,
            attributeValueName: "",
          }));
        if (newAttrs.length > 0) setAttributes(newAttrs);
      }

      alert("메타정보를 불러왔습니다. 고시정보와 옵션을 확인하세요.");
    } catch {
      alert("메타정보 조회 요청 실패");
    } finally {
      setMetaLoading(false);
    }
  }, [displayCategoryCode]);

  const handleLookup = useCallback(async () => {
    setLookupLoading(true);
    try {
      const res = await fetch("/api/admin/coupang/lookup");
      const data = await res.json();
      if (res.ok) {
        setLookupData(data);
      } else {
        alert(data.error || "조회 실패");
      }
    } catch {
      alert("조회 요청 실패");
    } finally {
      setLookupLoading(false);
    }
  }, []);


  const applyReturnCenter = (center: any) => {
    setReturnCenterCode(String(center.returnCenterCode || ""));
    setReturnChargeName(
      center.shippingPlaceName || center.returnChargeName || "",
    );
    setCompanyContactNumber(
      center.placeAddresses?.[0]?.companyContactNumber ||
        center.companyContactNumber ||
        "",
    );
    setReturnZipCode(
      center.placeAddresses?.[0]?.returnZipCode || center.returnZipCode || "",
    );
    setReturnAddress(
      center.placeAddresses?.[0]?.returnAddress || center.returnAddress || "",
    );
    setReturnAddressDetail(
      center.placeAddresses?.[0]?.returnAddressDetail ||
        center.returnAddressDetail ||
        "",
    );
  };


  const applyShippingPlace = (place: any) => {
    setOutboundShippingPlaceCode(String(place.outboundShippingPlaceCode || ""));
  };

  const handleHealthCheck = useCallback(async () => {
    setHealthChecking(true);
    setHealthResult(null);
    try {
      const res = await fetch("/api/admin/coupang/health");
      const data = await res.json();
      setHealthResult(data);
    } catch {
      setHealthResult({ ok: false, message: "요청 실패" });
    } finally {
      setHealthChecking(false);
    }
  }, []);

  const handleSubmit = async () => {
    // 기본 유효성 검사
    if (!sellerProductName.trim()) return alert("등록상품명을 입력하세요.");
    if (!displayCategoryCode.trim())
      return alert("카테고리 코드를 입력하세요.");
    if (!salePrice.trim()) return alert("판매가격을 입력하세요.");

    setSubmitting(true);
    setResult(null);

    const images = [
      {
        imageOrder: 0,
        imageType: "REPRESENTATION" as const,
        vendorPath: representImage,
      },
      ...detailImages
        .filter((url) => url.trim())
        .map((url, i) => ({
          imageOrder: i + 1,
          imageType: "DETAIL" as const,
          vendorPath: url,
        })),
    ];

    const now = new Date();
    const saleStartedAt = now.toISOString().slice(0, 19);
    const saleEndedAt = "2099-01-01T23:59:59";

    const requestBody = {
      draftId: draftId || undefined,
      displayCategoryCode: Number(displayCategoryCode),
      sellerProductName,
      vendorId,
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
      returnCenterCode,
      returnChargeName,
      companyContactNumber,
      returnZipCode,
      returnAddress,
      returnAddressDetail,
      returnCharge: Number(returnCharge),
      returnChargeVendor: "BUYER",
      afterServiceInformation: afterServiceInfo || "판매자 문의",
      afterServiceContactNumber: afterServiceContact,
      outboundShippingPlaceCode: Number(outboundShippingPlaceCode),
      vendorUserId,
      requested: false,
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
              noticeCategoryName,
              noticeCategoryDetailName,
              content,
            })),
          attributes: attributes
            .filter((a) => a.attributeTypeName && a.attributeValueName)
            .map(({ attributeTypeName, attributeValueName }) => ({
              attributeTypeName,
              attributeValueName,
            })),
          contents: contents
            .filter((c) => c.content.trim())
            .map(({ contentType, content }) => ({ contentType, content })),
          offerCondition: "NEW",
          offerDescription: "",
        },
      ],
    };

    try {
      const res = await fetch("/api/admin/coupang/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });
      const data = await res.json();
      if (res.ok) {
        const spId = data.sellerProductId || (typeof data.data === "number" ? data.data : data.data?.sellerProductId);
        let msg = `상품 등록 성공! (sellerProductId: ${spId})`;
        if (data.warningMessage) {
          msg += `\n\n⚠️ 경고: ${data.warningMessage}`;
        }
        setResult({
          success: true,
          message: msg,
          sellerProductId: spId,
        });
        setDraftStatus("registered");
        // 드래프트 상태를 registered로 업데이트
        if (draftId) {
          fetch("/api/admin/drafts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: draftId,
              product_name: sellerProductName,
              form_data: collectFormData(),
              status: "registered",
            }),
          }).catch(() => {});
        }
      } else {
        setResult({ success: false, message: data.error || "등록 실패" });
        // 드래프트 상태를 failed로 업데이트
        if (draftId) {
          fetch("/api/admin/drafts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: draftId,
              product_name: sellerProductName,
              form_data: collectFormData(),
              status: "failed",
            }),
          }).catch(() => {});
        }
      }
    } catch (error) {
      setResult({
        success: false,
        message: error instanceof Error ? error.message : "요청 실패",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleApprove = async (sellerProductId: number) => {
    try {
      const res = await fetch("/api/admin/coupang/approve", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sellerProductId, draftId }),
      });
      const data = await res.json();
      if (res.ok) {
        setDraftStatus("approved");
        alert("승인 요청이 완료되었습니다.");
      } else {
        alert(`승인 실패: ${data.error}`);
      }
    } catch {
      alert("승인 요청에 실패했습니다.");
    }
  };

  const addAttribute = () =>
    setAttributes((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        attributeTypeName: "",
        attributeValueName: "",
      },
    ]);

  const removeAttribute = (id: string) =>
    setAttributes((prev) => prev.filter((a) => a.id !== id));

  const updateAttribute = (
    id: string,
    field: keyof AttributeRow,
    value: string,
  ) =>
    setAttributes((prev) =>
      prev.map((a) => (a.id === id ? { ...a, [field]: value } : a)),
    );

  const addNotice = () =>
    setNotices((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        noticeCategoryName: "",
        noticeCategoryDetailName: "",
        content: "",
      },
    ]);

  const removeNotice = (id: string) =>
    setNotices((prev) => prev.filter((n) => n.id !== id));

  const updateNotice = (id: string, field: keyof NoticeRow, value: string) =>
    setNotices((prev) =>
      prev.map((n) => (n.id === id ? { ...n, [field]: value } : n)),
    );

  const addContent = () =>
    setContents((prev) => [
      ...prev,
      { id: crypto.randomUUID(), contentType: "TEXT", content: "" },
    ]);

  const removeContent = (id: string) =>
    setContents((prev) => prev.filter((c) => c.id !== id));

  const updateContent = (id: string, field: keyof ContentRow, value: string) =>
    setContents((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: value } : c)),
    );

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
            <h1 className="text-xl font-bold text-green-400">쿠팡 상품 등록</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => { fetchDraftList(); setShowDraftList(!showDraftList); }}
              className="px-4 py-2 text-sm bg-warm-700 hover:bg-warm-600 border border-warm-600 rounded-lg transition-colors"
            >
              임시저장 불러오기
            </button>
            <button
              onClick={handleSaveDraft}
              disabled={draftSaving}
              className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-warm-600 text-white rounded-lg transition-colors"
            >
              {draftSaving ? "저장 중..." : "임시저장"}
            </button>
            <button
              onClick={handleHealthCheck}
              disabled={healthChecking}
              className="px-4 py-2 text-sm bg-warm-700 hover:bg-warm-600 border border-warm-600 rounded-lg transition-colors flex items-center gap-2"
            >
              {healthChecking ? (
                <>
                  <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  확인 중...
                </>
              ) : (
                "API 인증 테스트"
              )}
            </button>
            {healthResult && (
              <span
                className={`text-xs px-2 py-1 rounded ${
                  healthResult.ok
                    ? "bg-green-900/50 text-green-300 border border-green-800"
                    : "bg-red-900/50 text-red-300 border border-red-800"
                }`}
              >
                {healthResult.ok ? "OK" : "FAIL"}
              </span>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* 드래프트 목록 패널 */}
        {showDraftList && (
          <section className="bg-warm-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">임시저장 목록</h2>
              <button
                onClick={() => setShowDraftList(false)}
                className="text-warm-400 hover:text-cream-100 text-sm"
              >
                닫기
              </button>
            </div>
            {draftList.length === 0 ? (
              <p className="text-warm-500 text-center py-6 text-sm">임시저장된 항목이 없습니다.</p>
            ) : (
              <div className="space-y-2">
                {draftList.map((draft) => (
                  <div
                    key={draft.id}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      draftId === draft.id
                        ? "bg-blue-900/30 border border-blue-800"
                        : "bg-warm-700/50 hover:bg-warm-700"
                    } transition-colors`}
                  >
                    <div
                      className="flex-1 cursor-pointer"
                      onClick={() => handleLoadDraft(draft)}
                    >
                      <p className="text-sm font-medium">{draft.product_name || "제목 없음"}</p>
                      <p className="text-warm-400 text-xs mt-0.5">
                        {new Date(draft.updated_at).toLocaleString("ko-KR")}
                        {draft.status !== "draft" && (
                          <span className={`ml-2 ${draft.status === "registered" ? "text-green-400" : "text-red-400"}`}>
                            ({draft.status})
                          </span>
                        )}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteDraft(draft.id)}
                      className="ml-2 px-3 py-1 text-xs bg-red-900/50 hover:bg-red-800 text-red-300 rounded-lg transition-colors"
                    >
                      삭제
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* draftId 표시 */}
        {draftId && (
          <div className="px-4 py-2 bg-blue-900/20 border border-blue-800/50 rounded-lg text-blue-300 text-xs">
            임시저장 ID: {draftId}
          </div>
        )}

        {/* 설정 상태 배너 */}
        {configReady === false && (
          <div className="p-4 bg-red-900/30 border border-red-800 rounded-xl text-red-300 text-sm">
            쿠팡 API 키가 설정되지 않았습니다. <code>.env.local</code>에{" "}
            <code>COUPANG_ACCESS_KEY</code>, <code>COUPANG_SECRET_KEY</code>{" "}
            등을 설정하세요.
          </div>
        )}

        {/* 헬스체크 결과 상세 */}
        {healthResult && !healthResult.ok && (
          <div className="p-4 bg-red-900/30 border border-red-800 rounded-xl text-red-300 text-sm">
            {healthResult.message}
          </div>
        )}
        {healthResult && healthResult.ok && (
          <div className="p-4 bg-green-900/30 border border-green-800 rounded-xl text-green-300 text-sm">
            {healthResult.message} - API 연동이 정상적으로 동작합니다.
          </div>
        )}

        {/* 1. 기본 정보 */}
        <Section title="기본 정보">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>등록상품명 *</label>
              <input
                className={inputClass}
                value={sellerProductName}
                onChange={(e) => setSellerProductName(e.target.value)}
                placeholder="쿠팡에 등록될 상품명"
              />
            </div>
            <div>
              <label className={labelClass}>노출상품명</label>
              <input
                className={inputClass}
                value={displayProductName}
                onChange={(e) => setDisplayProductName(e.target.value)}
                placeholder="고객에게 노출될 이름"
              />
            </div>
            <div>
              <label className={labelClass}>브랜드</label>
              <input
                className={inputClass}
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="브랜드명"
              />
            </div>
            <div>
              <label className={labelClass}>제품명</label>
              <input
                className={inputClass}
                value={generalProductName}
                onChange={(e) => setGeneralProductName(e.target.value)}
                placeholder="일반 제품명"
              />
            </div>
            <div>
              <label className={labelClass}>카테고리 코드 *</label>
              <div className="flex gap-2">
                <input
                  className={inputClass + " flex-1"}
                  value={displayCategoryCode}
                  onChange={(e) => setDisplayCategoryCode(e.target.value)}
                  placeholder="쿠팡 카테고리 코드 (숫자)"
                />
                <button
                  type="button"
                  onClick={handleCategoryPredict}
                  disabled={categoryLoading}
                  className="px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 whitespace-nowrap"
                >
                  {categoryLoading ? "추천중..." : "AI 추천"}
                </button>
                <button
                  type="button"
                  onClick={handleLoadMeta}
                  disabled={metaLoading || !displayCategoryCode.trim()}
                  className="px-3 py-2 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 disabled:opacity-50 whitespace-nowrap"
                >
                  {metaLoading ? "조회중..." : "메타 불러오기"}
                </button>
              </div>
              {categoryResult && (
                <p className="mt-1 text-sm text-green-400">
                  추천: {categoryResult.name} ({categoryResult.id})
                </p>
              )}
            </div>
            <div>
              <label className={labelClass}>상품그룹</label>
              <input
                className={inputClass}
                value={productGroup}
                onChange={(e) => setProductGroup(e.target.value)}
                placeholder="상품그룹 (선택)"
              />
            </div>
          </div>
        </Section>

        {/* 2. 가격/재고 */}
        <Section title="가격 / 재고">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>할인율기준가 (원가)</label>
              <input
                type="number"
                className={inputClass}
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                placeholder="정가"
              />
            </div>
            <div>
              <label className={labelClass}>판매가격 *</label>
              <input
                type="number"
                className={inputClass}
                value={salePrice}
                onChange={(e) => setSalePrice(e.target.value)}
                placeholder="실제 판매가"
              />
            </div>
            <div>
              <label className={labelClass}>판매가능수량</label>
              <input
                type="number"
                className={inputClass}
                value={maximumBuyCount}
                onChange={(e) => setMaximumBuyCount(e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>
                인당 최대 구매 수량 (0=무제한)
              </label>
              <input
                type="number"
                className={inputClass}
                value={maximumBuyForPerson}
                onChange={(e) => setMaximumBuyForPerson(e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>출고 소요일</label>
              <input
                type="number"
                className={inputClass}
                value={outboundShippingTimeDay}
                onChange={(e) => setOutboundShippingTimeDay(e.target.value)}
              />
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
              <select
                className={selectClass}
                value={deliveryMethod}
                onChange={(e) => setDeliveryMethod(e.target.value)}
              >
                <option value="SEQUENCIAL">순차배송</option>
                <option value="COLD_FRESH">냉장/냉동</option>
                <option value="MAKE_ORDER">주문제작</option>
                <option value="AGENT_BUY">구매대행</option>
                <option value="VENDOR_DIRECT">업체직송</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>택배사</label>
              <select
                className={selectClass}
                value={deliveryCompanyCode}
                onChange={(e) => setDeliveryCompanyCode(e.target.value)}
              >
                <option value="KGB">로젠택배</option>
                <option value="CJGLS">CJ대한통운</option>
                <option value="HANJIN">한진택배</option>
                <option value="HYUNDAI">현대택배</option>
                <option value="EPOST">우체국택배</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>배송비 종류</label>
              <select
                className={selectClass}
                value={deliveryChargeType}
                onChange={(e) => setDeliveryChargeType(e.target.value)}
              >
                <option value="FREE">무료</option>
                <option value="NOT_FREE">유료</option>
                <option value="CONDITIONAL_FREE">조건부 무료</option>
                <option value="CHARGE_RECEIVED">착불</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>기본배송비 (원)</label>
              <input
                type="number"
                className={inputClass}
                value={deliveryCharge}
                onChange={(e) => setDeliveryCharge(e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>무료배송 기준금액 (원)</label>
              <input
                type="number"
                className={inputClass}
                value={freeShipOverAmount}
                onChange={(e) => setFreeShipOverAmount(e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>반품배송비 (원)</label>
              <input
                type="number"
                className={inputClass}
                value={returnCharge}
                onChange={(e) => setReturnCharge(e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>도서산간 배송</label>
              <select
                className={selectClass}
                value={remoteAreaDeliverable}
                onChange={(e) => setRemoteAreaDeliverable(e.target.value)}
              >
                <option value="N">불가</option>
                <option value="Y">가능</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>묶음배송</label>
              <select
                className={selectClass}
                value={unionDeliveryType}
                onChange={(e) => setUnionDeliveryType(e.target.value)}
              >
                <option value="NOT_UNION_DELIVERY">불가</option>
                <option value="UNION_DELIVERY">가능</option>
              </select>
            </div>
          </div>
        </Section>

        {/* 4. 반품/출고지 */}
        <Section title="반품 / 출고지">
          <div className="mb-4">
            <button
              type="button"
              onClick={handleLookup}
              disabled={lookupLoading}
              className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-warm-600 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              {lookupLoading ? (
                <>
                  <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  조회 중...
                </>
              ) : (
                "쿠팡에서 반품지/출고지 불러오기"
              )}
            </button>
          </div>

          {/* 조회 결과 - 반품지 선택 */}
          {lookupData?.returnCenters?.data?.content &&
            lookupData.returnCenters.data.content.length > 0 && (
              <div className="mb-4 p-4 bg-warm-700/50 rounded-xl space-y-2">
                <p className="text-sm font-medium text-green-400 mb-2">
                  반품지 목록 (클릭하여 적용)
                </p>
                {lookupData.returnCenters.data.content.map(
                  (center: any, i: number) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => applyReturnCenter(center)}
                      className="w-full text-left p-3 bg-warm-700 hover:bg-warm-600 rounded-lg transition-colors text-sm"
                    >
                      <span className="font-medium">
                        {center.shippingPlaceName ||
                          center.returnChargeName ||
                          `반품지 ${i + 1}`}
                      </span>
                      <span className="text-warm-400 ml-2">
                        코드: {center.returnCenterCode}
                      </span>
                      {center.placeAddresses?.[0]?.returnAddress && (
                        <span className="text-warm-400 ml-2">
                          {center.placeAddresses[0].returnAddress}
                        </span>
                      )}
                    </button>
                  ),
                )}
              </div>
            )}

          {/* 조회 결과 - 출고지 선택 */}
          {(lookupData?.shippingPlaces?.content || lookupData?.shippingPlaces?.data?.content) &&
            (lookupData.shippingPlaces.content || lookupData.shippingPlaces.data?.content).length > 0 && (
              <div className="mb-4 p-4 bg-warm-700/50 rounded-xl space-y-2">
                <p className="text-sm font-medium text-green-400 mb-2">
                  출고지 목록 (클릭하여 적용)
                </p>
                {(lookupData.shippingPlaces.content || lookupData.shippingPlaces.data.content).map(
                  (place: any, i: number) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => applyShippingPlace(place)}
                      className="w-full text-left p-3 bg-warm-700 hover:bg-warm-600 rounded-lg transition-colors text-sm"
                    >
                      <span className="font-medium">
                        {place.shippingPlaceName || `출고지 ${i + 1}`}
                      </span>
                      <span className="text-warm-400 ml-2">
                        코드: {place.outboundShippingPlaceCode}
                      </span>
                      {place.placeAddresses?.[0]?.returnAddress && (
                        <span className="text-warm-400 ml-2">
                          {place.placeAddresses[0].returnAddress}
                        </span>
                      )}
                    </button>
                  ),
                )}
              </div>
            )}

          {/* 조회 결과 없음 */}
          {lookupData &&
            !lookupData.returnCenters?.data?.content?.length &&
            !(lookupData.shippingPlaces?.content?.length || lookupData.shippingPlaces?.data?.content?.length) && (
              <div className="mb-4 p-3 bg-yellow-900/30 border border-yellow-800 rounded-lg text-yellow-300 text-sm">
                등록된 반품지/출고지가 없습니다. 쿠팡 WING에서 먼저
                등록해주세요.
              </div>
            )}

          {/* 조회 에러 */}
          {lookupData?.errors?.returnCenters && (
            <div className="mb-4 p-3 bg-red-900/30 border border-red-800 rounded-lg text-red-300 text-sm">
              반품지 조회 실패: {lookupData.errors.returnCenters}
            </div>
          )}
          {lookupData?.errors?.shippingPlaces && (
            <div className="mb-4 p-3 bg-red-900/30 border border-red-800 rounded-lg text-red-300 text-sm">
              출고지 조회 실패: {lookupData.errors.shippingPlaces}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>판매자 ID</label>
              <input
                className={inputClass}
                value={vendorId}
                onChange={(e) => setVendorId(e.target.value)}
                placeholder="Vendor ID"
              />
            </div>
            <div>
              <label className={labelClass}>판매자 User ID</label>
              <input
                className={inputClass}
                value={vendorUserId}
                onChange={(e) => setVendorUserId(e.target.value)}
                placeholder="Vendor User ID"
              />
            </div>
            <div>
              <label className={labelClass}>반품지 센터코드</label>
              <input
                className={inputClass}
                value={returnCenterCode}
                onChange={(e) => setReturnCenterCode(e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>반품지명</label>
              <input
                className={inputClass}
                value={returnChargeName}
                onChange={(e) => setReturnChargeName(e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>연락처</label>
              <input
                className={inputClass}
                value={companyContactNumber}
                onChange={(e) => setCompanyContactNumber(e.target.value)}
                placeholder="02-XXXX-XXXX"
              />
            </div>
            <div>
              <label className={labelClass}>반품지 우편번호</label>
              <input
                className={inputClass}
                value={returnZipCode}
                onChange={(e) => setReturnZipCode(e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>반품지 주소</label>
              <input
                className={inputClass}
                value={returnAddress}
                onChange={(e) => setReturnAddress(e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>반품지 상세주소</label>
              <input
                className={inputClass}
                value={returnAddressDetail}
                onChange={(e) => setReturnAddressDetail(e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>출고지 주소코드</label>
              <input
                className={inputClass}
                value={outboundShippingPlaceCode}
                onChange={(e) => setOutboundShippingPlaceCode(e.target.value)}
              />
            </div>
          </div>
        </Section>

        {/* 5. 이미지 */}
        <Section title="이미지">
          <div className="space-y-3">
            <div>
              <label className={labelClass}>대표이미지 URL *</label>
              <input
                className={inputClass}
                value={representImage}
                onChange={(e) => setRepresentImage(e.target.value)}
                placeholder="https://..."
              />
              {representImage && (
                <div className="mt-2 w-24 h-24 rounded-lg overflow-hidden bg-warm-700">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={representImage}
                    alt="대표이미지"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
            <div>
              <label className={labelClass}>상세이미지 URL</label>
              {detailImages.map((url, idx) => (
                <div key={idx} className="flex gap-2 mb-2">
                  <input
                    className={inputClass}
                    value={url}
                    onChange={(e) => updateDetailImage(idx, e.target.value)}
                    placeholder="https://..."
                  />
                  <button
                    type="button"
                    onClick={() => removeDetailImage(idx)}
                    className="px-3 py-2 bg-red-900/50 hover:bg-red-800 text-red-300 rounded-lg text-sm shrink-0"
                  >
                    삭제
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addDetailImage}
                className="text-sm text-green-400 hover:text-green-300"
              >
                + 이미지 추가
              </button>
            </div>
          </div>
        </Section>

        {/* 6. 속성 */}
        <Section title="옵션 / 속성">
          <div className="space-y-2">
            {attributes.map((attr) => (
              <div key={attr.id} className="flex gap-2">
                <input
                  className={inputClass}
                  value={attr.attributeTypeName}
                  onChange={(e) =>
                    updateAttribute(
                      attr.id,
                      "attributeTypeName",
                      e.target.value,
                    )
                  }
                  placeholder="속성명 (예: 사이즈)"
                />
                <input
                  className={inputClass}
                  value={attr.attributeValueName}
                  onChange={(e) =>
                    updateAttribute(
                      attr.id,
                      "attributeValueName",
                      e.target.value,
                    )
                  }
                  placeholder="속성값 (예: 500ml)"
                />
                <button
                  type="button"
                  onClick={() => removeAttribute(attr.id)}
                  className="px-3 py-2 bg-red-900/50 hover:bg-red-800 text-red-300 rounded-lg text-sm shrink-0"
                >
                  삭제
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addAttribute}
              className="text-sm text-green-400 hover:text-green-300"
            >
              + 속성 추가
            </button>
          </div>
        </Section>

        {/* 7. 상품고시 */}
        <Section title="상품고시정보">
          <div className="space-y-2">
            {notices.map((notice) => (
              <div key={notice.id} className="flex gap-2">
                <input
                  className={inputClass}
                  value={notice.noticeCategoryName}
                  onChange={(e) =>
                    updateNotice(
                      notice.id,
                      "noticeCategoryName",
                      e.target.value,
                    )
                  }
                  placeholder="고시 카테고리"
                />
                <input
                  className={inputClass}
                  value={notice.noticeCategoryDetailName}
                  onChange={(e) =>
                    updateNotice(
                      notice.id,
                      "noticeCategoryDetailName",
                      e.target.value,
                    )
                  }
                  placeholder="고시 항목"
                />
                <input
                  className={inputClass}
                  value={notice.content}
                  onChange={(e) =>
                    updateNotice(notice.id, "content", e.target.value)
                  }
                  placeholder="내용"
                />
                <button
                  type="button"
                  onClick={() => removeNotice(notice.id)}
                  className="px-3 py-2 bg-red-900/50 hover:bg-red-800 text-red-300 rounded-lg text-sm shrink-0"
                >
                  삭제
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addNotice}
              className="text-sm text-green-400 hover:text-green-300"
            >
              + 고시정보 추가
            </button>
          </div>
        </Section>

        {/* 8. 상세 컨텐츠 */}
        <Section title="상세 컨텐츠">
          <div className="space-y-3">
            {contents.map((c) => (
              <div key={c.id} className="space-y-2">
                <div className="flex gap-2">
                  <select
                    className={selectClass + " !w-32"}
                    value={c.contentType}
                    onChange={(e) =>
                      updateContent(c.id, "contentType", e.target.value)
                    }
                  >
                    <option value="TEXT">텍스트/HTML</option>
                    <option value="IMAGE">이미지 URL</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => removeContent(c.id)}
                    className="px-3 py-2 bg-red-900/50 hover:bg-red-800 text-red-300 rounded-lg text-sm shrink-0"
                  >
                    삭제
                  </button>
                </div>
                {c.contentType === "TEXT" ? (
                  <textarea
                    className={inputClass + " min-h-[120px]"}
                    value={c.content}
                    onChange={(e) =>
                      updateContent(c.id, "content", e.target.value)
                    }
                    placeholder="HTML 또는 텍스트 입력"
                  />
                ) : (
                  <input
                    className={inputClass}
                    value={c.content}
                    onChange={(e) =>
                      updateContent(c.id, "content", e.target.value)
                    }
                    placeholder="이미지 URL"
                  />
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addContent}
              className="text-sm text-green-400 hover:text-green-300"
            >
              + 컨텐츠 추가
            </button>
          </div>
        </Section>

        {/* 9. 기타 설정 */}
        <Section title="기타 설정">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>과세여부</label>
              <select
                className={selectClass}
                value={taxType}
                onChange={(e) => setTaxType(e.target.value)}
              >
                <option value="TAX">과세</option>
                <option value="FREE">면세</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>19세 이상</label>
              <select
                className={selectClass}
                value={adultOnly}
                onChange={(e) => setAdultOnly(e.target.value)}
              >
                <option value="EVERYONE">전체</option>
                <option value="ADULT_ONLY">19세 이상</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>병행수입</label>
              <select
                className={selectClass}
                value={parallelImported}
                onChange={(e) => setParallelImported(e.target.value)}
              >
                <option value="NOT_PARALLEL_IMPORTED">아님</option>
                <option value="PARALLEL_IMPORTED">병행수입</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>해외구매대행</label>
              <select
                className={selectClass}
                value={overseasPurchased}
                onChange={(e) => setOverseasPurchased(e.target.value)}
              >
                <option value="NOT_OVERSEAS_PURCHASED">아님</option>
                <option value="OVERSEAS_PURCHASED">해외구매대행</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>A/S 정보</label>
              <input
                className={inputClass}
                value={afterServiceInfo}
                onChange={(e) => setAfterServiceInfo(e.target.value)}
                placeholder="A/S 안내 (기본: 판매자 문의)"
              />
            </div>
            <div>
              <label className={labelClass}>A/S 연락처</label>
              <input
                className={inputClass}
                value={afterServiceContact}
                onChange={(e) => setAfterServiceContact(e.target.value)}
              />
            </div>
          </div>
        </Section>

        {/* 결과 */}
        {result && (
          <div
            className={`p-4 rounded-xl text-sm ${
              result.success
                ? "bg-green-900/30 border border-green-800 text-green-300"
                : "bg-red-900/30 border border-red-800 text-red-300"
            }`}
          >
            <p className="whitespace-pre-line">{result.message}</p>
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
            onClick={handleSaveDraft}
            disabled={draftSaving}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-warm-600 text-white font-medium rounded-lg transition-colors"
          >
            {draftSaving ? "저장 중..." : "임시저장"}
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting || configReady === false || draftStatus === "registered" || draftStatus === "approved"}
            className="px-8 py-3 bg-green-600 hover:bg-green-700 disabled:bg-warm-600 text-white font-medium rounded-lg transition-colors"
          >
            {draftStatus === "approved" ? (
              "등록 및 승인완료"
            ) : draftStatus === "registered" ? (
              "등록완료"
            ) : submitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                등록 중...
              </span>
            ) : (
              "쿠팡에 등록"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-warm-800 rounded-2xl p-6">
      <h2 className="text-lg font-semibold mb-4 text-cream-100">{title}</h2>
      {children}
    </section>
  );
}
