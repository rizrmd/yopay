import { sendEmail } from "app/lib/bizpro/email";

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const otp = {
  send: async (user_id: string) => {
    const generated_otp = String(getRandomInt(0, 9999)).padStart(4, "0");
    // console.log("generated_otp", generated_otp);
    const formData = new FormData();

    const customer = await db.customer.findFirst({
      where: { id: user_id },
      select: { id: true, whatsapp: true, email: true },
    });
    if (customer) {
      await db.customer.update({
        where: { id: customer.id },
        data: { otp: parseInt(generated_otp) },
      });

      sendEmail({
        to: customer.email,
        subject: "Kode OTP Esensi Online",
        body: "Silakan ketik kode berikut di halaman OTP",
        code: generated_otp,
        footer: "Jika Anda tidak meminta email ini, Anda bisa mengabaikannya.",
      });

      formData.append("target", customer.whatsapp);
      formData.append("message", "OTP: " + generated_otp + " (Esensi Online)");
      fetch("https://api.fonnte.com/send", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: "KTjWCiAsBZz8hKW8VZGm",
        },
      });
      return generated_otp;
    }
  },
};
