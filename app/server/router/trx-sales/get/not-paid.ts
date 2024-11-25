import { trx, trxSalesNotPaidResponse } from "app/lib/bizpro/trx";

export default async function (
  customerId: string
): Promise<trxSalesNotPaidResponse> {
  return await trx.get.notPaid(customerId);
}
