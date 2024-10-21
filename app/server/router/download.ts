import { prasiApi } from "lib/server/server-route";
import { SessionContext } from "lib/session/type";
import { EsensiSession } from "../session";

export default prasiApi(async function (
  this: SessionContext<EsensiSession>,
  id_product: string,
  id_sales: string
): Promise<any> {
  const { req, server } = this;

  const product = await db.product.findFirst({
    where: {
      id: id_product,
    },
    select: {
      product_file: true,
    },
  });
  if (!product) return { ok: false, download: [] };
  const parsedArray = JSON.parse(product.product_file) as string[];
  await db.t_sales_download.create({
    data: {
      id_product,
      id_sales,
      ip_address: server.requestIP(req)?.address ?? ''
    },
  });
  return { ok: true, download: parsedArray };
});
