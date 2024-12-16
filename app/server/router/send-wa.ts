export const sendCustomerWA = async function (uid: string, msg: string) {
  const u = await db.customer.findFirst({ where: { id: uid } });
  if (u && u.whatsapp) {
    const formData = new FormData();
    formData.append("target", u.whatsapp);
    formData.append("message", msg);
    const resp = await fetch("https://api.fonnte.com/send", {
      method: "POST",
      body: formData,
      headers: {
        Authorization: "KTjWCiAsBZz8hKW8VZGm",
      },
    });

    return { status: "ok" };
  }
  return { status: "failed - not found" };
};
export default sendCustomerWA;
