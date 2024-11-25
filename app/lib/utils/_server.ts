import { router } from "app/server/router";
import { newEsensiSession } from "app/server/session";
import { newClientRouter } from "lib/server/server-route";

export const _server = newClientRouter(router);
export const _session = newEsensiSession(router);
