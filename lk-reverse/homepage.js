import { aesDecrypt, buildSign } from "./lk-crypto.js";
import { homePageCoffeeList } from "./endpoints.js";
import { DEFAULT_UID } from "./lk-client.js";

const CAPTURED = {
  cid: "230101",
  dk: 1,
  q: "mJLa8T0VKUJKhbH3Mi13LxLZkg5u6rk6q_LQYapMgqCbRwfB7mkRCb28IvUsSYYcLvJ4VNTPRljN80WbryiSqg==",
  sign: "378867675126526156816580172961229164050",
};

const uid = process.argv[2] || DEFAULT_UID;
const deptId = Number(process.argv[3] || 603072);

const recomputed = buildSign({ cid: CAPTURED.cid, dk: CAPTURED.dk, q: CAPTURED.q, uid });
console.log("原始 q 解密   =", aesDecrypt(CAPTURED.q));
console.log("复算 sign     =", recomputed);
console.log("原始 sign     =", CAPTURED.sign);
console.log("签名还原一致  =", recomputed === CAPTURED.sign);

const res = await homePageCoffeeList({ deptId }, { uid, deptId });
console.log("新请求 q      =", res.request.q);
console.log("新请求 sign   =", res.request.sign);
console.log("HTTP", res.status, "x-is-error:", res.isError);
console.log("解密          =", JSON.stringify(res.decoded, null, 2));
