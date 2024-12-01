import { trxData, trx } from "app/lib/bizpro/trx";
import { _midtrans_pay } from "app/lib/bizpro/midtrans";
import { EsensiSession } from "app/server/session";
import { _server } from "../utils/_server";
import { createId } from "@paralleldrive/cuid2";

export type CartItem = {
  id: string;
  name?: string;
  slug?: string;
  cover?: string;
  real_price?: number;
  currency?: string;
  type: "bundle" | "product";
  bundleProducts?: string[]; // diisi jika type = "bundle"
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
  async load(): Promise<CartItem[]> {
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
            .then((all: any[]) => {
              all.forEach((item) => {
                items.push({
                  ...item,
                  real_price:
                    typeof item.real_price === "object"
                      ? item.real_price.toNumber()
                      : item.real_price,
                  type: "product",
                  bundleProducts: [],
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
                bundle_product: true,
              },
            })
            .then((all: any[]) => {
              all.forEach((item) => {
                items.push({
                  id: item.id,
                  name: item.name,
                  slug: item.slug,
                  cover: item.cover,
                  currency: item.currency,
                  real_price:
                    typeof item.real_price === "object"
                      ? item.real_price.toNumber()
                      : item.real_price,
                  type: "bundle",
                  bundleProducts: item.bundle_product.map(
                    (x: any) => x.id_product
                  ),
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
  async checkout(arg: {
    isAfterOtp: boolean;
    _session: { current: EsensiSession };
  }): Promise<boolean> {
    const _session = arg._session;
    const list = await this.load();
    if (!_session.current) return false;
    if (this.total <= 0) return false;
    let data: trxData = {
      id_customer: _session.current.uid!,
      status: "cart",
      total: this.total,
      currency: this.currency,
      info: { cart: list },
    };
    let res = await trx.get.notPaid(_session.current.uid!);
    let t_sales = null;

    if (!res.data?.midtrans_order_id && res.data) {
      res.data.midtrans_order_id = createId();
    }

    if (res.data) {
      const _res = await trx.update(data, res.data.id);
      t_sales = _res.data;
    } else {
      const _res = await trx.create(data);
      t_sales = _res.data;
    }
    if (!t_sales) return false;
    data.status = "paid";

    const result = await _midtrans_pay(t_sales.id, {
      transaction_details: {
        order_id: t_sales.midtrans_order_id,
        gross_amount: this.total,
      },
      credit_card: { secure: true },
      customer_details: {
        first_name: _session.current.name!,
        last_name: "",
        email: _session.current.email!,
        phone: _session.current.phone!,
      },
    });

    if (result.status === "success" && t_sales) {
      _server.track({
        session: _session.current,
        eventName:
          "Customer " +
          _session.current.email +
          ": Payment success for sales ID " +
          t_sales.id +
          " with gross amount " +
          cart.total,
        eventSourceUrl: "/checkout" + (arg.isAfterOtp ? "/:otp" : ""),
      });
      localStorage.removeItem("esensi-cart");
      await trx.update(data, t_sales.id);
      navigate("/download/" + t_sales.id);
      return true;
    } else if (result?.result) {
      alert(JSON.stringify(result?.result));
    } else if (result.status === "close") {
      history.back();
    }
    return false;
  },
};
