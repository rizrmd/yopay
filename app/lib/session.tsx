import { sessionClient } from "lib/utils/client-session";

export type UserData = {
  role: string;
  name: string;
};

export const session = sessionClient<UserData>({
  editorSampleData: { role: "mantap", name: "rizky" },
  auth: {
    mode: "user-pass",
  },
});
