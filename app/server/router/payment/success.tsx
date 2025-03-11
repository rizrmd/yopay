import { Column, Row, Section, Text } from "@react-email/components";
import type { CartItem } from "app/lib/bizpro/cart";
import { sendEmail } from "app/lib/bizpro/email";
import { generateReceipt } from "app/server/lib/gen-receipt";

export default async function (sales_id: string) {
  console.log(sales_id);
  const res = await db.t_sales.findFirst({
    where: {
      id: sales_id,
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

  console.log(res);
  if (res?.status !== "paid") {
    return {
      ok: false,
      status: "failed",
    };
  }

  const info = res?.info as unknown as { cart: CartItem[] };
  if (info && info.cart) {
    const struk = generateReceipt(info.cart, res?.midtrans_order_id || "");
    const formData = new FormData();

    formData.append("target", res.customer.whatsapp);
    formData.append(
      "message",
      `
Terima kasih telah berbelanja di Esensi Online! Berikut adalah
struk pembayaran Anda:

\`\`\`
${struk.receipt.trim()}
\`\`\`
`
    );
    fetch("https://api.fonnte.com/send", {
      method: "POST",
      body: formData,
      headers: {
        Authorization: "KTjWCiAsBZz8hKW8VZGm",
      },
    });

    sendEmail({
      to: res.customer.email,
      subject: "Struk Pembayaran Esensi: Rp. " + struk.total,
      body: (
        <>
          <Section>
            <Row>
              <Column>
                <Text>
                  Terima kasih telah berbelanja di Esensi Online! Berikut adalah
                  struk pembayaran Anda:
                </Text>
              </Column>
            </Row>
          </Section>
          <Section style={{ padding: "30px", background: "#ececeb" }}>
            <pre
              style={{
                fontFamily: "monospace",
                fontSize: "12px",
                lineHeight: "15px",
                textAlign: "left",
                margin: 0,
              }}
              dangerouslySetInnerHTML={{ __html: struk.receipt.trim() }}
            ></pre>
          </Section>
        </>
      ),
    });

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
