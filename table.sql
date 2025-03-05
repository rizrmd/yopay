-- Adminer 4.8.1 PostgreSQL 16.6 dump

CREATE TABLE "public"."author" (
    "id" uuid DEFAULT gen_random_uuid() NOT NULL,
    "id_user" uuid NOT NULL,
    "name" text NOT NULL,
    CONSTRAINT "author_id" PRIMARY KEY ("id")
) WITH (oids = false);


CREATE TABLE "public"."banner" (
    "id" uuid DEFAULT gen_random_uuid() NOT NULL,
    "title" text NOT NULL,
    "banner_file" text DEFAULT '[]' NOT NULL,
    "status" character varying DEFAULT 'ON',
    "deleted_at" timestamp,
    "link" text,
    CONSTRAINT "banner_id" PRIMARY KEY ("id")
) WITH (oids = false);

COMMENT ON COLUMN "public"."banner"."status" IS 'OFF, ON';


CREATE TABLE "public"."bundle" (
    "id" uuid DEFAULT gen_random_uuid() NOT NULL,
    "name" text NOT NULL,
    "slug" text NOT NULL,
    "strike_price" numeric(18,2),
    "real_price" numeric(18,2) NOT NULL,
    "currency" character varying(3) DEFAULT 'Rp.' NOT NULL,
    "desc" text DEFAULT '' NOT NULL,
    "info" jsonb DEFAULT '{}' NOT NULL,
    "deleted_at" timestamp,
    "status" character varying(10) DEFAULT 'draft' NOT NULL,
    "img_file" text DEFAULT '[]' NOT NULL,
    "cover" text DEFAULT '' NOT NULL,
    "sku" text DEFAULT '' NOT NULL,
    CONSTRAINT "bundle_id" PRIMARY KEY ("id")
) WITH (oids = false);

COMMENT ON COLUMN "public"."bundle"."status" IS 'draft, published';


CREATE TABLE "public"."bundle_category" (
    "id" uuid DEFAULT gen_random_uuid() NOT NULL,
    "id_category" uuid NOT NULL,
    "id_bundle" uuid NOT NULL,
    CONSTRAINT "bundle_category_id" PRIMARY KEY ("id")
) WITH (oids = false);


CREATE TABLE "public"."bundle_product" (
    "id_bundle" uuid NOT NULL,
    "id_product" uuid NOT NULL,
    "id" uuid DEFAULT gen_random_uuid() NOT NULL,
    "qty" smallint DEFAULT '1',
    CONSTRAINT "bundle_product_id" PRIMARY KEY ("id")
) WITH (oids = false);


CREATE TABLE "public"."category" (
    "id" uuid DEFAULT gen_random_uuid() NOT NULL,
    "name" text NOT NULL,
    "id_parent" uuid,
    "deleted_at" timestamp,
    "slug" text,
    "img" text,
    CONSTRAINT "category_id" PRIMARY KEY ("id")
) WITH (oids = false);


CREATE TABLE "public"."customer" (
    "id" uuid DEFAULT gen_random_uuid() NOT NULL,
    "name" text NOT NULL,
    "email" text NOT NULL,
    "whatsapp" text NOT NULL,
    "deleted_at" timestamp,
    "otp" smallint,
    CONSTRAINT "customer_id" PRIMARY KEY ("id")
) WITH (oids = false);


CREATE TABLE "public"."customer_track" (
    "id" uuid DEFAULT gen_random_uuid() NOT NULL,
    "ts" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "id_customer" uuid NOT NULL,
    "path" text NOT NULL,
    "referrer" text NOT NULL,
    "info" jsonb NOT NULL,
    "ip" character varying(40) NOT NULL,
    CONSTRAINT "customer_track_id" PRIMARY KEY ("id")
) WITH (oids = false);


CREATE TABLE "public"."landing" (
    "id" uuid DEFAULT gen_random_uuid() NOT NULL,
    "slug" text NOT NULL,
    "views" integer NOT NULL,
    "deleted_at" timestamp,
    "status" text DEFAULT 'published' NOT NULL,
    "title" text DEFAULT '' NOT NULL,
    CONSTRAINT "landing_page_id" PRIMARY KEY ("id")
) WITH (oids = false);

COMMENT ON COLUMN "public"."landing"."status" IS 'draft, published';


CREATE TABLE "public"."landing_items" (
    "id" uuid DEFAULT gen_random_uuid() NOT NULL,
    "desc" text DEFAULT '' NOT NULL,
    "img_file" text NOT NULL,
    "tag" text DEFAULT 'h1' NOT NULL,
    "link_to" text NOT NULL,
    "landing_id" uuid NOT NULL,
    "idx" smallint DEFAULT '1' NOT NULL,
    "color" text DEFAULT '#ffffff' NOT NULL,
    CONSTRAINT "landing_items_id" PRIMARY KEY ("id")
) WITH (oids = false);

COMMENT ON COLUMN "public"."landing_items"."tag" IS 'h1,h2,h3,p';


CREATE TABLE "public"."midtrx" (
    "id" uuid DEFAULT gen_random_uuid() NOT NULL,
    "tz" timestamptz DEFAULT now() NOT NULL,
    "type" text NOT NULL,
    "payload" jsonb NOT NULL,
    CONSTRAINT "midtrx_id" PRIMARY KEY ("id")
) WITH (oids = false);


CREATE TABLE "public"."product" (
    "id" uuid DEFAULT gen_random_uuid() NOT NULL,
    "name" text NOT NULL,
    "slug" text NOT NULL,
    "strike_price" numeric(18,2),
    "real_price" numeric(18,2) NOT NULL,
    "desc" text DEFAULT '' NOT NULL,
    "info" jsonb DEFAULT '{}' NOT NULL,
    "status" character varying(10) DEFAULT 'draft' NOT NULL,
    "currency" character varying(3) DEFAULT 'Rp.' NOT NULL,
    "deleted_at" timestamp,
    "img_file" text DEFAULT '' NOT NULL,
    "cover" text DEFAULT '' NOT NULL,
    "product_file" text DEFAULT '[]' NOT NULL,
    "sku" text DEFAULT '' NOT NULL,
    "id_author" uuid,
    "published_date" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT "product_id" PRIMARY KEY ("id")
) WITH (oids = false);

COMMENT ON COLUMN "public"."product"."status" IS 'draft, published';


CREATE TABLE "public"."product_category" (
    "id_product" uuid NOT NULL,
    "id_category" uuid NOT NULL,
    "id" uuid DEFAULT gen_random_uuid() NOT NULL,
    CONSTRAINT "product_category_id" PRIMARY KEY ("id")
) WITH (oids = false);


CREATE TABLE "public"."t_sales" (
    "id" uuid DEFAULT gen_random_uuid() NOT NULL,
    "id_customer" uuid NOT NULL,
    "status" character varying(10) DEFAULT 'cart' NOT NULL,
    "total" numeric(18,2) NOT NULL,
    "currency" character varying(3) DEFAULT 'Rp.' NOT NULL,
    "info" jsonb NOT NULL,
    "created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" timestamp,
    "deleted_at" timestamp,
    "midtrans_order_id" text DEFAULT '' NOT NULL,
    "midtrans_success" jsonb,
    "midtrans_pending" jsonb,
    "midtrans_error" jsonb,
    CONSTRAINT "sales_id" PRIMARY KEY ("id")
) WITH (oids = false);

COMMENT ON COLUMN "public"."t_sales"."status" IS 'cart, expired, paid, void';


CREATE TABLE "public"."t_sales_download" (
    "id" uuid DEFAULT gen_random_uuid() NOT NULL,
    "id_product" uuid NOT NULL,
    "id_customer" uuid NOT NULL,
    "downloaded_at" timestamp,
    "ip_address" text,
    "download_key" text DEFAULT '' NOT NULL,
    CONSTRAINT "t_sales_product_id" PRIMARY KEY ("id")
) WITH (oids = false);


CREATE TABLE "public"."t_sales_line" (
    "id" uuid DEFAULT gen_random_uuid() NOT NULL,
    "id_sales" uuid NOT NULL,
    "unit_price" numeric(18,2) NOT NULL,
    "qty" integer NOT NULL,
    "total_price" numeric(18,2) NOT NULL,
    "id_product" uuid,
    "id_bundle" uuid,
    CONSTRAINT "sales_line_id" PRIMARY KEY ("id")
) WITH (oids = false);


CREATE TABLE "public"."user" (
    "id" uuid DEFAULT gen_random_uuid() NOT NULL,
    "username" text NOT NULL,
    "password" text NOT NULL,
    "role" character varying(10) DEFAULT 'admin' NOT NULL,
    CONSTRAINT "m_user_id" PRIMARY KEY ("id")
) WITH (oids = false);


ALTER TABLE ONLY "public"."author" ADD CONSTRAINT "author_id_user_fkey" FOREIGN KEY (id_user) REFERENCES "user"(id) NOT DEFERRABLE;

ALTER TABLE ONLY "public"."bundle_category" ADD CONSTRAINT "bundle_category_id_bundle_fkey" FOREIGN KEY (id_bundle) REFERENCES bundle(id) NOT DEFERRABLE;
ALTER TABLE ONLY "public"."bundle_category" ADD CONSTRAINT "bundle_category_id_category_fkey" FOREIGN KEY (id_category) REFERENCES category(id) NOT DEFERRABLE;

ALTER TABLE ONLY "public"."bundle_product" ADD CONSTRAINT "bundle_product_id_bundle_fkey" FOREIGN KEY (id_bundle) REFERENCES bundle(id) ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE;
ALTER TABLE ONLY "public"."bundle_product" ADD CONSTRAINT "bundle_product_id_product_fkey" FOREIGN KEY (id_product) REFERENCES product(id) ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE;

ALTER TABLE ONLY "public"."category" ADD CONSTRAINT "category_id_parent_fkey" FOREIGN KEY (id_parent) REFERENCES category(id) NOT DEFERRABLE;

ALTER TABLE ONLY "public"."customer_track" ADD CONSTRAINT "customer_track_id_customer_fkey" FOREIGN KEY (id_customer) REFERENCES customer_track(id) ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE;

ALTER TABLE ONLY "public"."landing_items" ADD CONSTRAINT "landing_items_landing_id_fkey" FOREIGN KEY (landing_id) REFERENCES landing(id) NOT DEFERRABLE;

ALTER TABLE ONLY "public"."product" ADD CONSTRAINT "product_id_author_fkey" FOREIGN KEY (id_author) REFERENCES author(id) NOT DEFERRABLE;

ALTER TABLE ONLY "public"."product_category" ADD CONSTRAINT "product_category_id_category_fkey" FOREIGN KEY (id_category) REFERENCES category(id) NOT DEFERRABLE;
ALTER TABLE ONLY "public"."product_category" ADD CONSTRAINT "product_category_id_product_fkey" FOREIGN KEY (id_product) REFERENCES product(id) NOT DEFERRABLE;

ALTER TABLE ONLY "public"."t_sales" ADD CONSTRAINT "t_sales_id_customer_fkey" FOREIGN KEY (id_customer) REFERENCES customer(id) NOT DEFERRABLE;

ALTER TABLE ONLY "public"."t_sales_download" ADD CONSTRAINT "t_sales_download_id_customer_fkey" FOREIGN KEY (id_customer) REFERENCES customer(id) NOT DEFERRABLE;
ALTER TABLE ONLY "public"."t_sales_download" ADD CONSTRAINT "t_sales_download_id_product_fkey" FOREIGN KEY (id_product) REFERENCES product(id) NOT DEFERRABLE;

ALTER TABLE ONLY "public"."t_sales_line" ADD CONSTRAINT "t_sales_line_id_bundle_fkey" FOREIGN KEY (id_bundle) REFERENCES bundle(id) NOT DEFERRABLE;
ALTER TABLE ONLY "public"."t_sales_line" ADD CONSTRAINT "t_sales_line_id_product_fkey" FOREIGN KEY (id_product) REFERENCES product(id) ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE;
ALTER TABLE ONLY "public"."t_sales_line" ADD CONSTRAINT "t_sales_line_id_sales_fkey" FOREIGN KEY (id_sales) REFERENCES t_sales(id) ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE;

-- 2025-02-19 03:23:02.151923+00