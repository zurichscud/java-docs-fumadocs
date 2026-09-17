import crypto from "node:crypto";

export const CONFIG = {
  appId: "wx21c7506e98a2fe75",
  key: {
    test03: "We18vgcyxPHuz4De",
    test04: "MoOQpner3efXajRk",
    pre: "DzVPFIjpLa8ZQL2l",
    prod: "CJQjAc1hYieC4QYb",
  },
  socket: "JKLJKLWdsj234h23",
  akv: "lk-wxmp-v5.3.22",
  code: 230,
  version: 101,
  replaceSpecial: true,
};

const ALG = "aes-128-ecb";

export function aesEncrypt(plain, key = CONFIG.key.prod) {
  const cipher = crypto.createCipheriv(ALG, Buffer.from(key, "utf8"), null);
  const out = Buffer.concat([cipher.update(String(plain), "utf8"), cipher.final()]).toString("base64");
  return CONFIG.replaceSpecial ? out.replace(/\+/g, "-").replace(/\//g, "_") : out;
}

export function aesDecrypt(cipherText, key = CONFIG.key.prod) {
  const buf = Buffer.from(cipherText.replace(/-/g, "+").replace(/_/g, "/"), "base64");
  const decipher = crypto.createDecipheriv(ALG, Buffer.from(key, "utf8"), null);
  decipher.setAutoPadding(false);
  const raw = Buffer.concat([decipher.update(buf), decipher.final()]);
  const pad = raw[raw.length - 1];
  const isPadded = pad >= 1 && pad <= 16 && raw.subarray(raw.length - pad).every((b) => b === pad);
  return (isPadded ? raw.subarray(0, raw.length - pad) : raw).toString("utf8");
}

export function md5Decimal(str) {
  const digest = crypto.createHash("md5").update(str, "utf8").digest();
  return [0, 4, 8, 12].map((offset) => String(Math.abs(digest.readInt32BE(offset)))).join("");
}

export function buildSign(params, key = CONFIG.key.prod) {
  const list = Object.entries(params).map(([k, v]) => `${k}=${v}`);
  return md5Decimal(list.sort().join(";") + key);
}

export function buildParams(data, { uid, key = CONFIG.key.prod, cid = `${CONFIG.code}${CONFIG.version}`, dk = 1 } = {}) {
  const q = aesEncrypt(JSON.stringify(data), key);
  const params = { cid, dk, q };
  if (uid) params.uid = uid;
  params.sign = buildSign(params, key);
  return params;
}
