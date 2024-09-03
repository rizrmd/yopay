import "@/utils/init";
import "app/css/build.css";
import "app/lib/event";
import { EsensiSession } from "app/server/session";
import { lang } from "lib/lang";
import { newClientSession } from "lib/session/client-session";
export * from "@/exports";
export { HeaderTitled } from "app/comps/HeaderTitled";
export { cart, CartItem } from "app/lib/cart";
export { icon } from "app/lib/icon";
export { layoutStyle } from "app/lib/layout-style";
export { success } from "app/lib/toast";
await lang.init("id");

export const _session = newClientSession<EsensiSession>({
  tracker: { enabled: true },
  on: {
    async afterInit(session) {
      console.log('client session: after init',session.status)
    },
    async afterLogin(session) {
      console.log('client session: after login')
    },
    async afterLogout(session) {
      console.log('client session: after logout')
    },
  },
}); 
 
