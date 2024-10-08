import { trxSalesStatus } from "app/enums";

export type trxSalesListResponse = {
  ok: boolean;
  count: number;
  data: any;
  // data:
  //   | {
  //       id: string;
  //       sales_lines: {
  //         id: string;
  //         unit_price: number;
  //         qty: number;
  //         total_price: number;
  //       }[];
  //     }[]
  //   | null;
};

export default async function (
  customerId: string
): Promise<trxSalesListResponse> {
  let t_sales_list = await db.t_sales.findMany({
    where: {
      id_customer: customerId,
      status: trxSalesStatus.PAID,
    },
    select: { id: true },
  });
  if (t_sales_list) {
    for (let i = 0; i < t_sales_list.length; i++) {
      const lines = await db.t_sales_line.findMany({
        where: {
          id_sales: t_sales_list[i].id
        }
      });
      t_sales_list[i].lines = lines;
    }
  }
  return t_sales_list && !!t_sales_list.length
    ? {
        ok: true,
        count: t_sales_list.length,
        data: t_sales_list,
      }
    : { ok: true, count: 0, data: null };
}
