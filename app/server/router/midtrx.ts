import { CartItem } from "app/lib/bizpro/cart";
import {
  CustomData,
  EventRequest,
  FacebookAdsApi,
  ServerEvent,
  UserData,
} from "facebook-nodejs-business-sdk";
import { SessionContext } from "lib/session/type";
import { EsensiSession } from "../session";

export default async function (this: SessionContext<EsensiSession>) {
  const payload = await this.req.json();
  db.midtrx.create({
    data: { payload, type: this.url.pathname },
  });

  if (this.url.pathname.endsWith("finish")) {
    const order_id: string = payload?.transaction_details?.order_id;
    if (order_id) {
      const sales = await db.t_sales.findFirst({
        where: { midtrans_order_id: order_id },
        select: { id: true, info: true },
      });

      if (sales) {
        db.t_sales.update({
          data: {
            status: "paid",
            midtrans_success: payload,
            updated_at: new Date(),
          },
          where: {
            id: sales.id,
          },
        });

        const cart = (sales.info as { cart: CartItem[] })?.cart;
        const dotenv = (await import("dotenv")).default;

        // Initialize dotenv
        dotenv.config({
          path: "/app/prasi/data/code/bf706e40-2a3a-4148-9cdd-75d4483328d7/site/src/.env",
        });
        if (cart && process.env.FB_ACCESS_TOKEN && process.env.FB_PIXEL_ID) {
          try {
            // Initialize Facebook Ads API with your Pixel Access Token
            const api = FacebookAdsApi.init(process.env.FB_ACCESS_TOKEN);

            // Calculate cart total
            let total = 0;
            for (const item of cart) {
              if (item.real_price) {
                total += item.real_price;
              }
            }

            const userData = new UserData()
              .setClientIpAddress(
                this.req.headers.get("x-forwarded-for") ||
                  this.req.headers.get("x-real-ip") ||
                  ""
              )
              .setClientUserAgent(this.req.headers.get("user-agent") || "");

            const customData = new CustomData()
              .setCurrency("IDR")
              .setValue(total)
              .setOrderId(order_id)
              .setContentIds(cart.map((e) => e.id))
              .setContentType("product_group")
              .setNumItems(cart.length);

            const serverEvent = new ServerEvent()
              .setEventName("Purchase")
              .setEventTime(Math.floor(Date.now() / 1000))
              .setUserData(userData)
              .setCustomData(customData)
              .setEventSourceUrl(this.req.url)
              .setActionSource("website");

            const eventsData = [serverEvent];
            const eventRequest = new EventRequest(
              process.env.FB_ACCESS_TOKEN,
              "960408691867202"
            ).setEvents(eventsData);
            await eventRequest.execute();
          } catch (error) {
            console.error("Failed to send Facebook pixel event:", error);
          }
        }
      }
    }
  }

  return { status: "ok" };
}
