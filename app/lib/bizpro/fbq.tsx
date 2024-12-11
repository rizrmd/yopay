export const fbq: (
  str: "track",
  event:
    | "AddToCart"
    | "CompleteRegistration"
    | "InitiateCheckout"
    | "Purchase"
    | "Search",
  data?: { value: number; currency: "IDR" }
) => void = (window as any).fbq;
