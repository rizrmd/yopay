import "@/utils/init";
import "app/css/build.css";
import "app/event";
import { lang } from "lib/lang/lang";
export * from "@/exports";
export { icon } from "app/icon";
export { layoutStyle } from "app/layout-style";

await lang.init("id");
