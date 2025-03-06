import { prasiApi } from "lib/server/server-route";
import { SessionContext } from "lib/session/type";
import { EsensiSession } from "../session";
import { sendEmail } from "app/lib/bizpro/email";

export default prasiApi(async function (
  this: SessionContext<EsensiSession>,
  arg: {
    to: string;
    subject: string;
    body: string;
  }
) {
  const result = await sendEmail(arg);

  return { result };
});
