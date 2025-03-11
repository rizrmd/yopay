import { createId } from "@paralleldrive/cuid2";
import { Hr, Link, Preview, Text } from "@react-email/components";
import { sendEmail } from "app/lib/bizpro/email";
import { prasiApi } from "lib/server/server-route";
import { SessionContext } from "lib/session/type";
import { Section } from "lucide-react";
import { EsensiSession } from "../session";

export default prasiApi(async function (
  this: SessionContext<EsensiSession>,
  id_product: string,
  id_customer: string
): Promise<any> {
  const { req, server } = this;
  const product = await db.product.findFirst({
    where: {
      id: id_product,
    },
    select: {
      name: true,
    },
  });
  if (!product) return { ok: false, download: [] };
  const existing = await db.t_sales_download.findFirst({
    where: {
      id_product,
      id_customer,
      downloaded_at: null,
    },
  });

  let download_key = "";
  if (!existing) {
    const new_dl = await db.t_sales_download.create({
      data: {
        id_product,
        id_customer,
        ip_address: server.requestIP(req)?.address ?? "",
        download_key: createId(),
        downloaded_at: null,
      },
    });
    download_key = new_dl.download_key;
  } else {
    download_key = existing.download_key;
  }

  const u = await db.customer.findFirst({
    where: { id: id_customer },
    select: {
      whatsapp: true,
      email: true,
    },
  });
  if (u) {
    sendEmail({
      to: u.email,
      subject: `Download Ebook [${product.name.substring(0, 25)}...]`,
      body: (
        <>
          <Preview>Download EBook {product.name}</Preview>
          <Text
            style={{
              fontSize: "20px",
              lineHeight: "28px",
              marginBottom: "30px",
            }}
          >
            Klik link berikut untuk mendownload:
          </Text>

          <Text style={{ marginTop: "10px" }}>{product.name}</Text>
          <Section style={{ marginTop: "10px", marginBottom: "10px" }}>
            <Link
              style={{
                background: "#4474e0",
                color: "white",
                padding: "10px",
                textDecoration: "underline",
              }}
              href={`https://esensi.online/dl/${download_key}`}
            >
              Download E-Book
            </Link>
          </Section>
          <Hr className="border-t border-gray-300 mt-[20px]" />
          <Text style={{ marginTop: "10px" }}>
            Jika link diatas tidak bekerja, silahkan copy paste link berikut ini
          </Text>
          <Text>https://esensi.online/dl/{download_key}</Text>

          <Text style={{ marginTop: "10px" }}>
            Link ini hanya berlaku untuk 1x download.
          </Text>
          <Text style={{ marginTop: "10px" }}>
            Untuk download ulang silahkan login dan buka My Library di website
            https://esensi.online Tips: simpan nomer ini untuk mempermudah
            download, tinggal klik.
          </Text>
        </>
      ),
    });

    const formData = new FormData();
    formData.append("target", u.whatsapp);
    formData.append(
      "message",
      `\
      Terima kasih telah membeli produk Esensi Semesta:
      ${product.name}
      
      Klik link berikut ini (berlaku 1x download):
      https://esensi.online/dl/${download_key}
      
      Untuk download ulang silahkan login dan buka My Library di website https://esensi.online
      
      Tips: simpan nomer ini untuk mempermudah download, tinggal klik.
      `
    );
    await fetch("https://api.fonnte.com/send", {
      method: "POST",
      body: formData,
      headers: {
        Authorization: "KTjWCiAsBZz8hKW8VZGm",
      },
    });
  }

  return { ok: true };
});
