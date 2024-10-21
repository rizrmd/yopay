import { CartItem } from "app/lib/cart";
import { trxSalesStatus } from "app/enums";
import { trxSalesResponse } from "./get/not-paid";

export type trxData = {
  id_customer: string;
  status: trxSalesStatus | string;
  total: number;
  currency: string;
  info: { cart: CartItem[] };
};

export default async function (data: trxData): Promise<trxSalesResponse> {
  const t_sales_lines = data.info.cart.map((x) => ({
    id_product: x.id,
    qty: 1,
    unit_price: Number(x.real_price),
    total_price: Number(x.real_price),
  }));
  let t_sales = await db.t_sales.create({
    data: {
      ...data,
      t_sales_line: {
        createMany: {
          skipDuplicates: true,
          data: t_sales_lines,
        }
      }
    },
    select: { id: true },
  });
  return t_sales
    ? {
        ok: true,
        count: 1,
        data: t_sales,
      }
    : { ok: true, count: 0, data: null };
}
