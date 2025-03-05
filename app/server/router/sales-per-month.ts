import { prasiApi } from "lib/server/server-route";
import { SessionContext } from "lib/session/type";
import { EsensiSession } from "../session";

export default prasiApi(async function (
  this: SessionContext<EsensiSession>,
  opt?: { month: number; year: number }
) {
  const { month, year } = opt || {};
  const sales = (await db.$queryRawUnsafe(`
    SELECT
      count(total) as count,
      EXTRACT(MONTH FROM created_at) as month,
      EXTRACT(YEAR FROM created_at) as year
    FROM t_sales
    WHERE
      status = 'paid'
      ${month ? `AND EXTRACT(MONTH FROM created_at) = ${month}` : ""}
      ${year ? `AND EXTRACT(YEAR FROM created_at) = ${year}` : ""}
    GROUP BY
      EXTRACT(MONTH FROM created_at),
      EXTRACT(YEAR FROM created_at)
    ORDER BY year DESC, month DESC
  `)) as { count: number; year: number; month: number; month_name: string }[];

  for (const row of sales) {
    row.month_name = new Date(2000, row.month - 1, 1).toLocaleString("en", {
      month: "short",
    });
  }

  return sales;
});
