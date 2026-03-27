import { NextResponse } from "next/server";
import { CoupangClient } from "@/lib/coupang";
import { getSetting } from "@/lib/settings";

export async function GET() {
  const accessKey = process.env.COUPANG_ACCESS_KEY;
  const secretKey = process.env.COUPANG_SECRET_KEY;
  const vendorId = await getSetting("coupang_vendor_id");

  if (!accessKey || !secretKey || !vendorId) {
    return NextResponse.json(
      { error: "API 키 또는 vendorId가 설정되지 않았습니다." },
      { status: 500 }
    );
  }

  const client = new CoupangClient(accessKey, secretKey);

  try {
    const [returnCenters, shippingPlaces] = await Promise.allSettled([
      client.request<{ data: { content: unknown[] } }>(
        "GET",
        `/v2/providers/openapi/apis/api/v4/vendors/${vendorId}/returnShippingCenters`
      ),
      client.request<{ data: unknown }>(
        "GET",
        `/v2/providers/marketplace_openapi/apis/api/v2/vendor/shipping-place/outbound?pageNum=1&pageSize=50`
      ),
    ]);

    const result = {
      returnCenters:
        returnCenters.status === "fulfilled" ? returnCenters.value : null,
      shippingPlaces:
        shippingPlaces.status === "fulfilled" ? shippingPlaces.value : null,
      errors: {
        returnCenters:
          returnCenters.status === "rejected" ? returnCenters.reason?.message : null,
        shippingPlaces:
          shippingPlaces.status === "rejected" ? shippingPlaces.reason?.message : null,
      },
    };
    return NextResponse.json(result);
  } catch (error) {
    const msg = error instanceof Error ? error.message : "조회 실패";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
