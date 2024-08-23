import { sessionClient } from "lib/utils/client-session";

export type UserData = {
  uid: string;
  role: string;
  name: string;
};

export const session = sessionClient<UserData>({
  editorSampleData: { uid: "", role: "mantap", name: "rizky" },
  auth: {
    mode: "user-pass",
  },
});
