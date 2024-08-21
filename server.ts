import { sessionServer } from "lib/server/server-session";
import type {} from "./typings/global";
import { UserData } from "app/lib/session";
import { useServerRouter } from "lib/server/server-route";
import { router } from "app/server/router";

const session = sessionServer<UserData>({
  router: useServerRouter(router),
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
