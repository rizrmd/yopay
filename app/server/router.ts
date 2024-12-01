import { newServerRouter } from "lib/server/server-route";

export const router = newServerRouter({
  midtrans: ["/_midtrans", () => import("./router/midtrans")],
  register: ["/register", () => import("./router/register")],
  login: ["/api/login", () => import("./router/login")],
  otp: ["/send-otp", () => import("./router/send-otp")],
  download: ["/api/download/*", () => import("./router/download")],
  track: ["/api/track/*", () => import("./router/track")],
  midtransOrderId: [
    "/pay/gen_order_id",
    () => import("./router/payment/gen_order_id"),
  ],
  paymentSuccess: ["/pay/success", () => import("./router/payment/success")],
  paymentPending: ["/pay/pending", () => import("./router/payment/pending")],
  paymentError: ["/pay/error", () => import("./router/payment/error")],
  trxSalesGetNotPaid: [
    "/api/trx-sales/get/not-paid",
    () => import("./router/trx-sales/get/not-paid"),
  ],
  trxSalesGetAllPaid: [
    "/api/trx-sales/get/all-paid",
    () => import("./router/trx-sales/get/all-paid"),
  ],
  trxSalesCreate: [
    "/api/trx-sales/create",
    () => import("./router/trx-sales/create"),
  ],
  trxSalesUpdate: [
    "/api/trx-sales/update",
    () => import("./router/trx-sales/update"),
  ],
  otherProducts: [
    "/api/products/others",
    () => import("./router/products/others"),
  ],
  productsByCategory: [
    "/api/products/category",
    () => import("./router/products/category"),
  ],
  productsByCategorySlug: [
    "/api/products/category-slug",
    () => import("./router/products/category-slug"),
  ],
});
