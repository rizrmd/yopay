import { UserData } from "app/lib/bizpro/session";
import { newClientSession } from "lib/session/client-session";
import type { LoginResult } from "app/server/router/login";

export interface EsensiSession extends Partial<UserData> {
  phone?: string;
  email?: string;
}

export const newEsensiSession = (router: any) => {
  return newClientSession<EsensiSession>({
    tracker: { enabled: true },
    route: {
      login: router.login,
    },
    on: {
      async afterInit(session) {
        const load = await session.load();
        if (load) {
          session.current = load;
          session.status = "active";
        } else {
          session.status = "guest";
        }
      },
      async save(data) {
        localStorage.setItem("esensi-ses", JSON.stringify(data));
      },
      async load() {
        const ses = localStorage.getItem("esensi-ses");
        if (ses) {
          try {
            return JSON.parse(ses);
          } catch (e) {}
        }
        return null;
      },
      async clear() {
        localStorage.setItem("esensi-ses", "null");
      },
      async afterLogin(result: LoginResult, session) {
        if (result.status === "ok") {
          const ses_data: EsensiSession = { ...result.data };
          session.save(ses_data);
          session.status = "active";
          session.current = ses_data;
          // navigate("/home");
        } else {
          session.status = "guest";
          session.clear();
        }
      },
      async afterLogout(session) {
        if (typeof window !== 'undefined' && !(window as any).isEditor) {
          session.status = "guest";
          this.clear();
          location.reload();
        }
      },
    },
  });
};
