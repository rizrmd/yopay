import { customer } from "../../../typings/prisma";

export interface UserData {
  uid?: string;
  role?: string;
  name?: string;
}

interface Result {
  customer?: any;
}

export async function checkSession(phone: string): Promise<customer | null> {
  if (!phone) return null;
  return await db.customer.findFirst({
    where: { whatsapp: phone, deleted_at: null },
  });
}