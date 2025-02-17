export const slugs = {} as Record<
  string,
  {
    price: number;
    title: string;
    desc: string;
    category: string;
    cover: string;
    sku: string;
  }
>;

export const microTag = () => {};

export const reloadSlugs = async () => {
  const existing = [
    ...(
      await db.product.findMany({
        where: { status: "published" },
        select: {
          slug: true,
          product_category: {
            select: { category: { select: { name: true } } },
          },
          id: true,
          desc: true,
          sku: true,
          name: true,
          strike_price: true,
          real_price: true,
          cover: true,
        },
      })
    ).map((e: any) => ({
      ...e,
      category: e.product_category.map((e: any) => e.category.name),
    })),
    ...(
      await db.bundle.findMany({
        where: { status: "published" },
        select: {
          slug: true,
          bundle_category: { select: { category: { select: { name: true } } } },
          id: true,
          desc: true,
          sku: true,
          name: true,
          strike_price: true,
          real_price: true,
          cover: true,
        },
      })
    ).map((e: any) => ({
      ...e,
      category: e.bundle_category.map((e: any) => e.category.name),
    })),
  ];

  for (const e of existing) {
    e.desc = e.desc.replace(/<[^>]*>/g, "").split("\n")[0];

    slugs[e.slug] = {
      price: Number(e.real_price || e.strike_price || 0),
      title: e.name,
      desc: e.desc,
      category: e.category.join(", "),
      cover: e.cover,
      sku: e.sku || e.id,
    };
  }
};
