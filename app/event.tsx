import { prasi_events } from "lib/exports";

prasi_events("tablelist", "where", async (table, where) => {
  if (!["customer_track", "bundle_product", "sales_lines"].includes(table)) {
    where.deleted_at = null;
  }
});

prasi_events("form", "before_delete", async (md, fm) => {
  if (["product"].includes(fm.props.gen_table) && fm.data.id) {
    await db[fm.props.gen_table].update({
      where: {
        id: fm.data.id,
      },
      data: { deleted_at: new Date() },
      select: { id: true },
    });

    return { preventDelete: true, navigateBack: true };
  }
  return { preventDelete: false, navigateBack: true };
});
