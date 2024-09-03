/// <reference types="bun-types" />

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default async function (no_hp: string) {
  const generated_otp = getRandomInt(0, 9999);

  const formData = new FormData();
  formData.append("target", no_hp);
  formData.append("message", "OTP Esensi Online: " + generated_otp);

  await fetch("https://api.fonnte.com/send", {
    method: "POST",
    body: formData,
    headers: {
      Authorization: "h-ZWMzLW2xe1By2U4XFp",
    },
  });

  return generated_otp;
}
