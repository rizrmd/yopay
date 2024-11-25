import {
  trxData,
  trx,
  trxSalesNotPaidResponse,
} from "app/lib/bizpro/trx";

export default async function (
  data: trxData,
  id: string
): Promise<trxSalesNotPaidResponse> {
  return await trx.update(data, id);
}
