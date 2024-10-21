import { trxSalesListResponse } from "../trx-sales/get/all-paid";

export default async function (
  slug: string,
): Promise<trxSalesListResponse> {
  const cat = await db.category.findFirst({
    where: { slug },
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
