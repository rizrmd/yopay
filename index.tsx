import "@/utils/init";
import "app/css/build.css";
import "app/lib/event";
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
export { _server, _session } from "app/lib/_server";
export { checkSession } from "app/lib/session";
// #endregion

export * from "app/server/midtrans";
export { trxSalesStatus } from "app/enums";
