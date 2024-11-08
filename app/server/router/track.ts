import { prasiApi } from "lib/server/server-route";
import { SessionContext } from "lib/session/type";
import { _fb_conversion_api } from "../fb-conversion-api";
import { EsensiSession } from "../session";

type argParamType = {
  session: EsensiSession | null;
  eventName: string;
  eventSourceUrl: string;
  ipAddress: string;
  userAgent: string;
};

export default prasiApi(async function (
  this: SessionContext<EsensiSession>,
  arg: {
    session: EsensiSession;
    eventName: string;
    eventSourceUrl: string;
  }
): Promise<any> {
  const { req, server } = this;
  const ipAddress = server.requestIP(req)?.address ?? "";
  const userAgent = req.headers.get("user-agent") || "";
  const argParam: argParamType = {
    ...arg,
    ipAddress,
    userAgent,
  };

  await _fb_conversion_api(argParam);
  return { ok: true };
});
