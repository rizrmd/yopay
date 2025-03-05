import { prasiApi } from "lib/server/server-route";
import { SessionContext } from "lib/session/type";
import { EsensiSession } from "../session";
import { sendEmail } from "app/lib/bizpro/email";

export default prasiApi(async function (this: SessionContext<EsensiSession>) {
  const result = await sendEmail({
    to: "rizky05@gmail.com",
    subject: "haloha",
    body: "haloha",
  });

  return "as" + result;
});
