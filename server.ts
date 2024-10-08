import { UserData } from "app/lib/session";
import { useServerRouter } from "lib/server/server-route";
import { initSessionServer } from "lib/session/server-session";
import type {} from "./typings/global";
import { router } from "app/server/router";

export const server: PrasiServer = {
  async init() {
    initSessionServer<UserData>(this, {
      router: useServerRouter(router),
    });
  },
  async http({ req, handle, mode, url, server }) {
    return await this.session.handle({ req, handle, mode, url, server });
  },
};
