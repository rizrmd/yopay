import { createId } from "@paralleldrive/cuid2";

export default async function (t_sales_id: string, midtrans_order_id: string) {
  let new_id = `esn-${createId()}`;
  while (
    await db.t_sales.findFirst({
      where: { midtrans_order_id: new_id },
      select: { id: true },
    })
  ) {
    new_id = `esn-${createId()}`;
  }

  await db.t_sales.update({
    where: {
      id: t_sales_id,
    },
    data: {
      midtrans_order_id: new_id,
    },
  });

  return {
    new_id,
  };
}
