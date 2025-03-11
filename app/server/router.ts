import { newServerRouter } from "lib/server/server-route";

export const router = newServerRouter({
  midtrans: ["/_midtrans", () => import("./router/midtrans")],
  register: ["/register", () => import("./router/register")],
  login: ["/api/login", () => import("./router/login")],
  otp: ["/send-otp", () => import("./router/send-otp")],
  check_otp: ["/check-otp", () => import("./router/check-otp")],
  wa: ["/api/send-wa", () => import("./router/wa")],
  midtrx: ["/_midtrx/*", () => import("./router/midtrx")],
  email: ["/_email", () => import("./router/email")],
  download: ["/api/download/*", () => import("./router/download")],
  midtransOrderId: [
    "/pay/gen_order_id",
    () => import("./router/payment/gen_order_id"),
  ],
  paymentSuccess: ["/pay/success/:sales_id", () => import("./router/payment/success")],
  exportSales: ["/export_sales/*", () => import("./router/export-sales")],
  paymentPending: ["/pay/pending", () => import("./router/payment/pending")],
  paymentError: ["/pay/error", () => import("./router/payment/error")],
  salesPerMonth: [
    "/api/sales-per-month",
    () => import("./router/sales-per-month"),
  ],
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
