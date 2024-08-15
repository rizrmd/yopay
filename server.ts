import { sessionServer } from "lib/session/server";
import type {} from "./typings/global";
import { UserData } from "app/session";

const session = sessionServer<UserData>({
  on: {
    async login(arg) {
      return false;
    },
  },
});
export const server: PrasiServer = {
  async http({ req, handle, mode, url, index, server }) {
    return await session.handle({ req, handle, mode, url });
  },
};
