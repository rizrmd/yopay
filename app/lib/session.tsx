import { sessionClient } from "lib/session/client";

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
