import "@/utils/init";
import "app/css/build.css";
import "app/event";
import { lang } from "lib/lang";
export * from "@/exports";
export { icon } from "app/icon";
export { layoutStyle } from "app/layout-style";
export { session } from "app/session";

await lang.init("id");
