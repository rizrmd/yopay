import { SessionContext } from "lib/session/type";
import { EsensiSession } from "../session";

export default async function (
  this: SessionContext<EsensiSession>,
  { phone, email, name }: { phone: string; email: string; name: string }
) {
  const customer = await db.customer.findFirst({
    where: { whatsapp: phone },
  });

  if (!customer) {
    
  }

  return { status: "ok" };
}

