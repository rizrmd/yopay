import "@/utils/init";
import "app/css/build.css";
import "app/lib/utils/event";
export * from "@/exports";
import { baseurl } from "@/exports";
export { HeaderTitled } from "app/comps/HeaderTitled";
export { cart, CartItem } from "app/lib/bizpro/cart";
export { default as EmblaCarousel } from "app/comps/EmblaCarousel";
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
export { trxSalesStatus } from "app/enums";
export { dashboard } from "app/lib/bizpro/dashboard";
export { MobileLayout } from "app/lib/ui/mobile-layout";
export { Movable } from "app/lib/ui/movable";
export { validate as is_uuid } from "uuid";
export { fbq } from "app/lib/bizpro/fbq";
export { Reader } from "app/lib/reader/reader";
export * from "app/lib/bizpro/midtrans";

export const isReader = localStorage.getItem("isReader") === "true";
