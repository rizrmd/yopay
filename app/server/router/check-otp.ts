/// <reference types="bun-types" />

import { otp } from "../lib/otp";

export default async function (opt: { whatsapp?: string; otp: number }) {
  const customer = await db.customer.findFirst({
    where: { whatsapp: opt.whatsapp, otp: opt.otp },
  });

  if (customer) {
    db.customer.update({ where: { id: customer.id }, data: { otp: null } });

    return true;
  }
}
