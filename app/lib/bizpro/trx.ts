import { createId } from "@paralleldrive/cuid2";
import { trxSalesStatus } from "app/enums";
import { CartItem } from "app/lib/bizpro/cart";

export type trxData = {
  id_customer: string;
  status: trxSalesStatus | string;
  total: number;
  currency: string;
  info: { cart: CartItem[] };
};

export type trxSalesAllPaidResponse = {
  ok: boolean;
  count: number;
  data: any;
};

export type trxSalesNotPaidResponse = {
  ok: boolean;
  count: number;
  data: { id: string; midtrans_order_id: string } | null;
};

export const trx = {
  create: async (data: trxData): Promise<trxSalesNotPaidResponse> => {
    const t_sales_lines = data.info.cart.map((x) => ({
      id_product: x.type === "product" ? x.id : undefined,
      id_bundle: x.type === "bundle" ? x.id : undefined,
      qty: 1,
      unit_price: Number(x.real_price),
      total_price: Number(x.real_price),
    }));
    let t_sales = await db.t_sales.create({
      data: {
        ...data,
        t_sales_line: {
          createMany: {
            skipDuplicates: true,
            data: t_sales_lines,
          },
        },
        midtrans_order_id: createId(),
      },
      select: { id: true, midtrans_order_id: true },
    });
    return t_sales
      ? {
          ok: true,
          count: 1,
          data: t_sales,
        }
      : { ok: true, count: 0, data: null };
  },
  update: async (
    data: trxData,
    id: string
  ): Promise<trxSalesNotPaidResponse> => {
    let t_sales = await db.t_sales.update({
      where: { id },
      data: { ...data, updated_at: new Date() },
      select: { id: true, midtrans_order_id: true },
    });
    return t_sales
      ? {
          ok: true,
          count: 1,
          data: t_sales,
        }
      : { ok: true, count: 0, data: null };
  },
  get: {
    allPaid: async (customerId: string): Promise<trxSalesAllPaidResponse> => {
      let t_sales_list = await db.t_sales.findMany({
        where: {
          id_customer: customerId,
          status: trxSalesStatus.PAID,
        },
        include: {
          t_sales_line: true,
        },
      });
      return t_sales_list && !!t_sales_list.length
        ? {
            ok: true,
            count: t_sales_list.length,
            data: t_sales_list,
          }
        : { ok: true, count: 0, data: null };
    },
    notPaid: async (customerId: string): Promise<trxSalesNotPaidResponse> => {
      let t_sales = await db.t_sales.findFirst({
        where: {
          id_customer: customerId,
          status: {
            not: trxSalesStatus.PAID,
          },
        },
        select: { id: true, midtrans_order_id: true },
      });
      return t_sales
        ? {
            ok: true,
            count: 1,
            data: t_sales,
          }
        : { ok: true, count: 0, data: null };
    },
  },
};
