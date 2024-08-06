import { prasi_events } from "lib/exports";

prasi_events("tablelist", "where", async (table, where) => {
  if (!["customer_track", "bundle_product", "sales_lines"].includes(table)) {
    where.deleted_at = { isNot: null };
  }
});
