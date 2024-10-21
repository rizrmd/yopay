import { trxSalesStatus } from "app/enums";

export type trxSalesListResponse = {
  ok: boolean;
  count: number;
  data: any;
};

export default async function (
  customerId: string
): Promise<trxSalesListResponse> {
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
}
