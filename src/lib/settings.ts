import { supabase } from "./supabase";

// 단일 설정값 조회
export async function getSetting(key: string): Promise<string> {
  const { data } = await supabase
    .from("settings")
    .select("value")
    .eq("key", key)
    .single();
  return data?.value || "";
}

// 여러 설정값 한번에 조회
export async function getSettings(
  keys: string[]
): Promise<Record<string, string>> {
  const { data } = await supabase
    .from("settings")
    .select("key, value")
    .in("key", keys);

  const result: Record<string, string> = {};
  for (const key of keys) {
    result[key] = "";
  }
  if (data) {
    for (const row of data) {
      result[row.key] = row.value;
    }
  }
  return result;
}

// 설정값 저장
export async function setSetting(key: string, value: string): Promise<void> {
  await supabase
    .from("settings")
    .upsert({ key, value, updated_at: new Date().toISOString() });
}

// 여러 설정값 한번에 저장
export async function setSettings(
  entries: Record<string, string>
): Promise<void> {
  const rows = Object.entries(entries).map(([key, value]) => ({
    key,
    value,
    updated_at: new Date().toISOString(),
  }));
  await supabase.from("settings").upsert(rows);
}

// 모든 설정값 조회
export async function getAllSettings(): Promise<Record<string, string>> {
  const { data } = await supabase.from("settings").select("key, value");
  const result: Record<string, string> = {};
  if (data) {
    for (const row of data) {
      result[row.key] = row.value;
    }
  }
  return result;
}

// 쿠팡 관련 설정만 조회
export async function getCoupangSettings() {
  const settings = await getSettings([
    "coupang_vendor_id",
    "coupang_vendor_user_id",
    "coupang_return_center_code",
    "coupang_return_charge_name",
    "coupang_company_contact_number",
    "coupang_return_zip_code",
    "coupang_return_address",
    "coupang_return_address_detail",
    "coupang_outbound_shipping_place_code",
    "coupang_after_service_information",
    "coupang_after_service_contact_number",
  ]);

  return {
    vendorId: settings.coupang_vendor_id,
    vendorUserId: settings.coupang_vendor_user_id,
    returnCenterCode: settings.coupang_return_center_code,
    returnChargeName: settings.coupang_return_charge_name,
    companyContactNumber: settings.coupang_company_contact_number,
    returnZipCode: settings.coupang_return_zip_code,
    returnAddress: settings.coupang_return_address,
    returnAddressDetail: settings.coupang_return_address_detail,
    outboundShippingPlaceCode: settings.coupang_outbound_shipping_place_code,
    afterServiceInformation: settings.coupang_after_service_information,
    afterServiceContactNumber: settings.coupang_after_service_contact_number,
  };
}
