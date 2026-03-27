"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { HotProduct, CrawlSnapshot } from "@/lib/crawler";

interface DraftRegistration {
  id: string;
  product_code: string | null;
  product_name: string;
  form_data: Record<string, unknown>;
  status: "draft" | "registered" | "approved" | "failed";
  coupang_product_id: string | null;
  coupang_status: string | null;
  created_at: string;
  updated_at: string;
}

interface RegisteredProduct {
  id: string;
  draft_id: string | null;
  seller_product_id: number;
  product_name: string;
  sale_price: number | null;
  status: "registered" | "approved" | "rejected" | "deleted";
  coupang_status: string | null;
  registered_at: string;
  updated_at: string;
}

export default function AdminPageWrapper() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-warm-900 flex items-center justify-center text-cream-100">로딩 중...</div>}>
      <AdminPage />
    </Suspense>
  );
}

function AdminPage() {
  const [snapshots, setSnapshots] = useState<CrawlSnapshot[]>([]);
  const [preview, setPreview] = useState<CrawlSnapshot | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [selectedSnapshot, setSelectedSnapshot] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const [activeTab, setActiveTabState] = useState<"crawl" | "products">(
    tabParam === "products" ? "products" : "crawl"
  );
  const setActiveTab = (tab: "crawl" | "products") => {
    setActiveTabState(tab);
    router.replace(`/admin?tab=${tab}`, { scroll: false });
  };
  const [drafts, setDrafts] = useState<DraftRegistration[]>([]);
  const [registeredProducts, setRegisteredProducts] = useState<RegisteredProduct[]>([]);
  const [draftsLoading, setDraftsLoading] = useState(false);
  const [productsLoading, setProductsLoading] = useState(false);
  const router = useRouter();

  const fetchSnapshots = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/products");
      if (res.ok) setSnapshots(await res.json());
    } catch {
      // 무시
    }
  }, []);

  const fetchDrafts = useCallback(async () => {
    setDraftsLoading(true);
    try {
      const res = await fetch("/api/admin/drafts");
      if (res.ok) setDrafts(await res.json());
    } catch {
      // 무시
    } finally {
      setDraftsLoading(false);
    }
  }, []);

  const fetchRegisteredProducts = useCallback(async () => {
    setProductsLoading(true);
    try {
      const res = await fetch("/api/admin/coupang/products");
      if (res.ok) setRegisteredProducts(await res.json());
    } catch {
      // 무시
    } finally {
      setProductsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSnapshots();
  }, [fetchSnapshots]);

  useEffect(() => {
    fetchDrafts();
    fetchRegisteredProducts();
  }, [fetchDrafts, fetchRegisteredProducts]);

  const handleCrawl = async () => {
    setError("");
    setMessage("");
    setPreview(null);
    setLoading(true);

    try {
      const res = await fetch("/api/admin/crawl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "hot6" }),
      });

      const data = await res.json();
      if (res.ok) {
        setPreview(data);
      } else {
        setError(data.error);
      }
    } catch {
      setError("크롤링 요청에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!preview) return;
    setLoading(true);

    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(preview),
      });

      if (res.ok) {
        setMessage("저장되었습니다.");
        setPreview(null);
        fetchSnapshots();
      }
    } catch {
      setError("저장에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("이 스냅샷을 삭제하시겠습니까?")) return;

    try {
      await fetch("/api/admin/products", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      setMessage("삭제되었습니다.");
      if (selectedSnapshot === id) setSelectedSnapshot(null);
      fetchSnapshots();
    } catch {
      setError("삭제에 실패했습니다.");
    }
  };

  const handleDeleteDraft = async (id: string) => {
    if (!confirm("이 임시저장을 삭제하시겠습니까?")) return;
    try {
      await fetch("/api/admin/drafts", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      setDrafts((prev) => prev.filter((d) => d.id !== id));
    } catch {
      setError("삭제에 실패했습니다.");
    }
  };

  const handleApprove = async (registeredProduct: RegisteredProduct) => {
    startLoading(registeredProduct.id);
    try {
      const res = await fetch("/api/admin/coupang/approve", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sellerProductId: registeredProduct.seller_product_id }),
      });
      const data = await res.json();
      if (res.ok) {
        const newStatus = data.reapproved ? "registered" as const : "approved" as const;
        const newCoupangStatus = data.reapproved ? "심사중" : "승인완료";
        setRegisteredProducts((prev) =>
          prev.map((p) =>
            p.id === registeredProduct.id
              ? { ...p, status: newStatus, coupang_status: newCoupangStatus }
              : p
          )
        );
        setMessage(
          data.reapproved
            ? "승인반려 상품을 수정 후 재승인 요청했습니다."
            : data.alreadyApproved
            ? "이미 쿠팡에서 승인된 상품입니다. 상태를 동기화했습니다."
            : "승인 요청이 완료되었습니다."
        );
      } else {
        setError(`승인 실패: ${data.error}`);
      }
    } catch {
      setError("승인 요청에 실패했습니다.");
    } finally {
      stopLoading(registeredProduct.id);
    }
  };

  const [syncing, setSyncing] = useState(false);

  const handleSyncAll = async () => {
    const targets = registeredProducts.filter((p) => p.seller_product_id);
    if (targets.length === 0) {
      setError("동기화할 상품이 없습니다.");
      return;
    }
    setSyncing(true);
    setError("");
    setMessage("");
    try {
      await Promise.all(
        targets.map((p) =>
          fetch(
            `/api/admin/coupang/product?sellerProductId=${p.seller_product_id}&registeredProductId=${p.id}`
          )
        )
      );
      await fetchRegisteredProducts();
      setMessage(`${targets.length}개 상품의 상태를 동기화했습니다.`);
    } catch {
      setError("상태 동기화에 실패했습니다.");
    } finally {
      setSyncing(false);
    }
  };

  // 개별 항목 로딩 상태
  const [loadingItems, setLoadingItems] = useState<Set<string>>(new Set());
  const startLoading = (id: string) => setLoadingItems((prev) => new Set(prev).add(id));
  const stopLoading = (id: string) => setLoadingItems((prev) => { const next = new Set(prev); next.delete(id); return next; });

  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin/login");
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const activeSnapshot = selectedSnapshot
    ? snapshots.find((s) => s.id === selectedSnapshot)
    : null;

  // 크롤링 탭에서 이미 등록된 상품 코드 (drafts + registered 모두 확인)
  const registeredProductCodes = drafts
    .filter((d) => (d.status === "registered" || d.status === "approved") && d.product_code)
    .map((d) => d.product_code as string);

  // 임시저장만 필터 (아직 등록 안 된 것)
  const draftOnly = drafts.filter((d) => d.status === "draft");

  // 상태별 카운트 (registered_products 기반)
  const statusCounts = {
    draft: draftOnly.length,
    registered: registeredProducts.filter((p) => p.status === "registered").length,
    approved: registeredProducts.filter((p) => p.status === "approved").length,
    rejected: registeredProducts.filter((p) => p.status === "rejected").length,
  };

  return (
    <div className="min-h-screen bg-warm-900 text-cream-100">
      {/* 헤더 */}
      <header className="sticky top-0 z-10 bg-warm-800/95 backdrop-blur border-b border-warm-700">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-green-400">하루담 Admin</h1>
          <button
            onClick={handleLogout}
            className="text-sm text-warm-400 hover:text-cream-100 transition-colors"
          >
            로그아웃
          </button>
        </div>
        {/* 탭 바 */}
        <div className="max-w-6xl mx-auto px-4 flex gap-1">
          {(["crawl", "products"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 text-sm font-medium rounded-t-lg transition-colors ${
                activeTab === tab
                  ? "bg-warm-900 text-cream-100"
                  : "text-warm-400 hover:text-cream-200 hover:bg-warm-800"
              }`}
            >
              {tab === "crawl" ? "크롤링" : "쿠팡 상품"}
            </button>
          ))}
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {activeTab === "crawl" && (<>
        {/* 크롤링 액션 */}
        <section className="bg-warm-800 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">시골농부 HOT 6 크롤링</h2>
              <p className="text-warm-400 text-sm mt-1">
                hankyeong.kr 메인 페이지에서 HOT 6 상품을 수집합니다
              </p>
            </div>
            <button
              onClick={handleCrawl}
              disabled={loading}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-warm-600 text-white font-medium rounded-lg transition-colors whitespace-nowrap"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  크롤링 중...
                </span>
              ) : (
                "지금 크롤링"
              )}
            </button>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-900/30 border border-red-800 rounded-lg text-red-300 text-sm">
              {error}
            </div>
          )}
          {message && (
            <div className="mt-4 p-3 bg-green-900/30 border border-green-800 rounded-lg text-green-300 text-sm">
              {message}
            </div>
          )}
        </section>

        {/* 크롤링 결과 미리보기 */}
        {preview && (
          <section className="bg-warm-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">
                크롤링 결과{" "}
                <span className="text-warm-400 text-sm font-normal">
                  {preview.products.length}개 상품
                </span>
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setPreview(null)}
                  className="px-4 py-2 text-sm bg-warm-700 hover:bg-warm-600 rounded-lg transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="px-4 py-2 text-sm bg-green-600 hover:bg-green-700 disabled:bg-warm-600 text-white rounded-lg transition-colors"
                >
                  저장하기
                </button>
              </div>
            </div>

            <ProductGrid products={preview.products} showCoupangButton registeredProductCodes={registeredProductCodes} />
          </section>
        )}

        {/* 저장된 스냅샷 히스토리 */}
        <section className="bg-warm-800 rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4">
            크롤링 히스토리{" "}
            <span className="text-warm-400 text-sm font-normal">
              ({snapshots.length}개)
            </span>
          </h2>

          {snapshots.length === 0 ? (
            <p className="text-warm-500 text-center py-12">
              저장된 데이터가 없습니다. &quot;지금 크롤링&quot; 버튼을 눌러
              시작하세요.
            </p>
          ) : (
            <div className="space-y-2">
              {snapshots.map((snapshot) => (
                <div key={snapshot.id}>
                  <div
                    onClick={() =>
                      setSelectedSnapshot(
                        selectedSnapshot === snapshot.id ? null : snapshot.id
                      )
                    }
                    className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-colors ${
                      selectedSnapshot === snapshot.id
                        ? "bg-green-900/30 border border-green-800"
                        : "bg-warm-700/50 hover:bg-warm-700"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-green-600/20 flex items-center justify-center text-green-400 font-bold text-sm">
                        {snapshot.products.length}
                      </div>
                      <div>
                        <p className="font-medium text-sm">
                          HOT 6 스냅샷
                        </p>
                        <p className="text-warm-400 text-xs">
                          {formatDate(snapshot.crawledAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(snapshot.id);
                        }}
                        className="px-3 py-1.5 text-xs bg-red-900/50 hover:bg-red-800 text-red-300 rounded-lg transition-colors"
                      >
                        삭제
                      </button>
                      <span className="text-warm-500 text-sm">
                        {selectedSnapshot === snapshot.id ? "▲" : "▼"}
                      </span>
                    </div>
                  </div>

                  {/* 펼쳐진 상품 목록 */}
                  {selectedSnapshot === snapshot.id && activeSnapshot && (
                    <div className="mt-2 p-4 bg-warm-700/30 rounded-xl">
                      <ProductGrid products={activeSnapshot.products} showCoupangButton registeredProductCodes={registeredProductCodes} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
        </>)}

        {activeTab === "products" && (
          <>
            {/* 상태별 요약 카드 */}
            <div className="grid grid-cols-4 gap-4">
              {([
                { key: "draft", label: "임시저장", color: "yellow" },
                { key: "registered", label: "등록완료", color: "blue" },
                { key: "approved", label: "승인완료", color: "green" },
                { key: "rejected", label: "승인반려", color: "red" },
              ] as const).map(({ key, label, color }) => {
                const count = statusCounts[key];
                const colorMap = {
                  yellow: "bg-yellow-900/30 border-yellow-800 text-yellow-300",
                  blue: "bg-blue-900/30 border-blue-800 text-blue-300",
                  green: "bg-green-900/30 border-green-800 text-green-300",
                  red: "bg-red-900/30 border-red-800 text-red-300",
                };
                return (
                  <div
                    key={key}
                    className={`rounded-2xl border p-5 ${colorMap[color]}`}
                  >
                    <p className="text-sm opacity-80">{label}</p>
                    <p className="text-3xl font-bold mt-1">{count}</p>
                  </div>
                );
              })}
            </div>

            {/* 알림/에러 메시지 */}
            {error && (
              <div className="p-3 bg-red-900/30 border border-red-800 rounded-lg text-red-300 text-sm">
                {error}
              </div>
            )}
            {message && (
              <div className="p-3 bg-green-900/30 border border-green-800 rounded-lg text-green-300 text-sm">
                {message}
              </div>
            )}

            {/* 등록된 상품 섹션 (메인) */}
            <section className="bg-warm-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">
                  등록된 상품{" "}
                  <span className="text-warm-400 text-sm font-normal">
                    ({registeredProducts.length}개)
                  </span>
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSyncAll}
                    disabled={syncing}
                    className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-warm-600 text-white font-medium rounded-lg transition-colors"
                  >
                    {syncing ? (
                      <span className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        동기화 중...
                      </span>
                    ) : (
                      "상태 동기화"
                    )}
                  </button>
                  <button
                    onClick={() => router.push("/admin/register")}
                    className="px-4 py-2 text-sm bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
                  >
                    + 새 상품 등록
                  </button>
                </div>
              </div>

              {productsLoading ? (
                <div className="flex justify-center py-12">
                  <span className="w-6 h-6 border-2 border-warm-500 border-t-cream-100 rounded-full animate-spin" />
                </div>
              ) : registeredProducts.length === 0 ? (
                <p className="text-warm-500 text-center py-12">
                  등록된 상품이 없습니다.
                </p>
              ) : (
                <div className="space-y-2">
                  {registeredProducts.map((product) => {
                    const statusConfig: Record<string, { label: string; cls: string }> = {
                      registered: { label: "등록완료", cls: "bg-blue-900/50 text-blue-300" },
                      approved: { label: "승인완료", cls: "bg-green-900/50 text-green-300" },
                      rejected: { label: "승인반려", cls: "bg-red-900/50 text-red-300" },
                      deleted: { label: "삭제됨", cls: "bg-warm-600/50 text-warm-400" },
                    };
                    const isTempSave = product.coupang_status === "임시저장";
                    const st = isTempSave
                      ? { label: "임시저장", cls: "bg-yellow-900/50 text-yellow-300" }
                      : statusConfig[product.status] || statusConfig.registered;
                    return (
                      <div
                        key={product.id}
                        className="flex items-center justify-between p-4 bg-warm-700/50 hover:bg-warm-700 rounded-xl transition-colors"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <span className={`px-2 py-0.5 text-xs font-medium rounded-md whitespace-nowrap ${st.cls}`}>
                            {st.label}
                          </span>
                          {product.coupang_status && (
                            <span className="px-2 py-0.5 text-xs font-medium rounded-md whitespace-nowrap bg-purple-900/50 text-purple-300">
                              {product.coupang_status}
                            </span>
                          )}
                          <span className="text-sm font-medium truncate">
                            {product.product_name || "(이름 없음)"}
                          </span>
                          <span className="text-warm-500 text-xs whitespace-nowrap">
                            ID: {product.seller_product_id}
                          </span>
                          {product.sale_price && (
                            <span className="text-green-400 text-xs whitespace-nowrap">
                              {product.sale_price.toLocaleString("ko-KR")}원
                            </span>
                          )}
                          <span className="text-warm-500 text-xs whitespace-nowrap ml-auto mr-2">
                            {formatDate(product.updated_at || product.registered_at)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => router.push(`/admin/edit?id=${product.id}`)}
                            className="px-3 py-1.5 text-xs bg-warm-600 hover:bg-warm-500 rounded-lg transition-colors"
                          >
                            편집
                          </button>
                          {(product.status === "registered" || product.status === "rejected") && (
                            <button
                              onClick={() => handleApprove(product)}
                              disabled={loadingItems.has(product.id)}
                              className={`px-3 py-1.5 text-xs text-white rounded-lg transition-colors disabled:opacity-50 ${
                                product.status === "rejected"
                                  ? "bg-orange-600 hover:bg-orange-700"
                                  : "bg-green-600 hover:bg-green-700"
                              }`}
                            >
                              {loadingItems.has(product.id) ? (
                                <span className="flex items-center gap-1">
                                  <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                  처리중...
                                </span>
                              ) : product.status === "rejected" ? "재승인 요청" : "승인 요청"}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* 임시저장 섹션 */}
            <section className="bg-warm-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">
                  임시저장{" "}
                  <span className="text-warm-400 text-sm font-normal">
                    ({draftOnly.length}개)
                  </span>
                </h2>
              </div>

              {draftsLoading ? (
                <div className="flex justify-center py-8">
                  <span className="w-6 h-6 border-2 border-warm-500 border-t-cream-100 rounded-full animate-spin" />
                </div>
              ) : draftOnly.length === 0 ? (
                <p className="text-warm-500 text-center py-8 text-sm">
                  임시저장된 상품이 없습니다.
                </p>
              ) : (
                <div className="space-y-2">
                  {draftOnly.map((draft) => (
                    <div
                      key={draft.id}
                      className="flex items-center justify-between p-4 bg-warm-700/50 hover:bg-warm-700 rounded-xl transition-colors"
                    >
                      <div
                        className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
                        onClick={() => router.push(`/admin/register?draftId=${draft.id}`)}
                      >
                        <span className="px-2 py-0.5 text-xs font-medium rounded-md whitespace-nowrap bg-yellow-900/50 text-yellow-300">
                          임시저장
                        </span>
                        <span className="text-sm font-medium truncate">
                          {draft.product_name || "(이름 없음)"}
                        </span>
                        <span className="text-warm-500 text-xs whitespace-nowrap ml-auto mr-2">
                          {formatDate(draft.updated_at)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => router.push(`/admin/register?draftId=${draft.id}`)}
                          className="px-3 py-1.5 text-xs bg-warm-600 hover:bg-warm-500 rounded-lg transition-colors"
                        >
                          편집
                        </button>
                        <button
                          onClick={() => handleDeleteDraft(draft.id)}
                          className="px-3 py-1.5 text-xs bg-red-900/50 hover:bg-red-800 text-red-300 rounded-lg transition-colors"
                        >
                          삭제
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
}

function ProductGrid({ products, showCoupangButton = false, registeredProductCodes = [] }: { products: HotProduct[]; showCoupangButton?: boolean; registeredProductCodes?: string[] }) {
  const formatPrice = (price: number | null) => {
    if (!price) return "-";
    return price.toLocaleString("ko-KR") + "원";
  };

  const handleCoupangRegister = async (e: React.MouseEvent, product: HotProduct) => {
    e.preventDefault();
    e.stopPropagation();
    startLoading(product.code);
    try {
      const res = await fetch("/api/admin/drafts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_code: product.code,
          product_name: product.name,
          form_data: {
            sellerProductName: product.name,
            displayProductName: product.name,
            generalProductName: product.name,
            originalPrice: String(product.originalPrice || ""),
            salePrice: String(product.salePrice || ""),
            representImage: product.image || "",
          },
        }),
      });
      const draft = await res.json();
      if (draft.id) {
        window.location.href = `/admin/register?draftId=${draft.id}`;
      } else {
        alert("임시저장 생성에 실패했습니다.");
      }
    } catch {
      alert("임시저장 생성에 실패했습니다.");
    } finally {
      stopLoading(product.code);
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {products.map((product) => (
        <a
          key={product.code}
          href={product.detailUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group bg-warm-700/50 rounded-xl overflow-hidden hover:bg-warm-700 transition-colors"
        >
          {/* 이미지 */}
          <div className="relative aspect-square bg-warm-700">
            {product.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-warm-500 text-sm">
                No Image
              </div>
            )}
            {/* 순위 배지 */}
            <div
              className={`absolute top-2 left-2 w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold ${
                product.rank <= 3 ? "bg-green-600" : "bg-warm-600"
              }`}
            >
              {product.rank}
            </div>
          </div>

          {/* 정보 */}
          <div className="p-3">
            <p className="text-sm font-medium truncate">{product.name}</p>
            <div className="flex items-center gap-2 mt-1.5">
              {product.originalPrice && (
                <span className="text-warm-500 text-xs line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-green-400 font-semibold text-sm">
                {formatPrice(product.salePrice)}
              </span>
              {product.discountRate && (
                <span className="text-red-400 text-xs font-medium">
                  {product.discountRate}
                </span>
              )}
            </div>
            {showCoupangButton && (
              registeredProductCodes.includes(product.code) ? (
                <div className="mt-2 w-full px-3 py-1.5 bg-green-900/50 text-green-300 text-xs font-medium rounded-lg text-center">
                  등록완료
                </div>
              ) : (
                <button
                  onClick={(e) => handleCoupangRegister(e, product)}
                  disabled={loadingItems.has(product.code)}
                  className="mt-2 w-full px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-medium rounded-lg transition-colors"
                >
                  {loadingItems.has(product.code) ? (
                    <span className="flex items-center justify-center gap-1">
                      <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      준비중...
                    </span>
                  ) : "쿠팡 등록"}
                </button>
              )
            )}
          </div>
        </a>
      ))}
    </div>
  );
}
