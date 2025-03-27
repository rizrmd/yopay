import { trx, trxSalesAllPaidResponse } from "app/lib/bizpro/trx";

export default async function (
  customerId: string
): Promise<trxSalesAllPaidResponse> {
  console.log("as", customerId);

  const result = await trx.get.allPaid(customerId);
  return result;
}
