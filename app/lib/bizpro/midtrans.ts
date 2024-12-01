const isDev = true;

declare global {
  interface Window {
    snap: any;
  }
}

const _midtrans_sandboxScriptUrl =
  "https://app.sandbox.midtrans.com/snap/snap.js";
const _midtrans_productionScriptUrl = "https://app.midtrans.com/snap/snap.js";

export function _midtrans_init() {
  let scriptTag = document.createElement("script");
  scriptTag.src = isDev
    ? _midtrans_sandboxScriptUrl
    : _midtrans_productionScriptUrl;
  scriptTag.type = "text/javascript";
  // scriptTag.async = true;
  scriptTag.setAttribute("data-client-key", "_midtrans_clientKey");
  document.head.appendChild(scriptTag);
  // return () => document.body.removeChild(scriptTag);
}

const _midtrans_httpHeaders = {
  Accept: "application/json",
  "Content-Type": "application/json",
  Authorization: "_midtrans_base64AuthHeader",
};

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

type trxTokenResponse = {
  token: string;
  redirect_url: string;
};

export const _midtrans_sandboxChargeAPI =
  "https://app.sandbox.midtrans.com/snap/v1/transactions";
export const _midtrans_productionChargeAPI =
  "https://app.midtrans.com/snap/v1/transactions";

export function _midtrans_pay(data: trxTokenRequest) {
  return new Promise<{ status: string; result?: any }>(async (resolve) => {
    const r = await fetch(
      `/_proxy/${
        isDev ? _midtrans_sandboxChargeAPI : _midtrans_productionChargeAPI
      }`,
      {
        method: "POST",
        headers: _midtrans_httpHeaders,
        body: JSON.stringify(data),
      }
    );

    if (r.ok) {
      const json: trxTokenResponse = await r.json();
      window.snap.pay(json.token, {
        onSuccess: function (result: any) {
          /* You may add your own implementation here */
          resolve({ status: "success", result });
        },
        onPending: function (result: any) {
          /* You may add your own implementation here */
          resolve({ status: "pending", result });
        },
        onError: function (result: any) {
          /* You may add your own implementation here */
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
