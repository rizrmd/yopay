import { SessionAuth, SessionContext } from "lib/session/type";
import { EsensiSession } from "../session";

export type LoginResult = { status: "ok" | "fail"; data: EsensiSession | null };

export default async function (
  this: SessionContext<EsensiSession>,
  auth: SessionAuth
): Promise<LoginResult> {
  const customer = await db.customer.findFirst({
    where: {
      whatsapp: auth.username,
    },
  });
  if (customer) {
    return {
      status: "ok",
      data: {
        uid: customer?.id,
        role: "customer",
        name: customer?.name,
        phone: customer?.whatsapp,
        email: customer?.email,
      },
    } as LoginResult;
  } else {
    return {
      status: "fail",
      data: null,
    } as LoginResult;
  }
}