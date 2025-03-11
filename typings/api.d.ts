declare module "gen/srv/api/entry" {
    export * as srv from "gen/srv/api/srv";
}
  
declare module "pkgs/utils/dir" {
    export const dir: (path: string) => string;
}
declare module "app/db/db" {
    
}
declare module "pkgs/utils/kv" {
    import { Database } from "bun:sqlite";
    export interface Item<T> {
        key: string;
        value: T | undefined;
    }
    interface Options {
        readonly?: boolean;
        create?: boolean;
        readwrite?: boolean;
        ttlMs?: number;
    }
    export class BunSqliteKeyValue {
        db: Database;
        ttlMs: number | undefined;
        private deleteExpiredStatement;
        private deleteStatement;
        private clearStatement;
        private countStatement;
        private setItemStatement;
        private getItemStatement;
        private getAllItemsStatement;
        private getItemsStartsWithStatement;
        private getKeyStatement;
        private getAllKeysStatement;
        private getKeysStartsWithStatement;
        private countExpiringStatement;
        private deleteExpiringStatement;
        constructor(filename?: string, options?: Options);
        deleteExpired(): void;
        delete(keyOrKeys?: string | string[]): void;
        clear(): void;
        close(): void;
        getCount(): number;
        get length(): number;
        set<T = any>(key: string, value: T, ttlMs?: number): void;
        setValue: <T = any>(key: string, value: T, ttlMs?: number) => void;
        put: <T = any>(key: string, value: T, ttlMs?: number) => void;
        setItems<T = any>(items: {
            key: string;
            value: T;
            ttlMs?: number;
        }[]): void;
        get<T = any>(key: string): T | undefined;
        getValue: <T = any>(key: string) => T | undefined;
        getItem<T = any>(key: string): Item<T> | undefined;
        getItems<T = any>(startsWithOrKeys?: string | string[]): Item<T>[] | undefined;
        getItemsArray: <T = any>(startsWithOrKeys?: string | string[]) => Item<T>[] | undefined;
        getValues<T = any>(startsWithOrKeys?: string | string[]): (T | undefined)[] | undefined;
        getValuesArray: <T = any>(startsWithOrKeys?: string | string[]) => (T | undefined)[] | undefined;
        getItemsObject<T = any>(startsWithOrKeys?: string | string[]): {
            [key: string]: T | undefined;
        } | undefined;
        getItemsMap<T = any>(startsWithOrKeys?: string | string[]): Map<string, T | undefined> | undefined;
        getValuesSet<T = any>(startsWithOrKeys?: string | string[]): Set<T> | undefined;
        has(key: string): boolean;
        getKeys(startsWithOrKeys?: string | string[]): string[] | undefined;
        getExpiringItemsCount(): any;
        deleteOldExpiringItems(maxExpiringItemsInDb: number): void;
        deleteOldestExpiringItems: (maxExpiringItemsInDb: number) => void;
        getDataObject(): {
            [key: string]: any;
        };
        get dataObject(): {
            [key: string]: any;
        };
    }
}
declare module "pkgs/utils/global" {
    import { Server, Subprocess, WebSocketHandler } from "bun";
    import { Logger } from "pino";
    import { RadixRouter } from "radix3";
    
    import { Database } from "bun:sqlite";
    import admin from "firebase-admin";
    import { BunSqliteKeyValue } from "pkgs/utils/kv";
    type SingleRoute = {
        url: string;
        args: string[];
        raw: boolean;
        fn: (...arg: any[]) => Promise<any>;
        path: string;
    };
    export type SinglePage = {
        id: string;
        url: string;
        name: true;
        content_tree: any;
        is_default_layout: true;
    };
    type PrasiServer = {
        ws?: WebSocketHandler<{
            url: string;
        }>;
        http: (arg: {
            url: {
                raw: URL;
                pathname: string;
            };
            req: Request;
            
            mode: "dev" | "prod";
            handle: (req: Request, opt?: {
                rewrite?: (arg: {
                    body: Bun.BodyInit;
                    headers: Headers | any;
                }) => Bun.BodyInit;
            }) => Promise<Response>;
            index: {
                head: string[];
                body: string[];
                render: () => string;
            };
            prasi: {
                page_id?: string;
            };
        }) => Promise<Response>;
        init?: (arg: {
            port: number;
        }) => Promise<void>;
    };
    export const g: {
        
        kv: BunSqliteKeyValue;
        dburl: string;
        datadir: string;
        mode: "dev" | "prod";
        server: Server;
        log: Logger;
        firebaseInit: boolean;
        firebase: admin.app.App;
        skip_build_types: boolean;
        main: {
            process: null | Subprocess;
            slave_process: null | Subprocess;
            restart: {
                timeout: any;
            };
        };
        notif: {
            db: Database;
        };
        compress: {
            mode: "all" | "only-gz" | "off";
        };
        api: Record<string, SingleRoute>;
        api_gen: {
            "load.json": string;
            "load.js.dev": string;
            "load.js.prod": string;
        };
        web: {
            site_id: string;
            current: number;
            deploying: null | {
                status: string;
                received: number;
                total: number;
            };
            deploys: number[];
            router: RadixRouter<SingleRoute>;
        };
        router: RadixRouter<SingleRoute>;
        port: number;
        frm: {
            js: string;
            etag: string;
        };
        cache: {
            br: Record<string, Uint8Array>;
            br_progress: {
                pending: Record<string, any>;
                running: boolean;
                timeout: any;
            };
            gz: Record<string, Uint8Array>;
        };
        createServer: (arg: PrasiServer & {
            api: any;
            db: any;
        }) => (site_id: string) => Promise<PrasiServer & {
            api: any;
            db: any;
        }>;
        deploy: {
            init: boolean;
            raw: any;
            router?: RadixRouter<{
                url: string;
                id: string;
            }>;
            layout: null | any;
            comps: Record<string, any>;
            pages: Record<string, {
                id: string;
                url: string;
                name: true;
                content_tree: any;
            }>;
            content: null | {
                layouts: SinglePage[];
                pages: SinglePage[];
                site: any;
                comps: {
                    id: string;
                    content_tree: true;
                }[];
                public: Record<string, any>;
                code: {
                    server: Record<string, string>;
                    site: Record<string, string>;
                    core: Record<string, string>;
                };
            };
            config: {
                site_id: string;
                deploy: {
                    ts: string;
                };
            };
            server: PrasiServer | null;
        };
    };
}
declare module "pkgs/server/prep-api-ts" {
    import { g } from "pkgs/utils/global";
    export const prepareAPITypes: () => Promise<void>;
    export const getApiEntry: () => any;
    export const getContent: (type: keyof typeof g.api_gen, url?: string) => Promise<string>;
}
declare module "pkgs/api/_prasi" {
    export const _: {
        url: string;
        api(): Promise<any>;
    };
}
declare module "pkgs/api/_notif" {
    export const _: {
        url: string;
        api(action: string, data: {
            type: "register";
            token: string;
            id: string;
        } | {
            type: "send";
            id: string;
            body: string;
            title: string;
            data?: any;
        }): Promise<string[] | {
            result: string;
            error?: undefined;
            totalDevice?: undefined;
        } | {
            error: string;
            result?: undefined;
            totalDevice?: undefined;
        } | {
            result: string;
            totalDevice: any;
            error?: undefined;
        }>;
    };
}
declare module "pkgs/api/_dbs" {
    export const _: {
        url: string;
        raw: boolean;
        api(): Promise<any>;
    };
}
declare module "pkgs/api/_file" {
    export const _: {
        url: string;
        api(): Promise<Response>;
    };
}
declare module "pkgs/api/_api_frm" {
    export const _: {
        url: string;
        api(): Promise<void>;
    };
}
declare module "pkgs/api/_kv" {
    export const _: {
        url: string;
        raw: boolean;
        api(mode: "get" | "set" | "del", key: string, value?: any): Promise<Response>;
    };
}
declare module "pkgs/api/_finfo" {
    export const _: {
        url: string;
        api(): Promise<Response>;
    };
}
declare module "pkgs/api/_zip" {
    export const _: {
        url: string;
        raw: boolean;
        api(): Promise<Response>;
    };
}
declare module "pkgs/api/_upload" {
    export const _: {
        url: string;
        raw: boolean;
        api(body: any): Promise<Response>;
    };
}
declare module "pkgs/api/_deploy" {
    export const _: {
        url: string;
        api(action: ({
            type: "check";
        } | {
            type: "db-update";
            url: string;
        } | {
            type: "db-pull";
        } | {
            type: "db-gen";
        } | {
            type: "db-ver";
        } | {
            type: "db-sync";
            url: string;
        } | {
            type: "restart";
        } | {
            type: "domain-add";
            domain: string;
        } | {
            type: "domain-del";
            domain: string;
        } | {
            type: "deploy-del";
            ts: string;
        } | {
            type: "deploy";
            load_from?: string;
        } | {
            type: "deploy-status";
        } | {
            type: "redeploy";
            ts: string;
        }) & {
            id_site: string;
        }): Promise<any>;
    };
    export const downloadFile: (url: string, filePath: string, progress?: (rec: number, total: number) => void) => Promise<boolean>;
}
declare module "pkgs/api/_font" {
    export const _: {
        url: string;
        api(): Promise<Response>;
    };
}
declare module "pkgs/api/_proxy" {
    export const _: {
        url: string;
        raw: boolean;
        api(): Promise<Response>;
    };
}
declare module "pkgs/api/_img" {
    export const _: {
        url: string;
        api(): Promise<Response>;
    };
}
declare module "gen/srv/api/srv" {
    export const _prasi: {
        name: string;
        url: string;
        path: string;
        args: any[];
        handler: Promise<typeof import("pkgs/api/_prasi")>;
    };
    export const _notif: {
        name: string;
        url: string;
        path: string;
        args: string[];
        handler: Promise<typeof import("pkgs/api/_notif")>;
    };
    export const _dbs: {
        name: string;
        url: string;
        path: string;
        args: any[];
        handler: Promise<typeof import("pkgs/api/_dbs")>;
    };
    export const _file: {
        name: string;
        url: string;
        path: string;
        args: any[];
        handler: Promise<typeof import("pkgs/api/_file")>;
    };
    export const _api_frm: {
        name: string;
        url: string;
        path: string;
        args: any[];
        handler: Promise<typeof import("pkgs/api/_api_frm")>;
    };
    export const _kv: {
        name: string;
        url: string;
        path: string;
        args: string[];
        handler: Promise<typeof import("pkgs/api/_kv")>;
    };
    export const _finfo: {
        name: string;
        url: string;
        path: string;
        args: any[];
        handler: Promise<typeof import("pkgs/api/_finfo")>;
    };
    export const _zip: {
        name: string;
        url: string;
        path: string;
        args: any[];
        handler: Promise<typeof import("pkgs/api/_zip")>;
    };
    export const _upload: {
        name: string;
        url: string;
        path: string;
        args: string[];
        handler: Promise<typeof import("pkgs/api/_upload")>;
    };
    export const _deploy: {
        name: string;
        url: string;
        path: string;
        args: string[];
        handler: Promise<typeof import("pkgs/api/_deploy")>;
    };
    export const _font: {
        name: string;
        url: string;
        path: string;
        args: any[];
        handler: Promise<typeof import("pkgs/api/_font")>;
    };
    export const _proxy: {
        name: string;
        url: string;
        path: string;
        args: any[];
        handler: Promise<typeof import("pkgs/api/_proxy")>;
    };
    export const _img: {
        name: string;
        url: string;
        path: string;
        args: any[];
        handler: Promise<typeof import("pkgs/api/_img")>;
    };
}
