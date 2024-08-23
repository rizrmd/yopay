import { SessionData } from "lib/server/server-session";

export type EsensiSession = SessionData<{
  name: string;
  phone: string;
  email: string;
}>;
