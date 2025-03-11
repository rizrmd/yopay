import { CartItem } from "app/lib/bizpro/cart";
import { generateReceipt } from "app/server/lib/gen-receipt";

export default async function (sales_id: string) {
  const res = await db.t_sales.findFirst({
    where: {
      id: sales_id,
    },
  });

  const info = res?.info as unknown as { cart: CartItem[] };
  if (info && info.cart) {
    const struk = generateReceipt(info.cart);

    return {
      ok: true,
      struk,
      status: "completed",
    };
  } else {
    return {
      ok: false,
      status: "failed",
    };
  }
}
