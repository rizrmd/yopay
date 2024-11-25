import { trxSalesAllPaidResponse } from "app/lib/bizpro/trx";

export default async function (
  category: string,
): Promise<trxSalesAllPaidResponse> {
  const cat = await db.category.findFirst({
    where: { name: category },
    include: { product_category: true },
  });

  const products = await db.product.findMany({
    where: { id: { in: cat?.product_category?.map((x) => x.id_product) } },
    select: {
      id: true,
      cover: true,
      desc: true,
      currency: true,
      name: true,
      real_price: true,
      strike_price: true,
      slug: true,
    },
  });
  return !!products.length
    ? {
        ok: true,
        count: products.length,
        data: products,
      }
    : { ok: true, count: 0, data: [] };
}
