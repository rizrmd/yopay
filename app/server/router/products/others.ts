import { trxSalesAllPaidResponse } from "app/lib/bizpro/trx";

export default async function (
  customerId?: string | { id: string; type: "product" | "bundle" }[]
): Promise<trxSalesAllPaidResponse> {
  if (customerId && Array.isArray(customerId)) {
    if (customerId.length === 0) {
      const productsCount = await db.product.count();
      const skip = Math.floor(Math.random() * productsCount);
      const data = await db.product.findMany({
        take: 5,
        skip: skip,
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
      return { ok: true, count: data.length, data };
    }
    const existingCart = customerId;

    const firstProduct = await db.product.findUnique({
      where: { id: existingCart[0].id },
      include: { product_category: true },
    });

    if (!firstProduct?.product_category?.[0]) {
      return { ok: true, count: 0, data: null };
    }

    const categoryId = firstProduct.product_category;
    const products = await db.product.findMany({
      where: {
        product_category: {
          some: {
            id_category: {
              in: categoryId.map((x) => x.id_category),
            },
          },
        },
      },
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
      take: 8,
    });

    if (products.length < 8) {
      const moreProducts = await db.product.findMany({
        where: {
          id: { notIn: products.map(p => p.id) }
        },
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
        take: 8 - products.length,
      });
      products.push(...moreProducts);
    }

    return { ok: true, count: products.length, data: products };
  }

  if (!customerId) {
    const productsCount = await db.product.count();
    const skip = Math.floor(Math.random() * productsCount);
    const data = await db.product.findMany({
      take: 5,
      skip: skip,
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
    return { ok: true, count: data.length, data };
  }

  // const xxx = await db.$queryRaw`select * from t_sales limit 1`
  // console.log(xxx)

  // get all t_sales of this customer
  let salesList = await db.t_sales.findMany({
    where: { id_customer: customerId },
    include: { t_sales_line: true },
  });
  if (!salesList) return { ok: true, count: 0, data: null };

  // get all product IDs from the above t_sales list
  const productIds: string[] = [];
  for (let i = 0; i < salesList.length; i++) {
    const lines = salesList[i].t_sales_line;
    for (let j = 0; j < lines.length; j++) {
      if (lines[j].id_product) {
        if (productIds.findIndex((y) => y === lines[j].id_product) < 0)
          productIds.push(lines[j].id_product!);
      } else if (lines[j].id_bundle) {
        let bundleProducts = await db.bundle_product.findMany({
          where: { id_bundle: lines[j].id_bundle! },
          select: { id_product: true },
        });
        if (productIds.findIndex((y) => y === lines[j].id_bundle) < 0)
          productIds.push(...bundleProducts.map((x) => x.id_product));
      }
    }
  }

  // get all in-cart products using IDs above
  const inCartProducts = await db.product.findMany({
    where: { id: { in: productIds } },
    include: { product_category: true },
  });
  if (!inCartProducts) return { ok: true, count: 0, data: null };

  // get all category IDs from the in-cart products above
  const categoryIds: string[] = [];
  for (let i = 0; i < inCartProducts.length; i++) {
    const categories = inCartProducts[i].product_category;
    for (let j = 0; j < categories.length; j++) {
      if (categoryIds.findIndex((y) => y === categories[j].id_category) < 0)
        categoryIds.push(categories[j].id_category);
    }
  }

  // get all product categories from the category IDs above
  const productCategories = await db.product_category.findMany({
    where: { id_category: { in: categoryIds } },
    include: { product: true },
  });
  if (!productCategories) return { ok: true, count: 0, data: null };

  // get all product IDs under the same categories
  const productIdsSameCategory: string[] = [];
  for (let i = 0; i < productCategories.length; i++) {
    const product = productCategories[i].product;
    if (productIdsSameCategory.findIndex((y) => y === product.id) < 0)
      productIdsSameCategory.push(product.id);
  }

  // get all products under the same categories
  const allProductsSameCategory = await db.product.findMany({
    where: { id: { in: productIdsSameCategory } },
  });
  if (!allProductsSameCategory) return { ok: true, count: 0, data: null };

  // subtract all products under the same categories with the in-cart products to find products that has never been bought yet for recommendation
  const inCartProductIds = inCartProducts.map((x) => x.id);
  const products = allProductsSameCategory
    .filter((x) => !inCartProductIds.includes(x.id))
    .map((x) => ({
      id: x.id,
      cover: x.cover,
      desc: x.desc,
      currency: x.currency,
      name: x.name,
      real_price: x.real_price,
      strike_price: x.strike_price,
      slug: x.slug,
    }));
  return !!products.length
    ? {
        ok: true,
        count: products.length,
        data: products,
      }
    : { ok: true, count: 0, data: [] };
}
