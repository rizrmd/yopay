import { CartItem } from "app/lib/bizpro/cart";
import { prasiApi } from "lib/server/server-route";
import { SessionContext } from "lib/session/type";
import { EsensiSession } from "../../session";
import { sendEmail } from "app/lib/bizpro/email";
import { templatePesanan } from "./template/pesanan";

export default prasiApi(async function (
  this: SessionContext<EsensiSession>,
  sales_id: string
) {
  let id = sales_id;
  if (!sales_id) {
    const parts = this.req.url.split("/");
    id = parts[parts.length - 1];
  }
  if (!id) {
    return {
      ok: false,
      status: "failed",
    };
  }

  const sales = await db.t_sales.findFirst({
    where: {
      id,
    },
    select: { id: true, info: true, customer: { select: { email: true } } },
  });

  if (sales) {
    const info = sales.info as { cart: CartItem[] };

    const result = await sendEmail({
      body: templatePesanan(info.cart),
      to: sales.customer.email,
      subject: "Esensi: Menunggu Pembayaran ",
      raw: true,
    });

    return { result };
  }
});
