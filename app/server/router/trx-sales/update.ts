import {
  trxData,
  trx,
  trxSalesNotPaidResponse,
} from "app/lib/trx";

export default async function (
  data: trxData,
  id: string
): Promise<trxSalesNotPaidResponse> {
  return await trx.update(data, id);
}
