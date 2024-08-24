/// <reference types="bun-types" />

import { SessionContext } from "lib/server/server-route";
import { EsensiSession } from "../session";

export default async function (
  this: SessionContext<EsensiSession>,
  username: string,
  password: string
) {
  // this.session.create({
  //   uid: "ABC",
  //   role: "manager",
  //   data: { phone: "08123712371283" },
  // });

  const first = this.session.findFirst();
  // console.log(first)
  console.log(first?.destroy());

  return this.session.findMany().length;
}
