/// <reference types="bun-types" />

import { SessionContext } from "lib/server/server-route";
import { EsensiSession } from "../session";
import dayjs from "dayjs";

export default async function (
  this: SessionContext<EsensiSession>,
  username: string,
  password: string
) {
  this.session.create({
    uid: "ABC",
    role: "manager",
    expired_at: dayjs().add(1, "day").unix(),
  });
  return "andinoa";
}
