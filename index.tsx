import "@/utils/init";
import "app/css/build.css";
import "app/lib/utils/event";
import { lang } from "lib/lang";
export * from "@/exports";
export { HeaderTitled } from "app/comps/HeaderTitled";
export { cart, CartItem } from "app/lib/bizpro/cart";
export { icon } from "app/lib/ui/icon";
export { layoutStyle } from "app/lib/ui/layout-style";
export {
  checkEsensiPhoneCustomer,
  validateEmail,
} from "app/lib/bizpro/register";
export { success } from "app/lib/ui/toast";
export { restoreScroll } from "app/lib/utils/restore-scroll";
export { cacheResult } from "app/lib/utils/cache-result";
export { ImgThumb } from "app/lib/ui/img-thumb";

// #region session & router
await lang.init("id");
export { _server, _session } from "app/lib/utils/_server";
export { checkSession } from "app/lib/bizpro/session";
// #endregion

export * from "app/server/midtrans";
export { trxSalesStatus } from "app/enums";
export { dashboard } from "app/lib/bizpro/dashboard";
export { validate as is_uuid } from "uuid";
export { Movable } from "app/lib/ui/movable";
