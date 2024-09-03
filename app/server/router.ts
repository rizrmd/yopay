import { newServerRouter } from "lib/server/server-route";

export const router = newServerRouter({
  register: ["/register", () => import("./router/register")],
  otp: ["/send-otp", () => import("./router/send-otp")],
});
