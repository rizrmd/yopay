import { SessionContext } from "lib/session/type";
import { EsensiSession } from "../session";

export default async function (
  this: SessionContext<EsensiSession>,
  customer: { phone: string; email: string; name: string }
) {
  return { status: "ok" };
}
