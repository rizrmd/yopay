import { trxSalesStatus } from "app/enums";
import { SessionContext } from "lib/session/type";
import { EsensiSession } from "../session";

export default async function (
  this: SessionContext<EsensiSession>,
  id_product: string,
  id_sales: string
): Promise<any> {
  const { req, server } = this;
  console.log('ip address', server.requestIP(req)?.address);
  console.log('api/download', id_product, id_sales)
  const product = await db.product.findFirst({
    where: { id: id_product },
  });
  console.log('product', product)
  if (product) {
    // await db.t_sales_download.create({
    //   data: {
    //     id_product,
    //     id_sales,
    //   },
    // });
  }
  return { hello: "world" };
}
