export default async function (uid: string, msg: string) {
  const u = await db.user.findFirst({ where: { id: uid } });
  if (u) {
    const formData = new FormData();
    formData.append("target", u.username);
    formData.append("message", msg);
    const resp = await fetch("https://api.fonnte.com/send", {
      method: "POST",
      body: formData,
      headers: {
        Authorization: "KTjWCiAsBZz8hKW8VZGm",
      },
    });
  }
}
