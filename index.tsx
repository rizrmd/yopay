import "@/utils/init";
import "app/css/build.css";
import "app/lib/event";
import { router } from "app/server/router";
import { EsensiSession } from "app/server/session";
import { lang } from "lib/lang";
import { newClientRouter } from "lib/server/server-route";
import { newClientSession } from "lib/server/session/client-session";
export * from "@/exports";
export { HeaderTitled } from "app/comps/HeaderTitled";
export { cart, CartItem } from "app/lib/cart";
export { icon } from "app/lib/icon";
export { layoutStyle } from "app/lib/layout-style";
export { session } from "app/lib/session";
export { success } from "app/lib/toast";
await lang.init("id");

export const _server = newClientRouter(router);
export const _session = newClientSession<EsensiSession>({
  on: {
    async afterLogin() {},
    async messageReceived() {},
  },
});

