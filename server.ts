import { createSessionServer } from "lib/server/server-session";
import type {} from "./typings/global";
import { UserData } from "app/lib/session";
import { useServerRouter } from "lib/server/server-route";
import { router } from "app/server/router";

export const server: PrasiServer = {
  session: null as any,
  async init() {
    this.session = createSessionServer<UserData>({
      site_id: this.site_id,
      router: useServerRouter(router),
    });
  },
  async http({ req, handle, mode, url, index, server }) {
    return await this.session.handle({ req, handle, mode, url });
  },
};
