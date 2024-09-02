import "@/utils/init";
import "app/css/build.css";
import "app/lib/event";
import { router } from "app/server/router";
import { EsensiSession } from "app/server/session";
import { lang } from "lib/lang";
import { newClientRouter } from "lib/server/server-route";
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
      await session.logout();
    },
    async afterLogin(session) {},
    async afterLogout(session) {},
  },
});
