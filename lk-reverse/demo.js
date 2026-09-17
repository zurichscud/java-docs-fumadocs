import { aesDecrypt, buildSign } from "./lk-crypto.js";
import { seckillProductMenu } from "./endpoints.js";
import { DEFAULT_UID } from "./lk-client.js";

const CAPTURED = {
  cid: "230101",
  dk: 1,
  q: "mJLa8T0VKUJKhbH3Mi13L0jibbGmNTpkdxrK_7SjwN1ow5pYJD4dTbNkz4nFXlZL",
  sign: "183430301822881642578105353596233596",
};

const uid = process.argv[2] || DEFAULT_UID;

const recomputed = buildSign({ cid: CAPTURED.cid, dk: CAPTURED.dk, q: CAPTURED.q, uid });
console.log("原始 q 解密   =", aesDecrypt(CAPTURED.q));
console.log("复算 sign     =", recomputed);
console.log("原始 sign     =", CAPTURED.sign);
console.log("签名还原一致  =", recomputed === CAPTURED.sign);

const res = await seckillProductMenu({ deptId: 603072 }, { uid, deptId: 603072 });
console.log("伪造请求 q    =", res.request.q);
console.log("伪造请求 sign =", res.request.sign);
console.log("HTTP", res.status, "x-is-error:", res.isError);
console.log("响应解密      =", JSON.stringify(res.decoded));
