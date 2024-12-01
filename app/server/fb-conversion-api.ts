import { EsensiSession } from "./session";

const accessToken =
  "EAAY3qcN0znYBO6EKugZBEj7BLY4ZBTRkZChmZAFDXeHXXwOxNddTJE1vo1VbvJyUZCX9wJFKlJxeaFF9blskTuG3pVzlxqVZAebhtuyDMjgjoy4DOq7aeOprZC9YH0E3rSebSESzChYTFkbRGvnRjM7jZBZBFNnVYJamL8ell7kTM0HVMxUjO4mMIZCuuwoZB7tIcZBwswZDZD";
export const pixelId = "960408691867202";
type argParamType = {
  session: EsensiSession | null;
  eventName: string;
  eventSourceUrl: string;
  ipAddress: string;
  userAgent: string;
};

export async function _fb_conversion_api(argParam: argParamType) {
  const {
    FacebookAdsApi,
    ServerEvent,
    EventRequest,
    UserData,
    CustomData,
    Content,
  } = await import("facebook-nodejs-business-sdk");

  if (!argParam.session || !argParam.session.email) return;
  try {
    if (accessToken === undefined || pixelId === undefined) {
      throw new Error(
        `"Missing required test config. Got pixel_id: '${pixelId}', access_token: '${accessToken}'"`
      );
    }
    const api = FacebookAdsApi.init(accessToken);
    let current_timestamp = Math.floor(Date.now() / 1000);

    const userData1 = new UserData()
      .setEmail(argParam.session.email!)
      .setClientIpAddress(argParam.ipAddress)
      .setClientUserAgent(argParam.userAgent);

    const customData1 = new CustomData().setCurrency("Rp.");
    // .setCustomProperties({custom1: 'value2'})
    // .setValue(123.45);

    const serverEvent1 = new ServerEvent()
      .setEventName(argParam.eventName)
      .setEventTime(current_timestamp)
      .setUserData(userData1)
      .setCustomData(customData1)
      .setEventSourceUrl(argParam.eventSourceUrl)
      .setActionSource("website");

    const eventRequest1 = new EventRequest(accessToken, pixelId).setEvents([
      serverEvent1,
    ]);

    await Promise.all([eventRequest1.execute()]);
  } catch (e) {}
}
