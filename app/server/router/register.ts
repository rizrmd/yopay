import { prasiApi } from "lib/server/server-route";
import { SessionContext } from "lib/session/type";
import { EsensiSession } from "../session";
import { otp } from "../lib/otp";

export default prasiApi(async function (
  this: SessionContext<EsensiSession>,
  { phone, email, name }: { phone: string; email: string; name: string }
): Promise<void> {
  const customer = await db.customer.findFirst({
    where: { whatsapp: phone },
  });
  if (!customer) {
    const whatsapp = "+62" + phone;
    await db.customer.create({
      data: {
        name: name,
        email: email,
        whatsapp,
      },
      select: { id: true },
    });
    const res = await otp.send(whatsapp);
    navigate("/checkout/otp", {
      where: { whatsapp, otp: res },
    });
  }
});
