/// <reference types="bun-types" />

import { otp } from "../lib/otp";

export default async function (no_hp_or_email: string) {
  const user = await db.customer.findFirst({
    where: {
      OR: [{ email: no_hp_or_email }, { whatsapp: no_hp_or_email }],
    },
    select: {
      id: true,
    },
  });

  if (user) {
    await otp.send(user.id);
    return { uid: user.id };
  }
  return { status: "error", message: "User not found", uid: false };
}
