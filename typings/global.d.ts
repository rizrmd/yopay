//@ts-ignore
import type * as SRVAPI from "gen/srv/api/srv";
import { Server, WebSocketHandler } from "bun";
import prisma from "./prisma";
import { PrismaExtend } from "./prisma.ext";

declare global {
  type Api = typeof SRVAPI;
  type ApiName = keyof Api;
  const api: { [k in ApiName]: Awaited<Api[k]["handler"]>["_"]["api"] } & {
    _raw: any;
  };

  const prasi_internal: {
    page: { id: string };
  };

  const db: prisma.PrismaClient & PrismaExtend;
  interface PushNotificationSchema {
    title?: string;
    subtitle?: string;
    body?: string;
    id: string;
    tag?: string;
    badge?: number;
    notification?: any;
    data: any;
    click_action?: string;
    link?: string;
    group?: string;
    groupSummary?: boolean;
  }
  interface ActionPerformed {
    actionId: string;
    inputValue?: string;
    notification: PushNotificationSchema;
  }
  interface NOTIF_ARG {
    user_id: any;
    body: string;
    title: string;
    data?: any;
  }
  const notif:
    | {
        send: (data: NOTIF_ARG) => Promise<void>;
        register: (user_id: string) => void;
        onReceive: (notif: PushNotificationSchema) => void | Promise<void>;
        onTap: (notif: null | ActionPerformed) => void | Promise<void>;
      }
    | undefined;

  export interface PrasiServer extends Record<string, any> {
    ws?: WebSocketHandler<{ url: string }>;
    http: (arg: {
      url: { raw: URL; pathname: string };
      req: Request;
      server: Server;
      mode: "dev" | "prod";
      handle: (
        req: Request,
        opt?: {
          rewrite?: (arg: {
            body: Bun.BodyInit;
            headers: Headers | any;
          }) => Bun.BodyInit;
        }
      ) => Promise<Response>;
      serveStatic?: any;
      serveAPI?: any;
      index: { head: string[]; body: string[]; render: () => string };
      prasi: { page_id?: string; params?: Record<string, any> };
    }) => Promise<Response>;
    init?: (arg: { port?: number }) => Promise<void>;
  }

  type IItem = {
    id: string;
    name: string;
    type: "item" | "text";
    adv?: {
      js?: string;
      jsBuilt?: string;
      css?: string;
      html?: string;
    };
    text?: string;
    html?: string;
    component?: {
      id: string;
      props: Record<
        string,
        { type: "string" | "raw"; value: string; valueBuilt?: string }
      >;
    };
    childs: IItem[];
  };

  type SingleChange =
    | { type: "set"; name: string; value: any }
    | ({ type: "prop"; name: string } & PropVal)
    | { type: "child"; childs: SimpleItem[] };

  export type PropVal =
    | { mode: "string"; value: string }
    | { mode: "raw"; value: string; valueBuilt?: string }
    | { mode: "jsx"; value: null | (IItem & PrasiEdit) | SimpleItem };

  type ParentArg = {
    item: IItem & PrasiEdit;
    child_type: "jsx" | "child";
    child_idx: number;
  };

  type SimpleItem = Partial<Omit<IItem, "component">> & {
    component?: { id: string; props: Record<string, PropVal> };
  };

  export type PrasiEdit = {
    edit: {
      setValue: <T extends keyof IItem>(name: T, value: IItem[T]) => void;
      setProp: (name: string, value: PropVal | string) => void;
      pending: SingleChange[];
      childs: (IItem & PrasiEdit)[];
      setChilds: (childs: ((IItem & PrasiEdit) | SimpleItem)[]) => void;
      readonly parent: null | ParentArg;
      commit: () => Promise<void>;
      readonly props?: Record<string, PropVal>;
    };
  };

  type PrasiItem = IItem & PrasiEdit;
}
