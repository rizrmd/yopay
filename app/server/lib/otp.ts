function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const otp = {
  send: async (no_hp: string) => {
    const generated_otp = String(getRandomInt(0, 9999)).padStart(4, "0");
    // console.log("generated_otp", generated_otp);
    const formData = new FormData();
    formData.append("target", no_hp);
    formData.append("message", "OTP Esensi Online: " + generated_otp);
    const resp = await fetch("https://api.fonnte.com/send", {
      method: "POST",
      body: formData,
      headers: {
        Authorization: "KTjWCiAsBZz8hKW8VZGm",
      },
    });
    return generated_otp;
  },
};
