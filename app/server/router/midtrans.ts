import { SessionAuth, SessionContext } from "lib/session/type";
import { EsensiSession } from "../session";

export default async function (this: SessionContext<EsensiSession>) {
  return {
    _midtrans_mode: process.env._midtrans_mode || 'mode',
    _midtrans_clientKey: process.env._midtrans_clientKey,
    _midtrans_serverKey: process.env._midtrans_serverKey,
    _midtrans_base64AuthHeader: process.env._midtrans_base64AuthHeader,
  };
}
