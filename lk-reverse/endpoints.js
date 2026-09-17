import { request, DOMAINS } from "./lk-client.js";

export const seckillProductMenu = (data, options = {}) =>
  request(
    "/resource/seckill/product/menu",
    { miniversion: "5595", ...data },
    { base: DOMAINS.capisk, ...options },
  );

export const homePageCoffeeList = (data, options = {}) =>
  request(
    "/resource/core/v2/homepage/homePageCoffeeList",
    { miniversion: "5595", supportTakeout: 0, ...data },
    { base: DOMAINS.capi, ...options },
  );

export const shopList = (data, options = {}) =>
  request(
    "/resource/m/shop/shopList",
    {
      channel: "GCJ-02",
      offSet: 0,
      pageSize: 4,
      searchValue: "",
      scene: null,
      miniversion: "5595",
      ...data,
    },
    { base: DOMAINS.capi, ...options },
  );
