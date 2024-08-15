import { sessionServer } from "lib/session/server";
import type {} from "./typings/global";

const session = sessionServer({});
export const server: PrasiServer = {
  async http({ req, handle, mode, url, index, server }) {
    return await session.handle({ req, handle, mode, url });
  },
};
