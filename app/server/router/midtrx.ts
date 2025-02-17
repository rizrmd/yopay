import { SessionAuth, SessionContext } from "lib/session/type";
import { EsensiSession } from "../session";

export default async function (this: SessionContext<EsensiSession>) {
  const payload = await this.req.json();
  db.midtrx.create({
    data: { payload, type: this.url.pathname },
  });

  if (this.url.pathname.endsWith("finish")) {
    const order_id: string = payload?.transaction_details?.order_id;
    if (order_id) {
      const sales = await db.t_sales.findFirst({
        where: { midtrans_order_id: order_id },
        select: { id: true },
      });

      if (sales) {
        db.t_sales.update({
          data: {
            status: "paid",
            midtrans_success: payload,
            updated_at: new Date(),
          },
          where: {
            id: sales.id,
          },
        });
      }
    }
  }

  return { status: "ok" };
}
