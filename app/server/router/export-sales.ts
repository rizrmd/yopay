import { prasiApi } from "lib/server/server-route";
import { SessionContext } from "lib/session/type";
import { EsensiSession } from "../session";
import ExcelJS from "exceljs";

export default prasiApi(async function (this: SessionContext<EsensiSession>) {
  const [month, year] = (this.url.pathname.split("/").pop()?.split("-") ||
    []) as [string, string];

  const sales = (await db.$queryRawUnsafe(
    `
    WITH items_info AS (
      SELECT 
        sl.id_sales,
        json_agg(
          CASE 
            WHEN p.id IS NOT NULL THEN p.name 
            ELSE b.name 
          END
        ) as items,
        array_agg(DISTINCT c.name) FILTER (WHERE c.id IS NOT NULL) as categories
      FROM t_sales_line sl
      LEFT JOIN product p ON sl.id_product = p.id
      LEFT JOIN bundle b ON sl.id_bundle = b.id
      LEFT JOIN product_category pc ON p.id = pc.id_product
      LEFT JOIN bundle_category bc ON b.id = bc.id_bundle
      LEFT JOIN category c ON c.id = pc.id_category OR c.id = bc.id_category
      GROUP BY sl.id_sales
    )
    SELECT 
      TO_CHAR(s.created_at, 'YYYY-MM-DD') as date,
      c.name,
      c.email,
      c.whatsapp as phone,
      s.total as amount,
      ii.items,
      (ii.categories)[1] as category_1,
      (ii.categories)[2] as category_2
    FROM t_sales s
    JOIN customer c ON s.id_customer = c.id 
    JOIN items_info ii ON s.id = ii.id_sales
    WHERE s.status = 'paid'
    AND EXTRACT(MONTH FROM s.created_at) = $1
    AND EXTRACT(YEAR FROM s.created_at) = $2
    ORDER BY s.created_at DESC
  `,
    parseInt(month),
    parseInt(year)
  )) as Array<Record<string, any>>;

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Sheet 1");

  const getAllKeys = (arr: Array<Record<string, any>>): string[] => {
    const keysSet = new Set<string>();

    arr.forEach((obj) => {
      Object.keys(obj).forEach((key) => keysSet.add(key));
    });

    return Array.from(keysSet);
  };

  const columns = getAllKeys(sales);
  worksheet.addRow(columns);

  sales.forEach((row) => {
    const values = columns.map((col) => row[col]);
    worksheet.addRow(values);
  });

  const buf = await workbook.xlsx.writeBuffer();

  return new Response(buf, {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="sales-${year}-${month}.xlsx"`,
    },
  });
});
