// 쿠팡 WING API HMAC-SHA256 인증
// 독립 모듈 - 프로젝트 의존성 없음

import crypto from "crypto";

interface SignatureParams {
  method: string;
  path: string;
  accessKey: string;
  secretKey: string;
  datetime?: string;
}

function formatDatetime(): string {
  const now = new Date();
  const yy = String(now.getUTCFullYear()).slice(2);
  const MM = String(now.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(now.getUTCDate()).padStart(2, "0");
  const HH = String(now.getUTCHours()).padStart(2, "0");
  const mm = String(now.getUTCMinutes()).padStart(2, "0");
  const ss = String(now.getUTCSeconds()).padStart(2, "0");
  return `${yy}${MM}${dd}T${HH}${mm}${ss}Z`;
}

export function generateSignature({
  method,
  path,
  accessKey,
  secretKey,
  datetime,
}: SignatureParams): string {
  const dt = datetime || formatDatetime();

  // path와 queryString을 분리하여 서명 생성
  const [pathOnly, queryString] = path.split("?");
  const message = `${dt}${method}${pathOnly}${queryString || ""}`;
  const signature = crypto
    .createHmac("sha256", secretKey)
    .update(message)
    .digest("hex");

  return `CEA algorithm=HmacSHA256, access-key=${accessKey}, signed-date=${dt}, signature=${signature}`;
}
