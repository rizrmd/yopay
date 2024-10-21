import { trxSalesStatus } from "app/enums";

export type trxSalesResponse = {
  ok: boolean;
  count: number;
  data: { id: string } | null;
};

export default async function (customerId: string): Promise<trxSalesResponse> {
  let t_sales = await db.t_sales.findFirst({
    where: {
      id_customer: customerId,
      status: {
        not: trxSalesStatus.PAID,
      },
    },
    select: { id: true },
  });
  return t_sales
    ? {
        ok: true,
        count: 1,
        data: t_sales,
      }
    : { ok: true, count: 0, data: null };
}
