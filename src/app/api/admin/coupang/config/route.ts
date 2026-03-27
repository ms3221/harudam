import { NextRequest, NextResponse } from "next/server";
import { getCoupangSettings, setSettings } from "@/lib/settings";

// 쿠팡 설정 조회
export async function GET() {
  const hasKeys = !!(
    process.env.COUPANG_ACCESS_KEY && process.env.COUPANG_SECRET_KEY
  );

  const defaults = await getCoupangSettings();

  const hasVendor = !!(defaults.vendorId && defaults.vendorUserId);
  const hasReturn = !!(
    defaults.returnCenterCode && defaults.returnAddress
  );
  const hasOutbound = !!defaults.outboundShippingPlaceCode;

  return NextResponse.json({
    hasKeys,
    hasVendor,
    hasReturn,
    hasOutbound,
    ready: hasKeys && hasVendor,
    defaults: hasKeys ? defaults : null,
  });
}

// 쿠팡 설정 저장
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const entries: Record<string, string> = {};

    const keyMap: Record<string, string> = {
      vendorId: "coupang_vendor_id",
      vendorUserId: "coupang_vendor_user_id",
      returnCenterCode: "coupang_return_center_code",
      returnChargeName: "coupang_return_charge_name",
      companyContactNumber: "coupang_company_contact_number",
      returnZipCode: "coupang_return_zip_code",
      returnAddress: "coupang_return_address",
      returnAddressDetail: "coupang_return_address_detail",
      outboundShippingPlaceCode: "coupang_outbound_shipping_place_code",
      afterServiceInformation: "coupang_after_service_information",
      afterServiceContactNumber: "coupang_after_service_contact_number",
    };

    for (const [camelKey, dbKey] of Object.entries(keyMap)) {
      if (camelKey in body) {
        entries[dbKey] = body[camelKey];
      }
    }

    await setSettings(entries);
    return NextResponse.json({ success: true });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "설정 저장 실패";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
