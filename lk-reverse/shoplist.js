import { aesDecrypt, buildSign } from "./lk-crypto.js";
import { shopList } from "./endpoints.js";
import { DEFAULT_UID } from "./lk-client.js";

const CAPTURED = {
  cid: "230101",
  dk: 1,
  q: "dfSStZ1_cl_k3CkpGpESyD9cQnA8puFHTH43_J5giNOpQmwCIMoiqIzgeMoetVi7AfBlKr82_wz9KhQsYFV30MvdTImkp7TUC42eXqka095lFro5LLamWV1a2CiATAjQZ-zqmFECwtAXh9AzJJB3pfxa2oXbLFtJnuKZMurHI0uuIKA8nyXI4wFYA1QrHlmFprENLpAfrWviCV90Gy8iyGcFpQiFLczrHb2N9OSsj7ueAg1AAf5AJhL-yXwqriZLmsvPOpzqaNWeAvgk6R3XmI0ugeyfeP2kwJtnwuBFCh4=",
  sign: "1229192867123035103114405382691304161827",
};

const uid = process.argv[2] || DEFAULT_UID;

const recomputed = buildSign({ cid: CAPTURED.cid, dk: CAPTURED.dk, q: CAPTURED.q, uid });
console.log("原始 q 解密   =", aesDecrypt(CAPTURED.q));
console.log("复算 sign     =", recomputed);
console.log("原始 sign     =", CAPTURED.sign);
console.log("签名还原一致  =", recomputed === CAPTURED.sign);

const data = {
  channel: "GCJ-02",
  longitude: 120.15657,
  latitude: 30.276853,
  cityId: 12,
  offSet: 0,
  pageSize: 4,
  searchValue: "",
  scene: null,
  userLongitude: 120.1551513671875,
  userLatitude: 30.274150848388672,
};

const res = await shopList(data, { uid, deptId: 603072 });
console.log("新请求 q      =", res.request.q);
console.log("新请求 sign   =", res.request.sign);
console.log("HTTP", res.status, "x-is-error:", res.isError);
console.log("解密          =", JSON.stringify(res.decoded, null, 2));
