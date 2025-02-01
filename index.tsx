import "@/utils/init";
import "app/css/build.css";
import "app/lib/utils/event";
import { lang } from "lib/lang";
export * from "@/exports";
export { HeaderTitled } from "app/comps/HeaderTitled";
export { cart, CartItem } from "app/lib/bizpro/cart";
export {
  checkEsensiPhoneCustomer,
  validateEmail,
} from "app/lib/bizpro/register";
export { checkSession } from "app/lib/bizpro/session";
export { icon } from "app/lib/ui/icon";
export { ImgThumb } from "app/lib/ui/img-thumb";
export { layoutStyle } from "app/lib/ui/layout-style";
export { success } from "app/lib/ui/toast";
export { _server, _session } from "app/lib/utils/_server";
export { cacheResult } from "app/lib/utils/cache-result";
export { restoreScroll } from "app/lib/utils/restore-scroll";

// #region session & router
await lang.init("id");
// #endregion

export { trxSalesStatus } from "app/enums";
export { dashboard } from "app/lib/bizpro/dashboard";
export * from "app/lib/bizpro/midtrans";
export { MobileLayout } from "app/lib/ui/mobile-layout";
export { Movable } from "app/lib/ui/movable";
export { validate as is_uuid } from "uuid";

export { fbq } from "app/lib/bizpro/fbq";
export { Reader } from "app/lib/reader/reader";
