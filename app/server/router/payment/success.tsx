import type { CartItem } from "app/lib/bizpro/cart";
import { sendEmail } from "app/lib/bizpro/email";
import { generateReceipt } from "app/server/lib/gen-receipt";
import { EsensiSession } from "app/server/session";
import { prasiApi } from "lib/server/server-route";
import { SessionContext } from "lib/session/type";
import { templateTerimaKasih } from "./template/terimakasih";

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

  const res = await db.t_sales.findFirst({
    where: {
      id: id,
    },
    select: {
      customer: {
        select: {
          email: true,
          whatsapp: true,
        },
      },
      midtrans_order_id: true,
      info: true,
      status: true,
    },
  });

  if (res?.status !== "paid") {
    return {
      ok: false,
      status: "failed",
    };
  }

  const info = res?.info as unknown as { cart: CartItem[] };
  if (info && info.cart && res?.customer && res) {
    const struk = generateReceipt(info.cart, res?.midtrans_order_id || "");
    const formData = new FormData();

    formData.append("target", res.customer.whatsapp);
    formData.append(
      "message",
      `
Terima kasih telah berbelanja di Esensi Online!
Berikut adalah struk pembayaran Anda:

\`\`\`
${struk.receipt.trim()}
\`\`\`
`
    );
    await fetch("https://api.fonnte.com/send", {
      method: "POST",
      body: formData,
      headers: {
        Authorization: "KTjWCiAsBZz8hKW8VZGm",
      },
    });

    await sendEmail({
      to: res.customer.email,
      subject: "Esensi: Pembayaran Berhasil Rp. " + struk.total,
      body: templateTerimaKasih(info.cart),
      raw: true
    });

    return {
      ok: true,
      status: "completed",
    };
  } else {
    return {
      ok: false,
      status: "failed",
    };
  }
});
