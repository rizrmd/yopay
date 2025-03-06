import { prasiApi } from "lib/server/server-route";
import { SessionContext } from "lib/session/type";
import { otp } from "../lib/otp";
import { EsensiSession } from "../session";

export default prasiApi(async function (
  this: SessionContext<EsensiSession>,
  { phone, email, name }: { phone: string; email: string; name: string }
) {
  const customer = await db.customer.findFirst({
    where: { whatsapp: phone },
  });
  if (!customer) {
    const whatsapp = "+62" + phone;
    const user = await db.customer.create({
      data: {
        name: name,
        email: email,
        whatsapp,
      },
      select: { id: true },
    });
    await otp.send(whatsapp);
    return { uid: user.id };
  }
});
