/// <reference types="bun-types" />

import { otp } from "../lib/otp";

export default async function (no_hp: string, mode?: "no_hp" | "email") {
    return await otp.send(no_hp);
}
