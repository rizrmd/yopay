export type CartItem = {
  id: string;
  name?: string;
  slug?: string;
  cover?: string;
  real_price?: number;
  currency?: string;
  type: "bundle" | "product";
};
export const cart = {
  items: [] as CartItem[],
  total: 0,
  currency: "",
  calculate() {
    let total = 0;
    for (const cur of this.items) {
      total += parseInt(cur.real_price + "");
      this.currency = cur.currency || "";
    }
    this.total = total;
  },
  async load() {
    const items: CartItem[] = [];
    const cart_raw = localStorage.getItem("esensi-cart");
    if (cart_raw) {
      try {
        const products: any[] = [];
        const bundles: any[] = [];
        JSON.parse(cart_raw).forEach((e: any) => {
          if (e.type === "product") products.push(e.id);
          if (e.type === "bundle") bundles.push(e.id);
        });
        items.splice(0);

        await Promise.all([
          db.product
            .findMany({
              where: { id: { in: products } },
              select: {
                id: true,
                name: true,
                slug: true,
                cover: true,
                real_price: true,
                currency: true,
              },
            })
            .then((all) => {
              all.forEach((item) => {
                items.push({
                  ...item,
                  real_price:
                    typeof item.real_price === "object"
                      ? item.real_price.toNumber()
                      : item.real_price,
                  type: "product",
                });
              });
            }),
          db.bundle
            .findMany({
              where: { id: { in: bundles } },
              select: {
                id: true,
                name: true,
                slug: true,
                cover: true,
                real_price: true,
                currency: true,
              },
            })
            .then((all) => {
              all.forEach((item) => {
                items.push({
                  ...item,
                  real_price:
                    typeof item.real_price === "object"
                      ? item.real_price.toNumber()
                      : item.real_price,
                  type: "bundle",
                });
              });
            }),
        ]);
      } catch (e) {}
    }
    this.items = items;
    this.calculate();
    return items;
  },
};
