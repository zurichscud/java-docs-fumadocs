import { CONFIG, aesDecrypt, buildParams } from "./lk-crypto.js";

const DEFAULT_UID =
  "ee3eb48e-33d9-413b-ae7b-242620f7474d1789607689032-256712744-rSH2_x1kfzcogqEh10bq7NaeauurLflx9yACTz65IAD5D5MQd1Li8VH3xVkx2EQ6";

export const DOMAINS = {
  capi: "https://capi.lkcoffee.com",
  capisk: "https://capisk.lkcoffee.com",
  ecapi: "https://ecapi.lkcoffee.com",
};

export async function request(path, data, options = {}) {
  const {
    uid = DEFAULT_UID,
    key = CONFIG.key.prod,
    base = DOMAINS.capi,
    deptId = data.deptId,
    mid = "256712744",
    headers: extraHeaders = {},
  } = options;

  const params = buildParams(data, { uid, key });
  const body = new URLSearchParams(params).toString();
  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
    Accept: "*/*",
    "X-LK-AKV": CONFIG.akv,
    "X-LK-CSID": "ce690682-adb2-3011-2ea9-697388af8ba6",
    "X-LK-MID": String(mid),
    "X-LK-SID": String(deptId ?? ""),
    "x-lkwx-ostype": "mac",
    "x-lkwx-sdkversion": "3.17.2",
    xweb_xhr: "1",
    Cookie: `uid=${uid}`,
    ...extraHeaders,
  };

  const res = await fetch(base + path, { method: "POST", headers, body });
  const raw = await res.text();
  const isError = res.headers.get("x-is-error") === "true";
  let decoded = null;
  try {
    decoded = JSON.parse(aesDecrypt(raw, key));
  } catch {
    decoded = raw;
  }
  return { status: res.status, isError, request: params, raw, decoded };
}

export { DEFAULT_UID };
