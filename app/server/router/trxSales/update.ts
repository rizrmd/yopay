import { trxData } from "./create";
import { trxSalesResponse } from "./get/not-paid";

export default async function (data: trxData, id: string): Promise<trxSalesResponse> {
  let t_sales = await db.t_sales.update({
    where: { id },
    data: { ...data, updated_at: new Date() },
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
