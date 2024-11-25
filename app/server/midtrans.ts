const isDev = true;

declare global {
  interface Window {
    snap: any;
  }
}


type trxRequestParam = {
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

type trxResponse = {
  token: string;
  redirect_url: string;
  error_messages?: string[];
};

export function _midtrans_pay(data: trxRequestParam) {
  return new Promise<{ status: string; result?: any }>(async (resolve) => {

    if (r.ok) {
      const json: trxResponse = await r.json();
      if (json?.error_messages) {
        resolve({ status: "error", result: json?.error_messages.join(". ") });
        return;
      }
      window.snap?.pay(json?.token, {
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
    resolve({ status: "error" });
  });
}
