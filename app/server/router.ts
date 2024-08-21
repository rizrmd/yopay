import { newRouter } from "lib/server/server-route";

export const routes = newRouter({
  register: ["/register", () => import("./router/register")],
});
