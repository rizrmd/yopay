import { newServerRouter } from "lib/server/server-route";

export const router = newServerRouter({
  register: ["/register", () => import("./router/register")],
  login: ["/api/login", () => import("./router/login")],
  otp: ["/send-otp", () => import("./router/send-otp")],
  download: ["/api/download/*", () => import("./router/download")],
  paymentSuccess: ["/pay/success", () => import("./router/payment/success")],
  paymentPending: ["/pay/pending", () => import("./router/payment/pending")],
  paymentError: ["/pay/error", () => import("./router/payment/error")],
  trxSalesGetNotPaid: ["/api/trx-sales/get/not-paid", () => import("./router/trxSales/get/not-paid")],
  trxSalesGetAllPaid: ["/api/trx-sales/get/all-paid", () => import("./router/trxSales/get/all-paid")],
  trxSalesCreate: ["/api/trx-sales/create", () => import("./router/trxSales/create")],
  trxSalesUpdate: ["/api/trx-sales/update", () => import("./router/trxSales/update")],
});
