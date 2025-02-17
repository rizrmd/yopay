export const fbq: (
  str: "track",
  event:
    | "AddToCart"
    | "CompleteRegistration"
    | "InitiateCheckout"
    | "Purchase"
    | "Search",
  data?: {
    value: number;
    currency: "IDR";
    content_ids?: string[];
    content_type?: string;
    num_items?: number;
  }
) => void = (window as any).fbq || (() => {});
