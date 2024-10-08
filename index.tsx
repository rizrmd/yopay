import "@/utils/init";
import "app/css/build.css";
import "app/lib/event";
import { newEsensiSession } from "app/server/session";
import { lang } from "lib/lang";
export * from "@/exports";
export { HeaderTitled } from "app/comps/HeaderTitled";
export { cart, CartItem } from "app/lib/cart";
export { icon } from "app/lib/icon";
export { layoutStyle } from "app/lib/layout-style";
export { checkEsensiPhoneCustomer, validateEmail } from "app/lib/register";
export { success } from "app/lib/toast";

// #region session & router
await lang.init("id");
import { router } from "app/server/router";
export const _server = newClientRouter(router);
export const _session = newEsensiSession(router);
import { newClientRouter } from "lib/server/server-route";
// #endregion

// _session.

export * from "app/server/midtrans";
export { trxSalesStatus } from "app/enums";
