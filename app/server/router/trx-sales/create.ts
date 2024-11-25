import {
  trxData,
  trx,
  trxSalesNotPaidResponse,
} from "app/lib/bizpro/trx";

export default async function (
  data: trxData
): Promise<trxSalesNotPaidResponse> {
  return await trx.create(data);
}
