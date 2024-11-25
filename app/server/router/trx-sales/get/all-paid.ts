import { trx, trxSalesAllPaidResponse } from "app/lib/bizpro/trx";

export default async function (
  customerId: string
): Promise<trxSalesAllPaidResponse> {
  return await trx.get.allPaid(customerId);
}
