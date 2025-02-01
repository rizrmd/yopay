import { prasiApi } from "lib/server/server-route";
import { SessionContext } from "lib/session/type";
import { EsensiSession } from "../session";
import { createId } from "@paralleldrive/cuid2";
import sendCustomerWA from "../send-wa";

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

  await sendCustomerWA(
    id_customer,
    `\
Terima kasih telah membeli produk Esensi Semesta:
${product.name}

Klik link berikut ini (berlaku 1x download):
https://esensi.online/dl/${download_key}

Untuk download ulang silahkan login dan buka My Library di website https://esensi.online

Tips: simpan nomer ini untuk mempermudah download, tinggal klik.
`
  );

  return { ok: true };
});
