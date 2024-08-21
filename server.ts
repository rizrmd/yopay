import { sessionServer } from "lib/server/server-session";
import type {} from "./typings/global";
import { UserData } from "app/lib/session";
import { useServerRoutes } from "lib/server/server-route";
import { routes } from "app/server/router";

const session = sessionServer<UserData>({
  router: useServerRoutes(routes),
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
