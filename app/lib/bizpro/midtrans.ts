import { _server } from "../utils/_server";

declare global {
  interface Window {
    snap: any;
  }
}

const _midtrans_sandboxScriptUrl =
  "https://app.sandbox.midtrans.com/snap/snap.js";
const _midtrans_productionScriptUrl = "https://app.midtrans.com/snap/snap.js";

export async function _midtrans_init() {
  let midtrans = (window as any)._midtrans || {};

  if (Object.entries(midtrans).length === 0) {
    (window as any)._midtrans = {};
    midtrans = (window as any)._midtrans;
    const res = await (
      await fetch(`/_proxy/https://esensi.online/_midtrans`)
    ).json();

    for (const [k, v] of Object.entries(res)) {
      midtrans[k] = v;
    }
    let scriptTag = document.createElement("script");
    scriptTag.src =
      midtrans["_midtrans_mode"] === "dev"
        ? _midtrans_sandboxScriptUrl
        : _midtrans_productionScriptUrl;
    scriptTag.type = "text/javascript";
    scriptTag.setAttribute("data-client-key", midtrans["_midtrans_clientKey"]);
    document.head.appendChild(scriptTag);
  }
  return midtrans;
}

type trxTokenRequest = {
  transaction_details: {
    order_id: string;
    gross_amount: number;
  };
  credit_card: {
    secure: boolean;
  };
  customer_details: {
    first_name: string;
    last_name: string | "";
    email: string;
    phone: string;
  };
};

export const _midtrans_sandboxChargeAPI =
  "https://app.sandbox.midtrans.com/snap/v1/transactions";
export const _midtrans_productionChargeAPI =
  "https://app.midtrans.com/snap/v1/transactions";

export async function _midtrans_pay(t_sales_id: string, data: trxTokenRequest) {
  let midtrans = await _midtrans_init();

  const _midtrans_httpHeaders = {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: midtrans["_midtrans_base64AuthHeader"],
  };

  return new Promise<{ status: string; result?: any }>(async (resolve) => {
    let r = (await (
      await fetch(
        `/_proxy/${
          midtrans["_midtrans_mode"]
            ? _midtrans_sandboxChargeAPI
            : _midtrans_productionChargeAPI
        }`,
        {
          method: "POST",
          headers: _midtrans_httpHeaders,
          body: JSON.stringify(data),
        }
      )
    ).json()) as { token?: string; error_messages: string[] };

    if (r.error_messages?.[0].includes("transaction_details.order_id")) {
      // retry 1 time
      const retry = await _server.midtransOrderId(
        t_sales_id,
        data.transaction_details.order_id
      );
      if (retry.new_id) {
        data.transaction_details.order_id = retry.new_id;
        r = await (
          await fetch(
            `/_proxy/${
              midtrans["_midtrans_mode"]
                ? _midtrans_sandboxChargeAPI
                : _midtrans_productionChargeAPI
            }`,
            {
              method: "POST",
              headers: _midtrans_httpHeaders,
              body: JSON.stringify(data),
            }
          )
        ).json();
      }
    }

    if (!r.error_messages) {
      window.snap.pay(r.token, {
        onSuccess: async function (result: any) {
          /* You may add your own implementation here */
          await db.t_sales.update({
            where: { id: t_sales_id },
            data: { midtrans_success: result },
          });
          resolve({ status: "success", result });
        },
        onPending: async function (result: any) {
          /* You may add your own implementation here */
          await db.t_sales.update({
            where: { id: t_sales_id },
            data: { midtrans_pending: result },
          });
          resolve({ status: "pending", result });
        },
        onError: async function (result: any) {
          /* You may add your own implementation here */
          await db.t_sales.update({
            where: { id: t_sales_id },
            data: { midtrans_error: result },
          });
          resolve({ status: "error", result });
        },
        onClose: function () {
          resolve({ status: "close" });
          /* You may add your own implementation here */
        },
      });
    }
  });
}
