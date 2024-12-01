import { UserData } from "app/lib/bizpro/session";
import { handleLanding, reloadLanding } from "app/server/landing";
import { router } from "app/server/router";
import { useServerRouter } from "lib/server/server-route";
import { initSessionServer } from "lib/session/server-session";
import { validate } from "uuid";

export const server: PrasiServer = {
  async init() {
    reloadLanding();
    initSessionServer<UserData>(this, {
      router: useServerRouter(router),
    });
  },
  async http(arg) {
    const { req, handle, mode, url, server } = arg;
    const landing = handleLanding(arg);

    if (landing) {
      return landing;
    }

    if (url.pathname.startsWith("/reload-landing/")) {
      const id = url.pathname.substring("/reload-landing/".length);
      if (validate(id)) {
        reloadLanding(id);
      }
      return new Response("ok");
    }

    return await this.session.handle({ req, handle, mode, url, server });
  },
};
