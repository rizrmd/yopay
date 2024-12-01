import { bundle, product } from "../../../typings/prisma";

type paramType = {
  authorId?: string;
  customerId?: string;
};

export const dashboard = {
  async todaySalesAmount(param: paramType): Promise<number> {
    let x: any[];
    if (param.authorId && param.customerId) {
      x =
        await db.$queryRaw`select coalesce(sum(l.total_price), 0) total from t_sales_line l join product p on p.id = l.id_product join t_sales s on s.id = l.id_sales where s.status = 'paid' and to_char(s.created_at, 'YYYY-MM-DD') = to_char(now(), 'YYYY-MM-DD') and p.id_author = ${param.authorId}::uuid and s.id_customer = ${param.customerId}::uuid`;
    } else if (param.authorId && !param.customerId) {
      x =
        await db.$queryRaw`select coalesce(sum(l.total_price), 0) total from t_sales_line l join product p on p.id = l.id_product join t_sales s on s.id = l.id_sales where s.status = 'paid' and to_char(s.created_at, 'YYYY-MM-DD') = to_char(now(), 'YYYY-MM-DD') and p.id_author = ${param.authorId}::uuid`;
    } else if (!param.authorId && param.customerId) {
      x =
        await db.$queryRaw`select coalesce(sum(l.total_price), 0) total from t_sales_line l join product p on p.id = l.id_product join t_sales s on s.id = l.id_sales where s.status = 'paid' and to_char(s.created_at, 'YYYY-MM-DD') = to_char(now(), 'YYYY-MM-DD') and s.id_customer = ${param.customerId}::uuid`;
    } else {
      x =
        await db.$queryRaw`select coalesce(sum(l.total_price), 0) total from t_sales_line l join product p on p.id = l.id_product join t_sales s on s.id = l.id_sales where s.status = 'paid' and to_char(s.created_at, 'YYYY-MM-DD') = to_char(now(), 'YYYY-MM-DD')`;
    }
    if (x?.length > 0) {
      return Number(x[0].total);
    }
    return 0;
  },
  async ydaySalesAmount(param: paramType): Promise<number> {
    const author = param?.authorId
      ? ` and p.id_author = '${param.authorId}'`
      : "";
    const customer = param?.customerId
      ? ` and s.id_customer = '${param.customerId}'`
      : "";
    let x: any[];
    if (param.authorId && param.customerId) {
      x =
        await db.$queryRaw`select coalesce(sum(l.total_price), 0) total from t_sales_line l join product p on p.id = l.id_product join t_sales s on s.id = l.id_sales where s.status = 'paid' and to_char(s.created_at, 'YYYY-MM-DD') = to_char(now() - interval '1 day', 'YYYY-MM-DD') and p.id_author = ${param.authorId}::uuid and s.id_customer = ${param.customerId}::uuid`;
    } else if (param.authorId && !param.customerId) {
      x =
        await db.$queryRaw`select coalesce(sum(l.total_price), 0) total from t_sales_line l join product p on p.id = l.id_product join t_sales s on s.id = l.id_sales where s.status = 'paid' and to_char(s.created_at, 'YYYY-MM-DD') = to_char(now() - interval '1 day', 'YYYY-MM-DD') and p.id_author = ${param.authorId}::uuid`;
    } else if (!param.authorId && param.customerId) {
      x =
        await db.$queryRaw`select coalesce(sum(l.total_price), 0) total from t_sales_line l join product p on p.id = l.id_product join t_sales s on s.id = l.id_sales where s.status = 'paid' and to_char(s.created_at, 'YYYY-MM-DD') = to_char(now() - interval '1 day', 'YYYY-MM-DD') and s.id_customer = ${param.customerId}::uuid`;
    } else {
      x =
        await db.$queryRaw`select coalesce(sum(l.total_price), 0) total from t_sales_line l join product p on p.id = l.id_product join t_sales s on s.id = l.id_sales where s.status = 'paid' and to_char(s.created_at, 'YYYY-MM-DD') = to_char(now() - interval '1 day', 'YYYY-MM-DD')`;
    }
    if (x?.length > 0) {
      return Number(x[0].total);
    }
    return 0;
  },
  async allTimeSalesAmount(param: paramType): Promise<number> {
    const author = param?.authorId
      ? ` and p.id_author = '${param.authorId}'`
      : "";
    const customer = param?.customerId
      ? ` and s.id_customer = '${param.customerId}'`
      : "";
    let x: any[];
    if (param.authorId && param.customerId) {
      x =
        await db.$queryRaw`select coalesce(sum(l.total_price), 0) total from t_sales_line l join product p on p.id = l.id_product join t_sales s on s.id = l.id_sales where s.status = 'paid' and p.id_author = ${param.authorId}::uuid and s.id_customer = ${param.customerId}::uuid`;
    } else if (param.authorId && !param.customerId) {
      x =
        await db.$queryRaw`select coalesce(sum(l.total_price), 0) total from t_sales_line l join product p on p.id = l.id_product join t_sales s on s.id = l.id_sales where s.status = 'paid' and p.id_author = ${param.authorId}::uuid`;
    } else if (!param.authorId && param.customerId) {
      x =
        await db.$queryRaw`select coalesce(sum(l.total_price), 0) total from t_sales_line l join product p on p.id = l.id_product join t_sales s on s.id = l.id_sales where s.status = 'paid' and s.id_customer = ${param.customerId}::uuid`;
    } else {
      x =
        await db.$queryRaw`select coalesce(sum(l.total_price), 0) total from t_sales_line l join product p on p.id = l.id_product join t_sales s on s.id = l.id_sales where s.status = 'paid'`;
    }
    if (x?.length > 0) {
      return Number(x[0].total);
    }
    return 0;
  },
  async mtdSalesAmount(param: paramType): Promise<number> {
    const author = param?.authorId
      ? ` and p.id_author = '${param.authorId}'`
      : "";
    const customer = param?.customerId
      ? ` and s.id_customer = '${param.customerId}'`
      : "";
    let x: any[];
    if (param.authorId && param.customerId) {
      x =
        await db.$queryRaw`select coalesce(sum(l.total_price), 0) total from t_sales_line l join product p on p.id = l.id_product join t_sales s on s.id = l.id_sales where s.status = 'paid' and created_at between date_trunc('month', now()) and p.id_author = ${param.authorId}::uuid and s.id_customer = ${param.customerId}::uuid`;
    } else if (param.authorId && !param.customerId) {
      x =
        await db.$queryRaw`select coalesce(sum(l.total_price), 0) total from t_sales_line l join product p on p.id = l.id_product join t_sales s on s.id = l.id_sales where s.status = 'paid' and created_at between date_trunc('month', now()) and p.id_author = ${param.authorId}::uuid`;
    } else if (!param.authorId && param.customerId) {
      x =
        await db.$queryRaw`select coalesce(sum(l.total_price), 0) total from t_sales_line l join product p on p.id = l.id_product join t_sales s on s.id = l.id_sales where s.status = 'paid' and created_at between date_trunc('month', now()) and s.id_customer = ${param.customerId}::uuid`;
    } else {
      x =
        await db.$queryRaw`select coalesce(sum(l.total_price), 0) total from t_sales_line l join product p on p.id = l.id_product join t_sales s on s.id = l.id_sales where s.status = 'paid' and created_at between date_trunc('month', now())`;
    }
    if (x?.length > 0) {
      return Number(x[0].total);
    }
    return 0;
  },
  async ytdSalesAmount(param: paramType): Promise<number> {
    const author = param?.authorId
      ? ` and p.id_author = '${param.authorId}'`
      : "";
    const customer = param?.customerId
      ? ` and s.id_customer = '${param.customerId}'`
      : "";
    let x: any[];
    if (param.authorId && param.customerId) {
      x =
        await db.$queryRaw`select coalesce(sum(l.total_price), 0) total from t_sales_line l join product p on p.id = l.id_product join t_sales s on s.id = l.id_sales where s.status = 'paid' and created_at between date_trunc('year', now()) and p.id_author = ${param.authorId}::uuid and s.id_customer = ${param.customerId}::uuid`;
    } else if (param.authorId && !param.customerId) {
      x =
        await db.$queryRaw`select coalesce(sum(l.total_price), 0) total from t_sales_line l join product p on p.id = l.id_product join t_sales s on s.id = l.id_sales where s.status = 'paid' and created_at between date_trunc('year', now()) and p.id_author = ${param.authorId}::uuid`;
    } else if (!param.authorId && param.customerId) {
      x =
        await db.$queryRaw`select coalesce(sum(l.total_price), 0) total from t_sales_line l join product p on p.id = l.id_product join t_sales s on s.id = l.id_sales where s.status = 'paid' and created_at between date_trunc('year', now()) and s.id_customer = ${param.customerId}::uuid`;
    } else {
      x =
        await db.$queryRaw`select coalesce(sum(l.total_price), 0) total from t_sales_line l join product p on p.id = l.id_product join t_sales s on s.id = l.id_sales where s.status = 'paid' and created_at between date_trunc('year', now())`;
    }
    if (x?.length > 0) {
      return Number(x[0].total);
    }
    return 0;
  },
  async top10ProductSales(): Promise<product[]> {
    return [];
  },
  async top10BudleSales(): Promise<bundle[]> {
    return [];
  },
};
