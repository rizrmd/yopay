import { CartItem } from "app/lib/bizpro/cart";

export const templatePesanan = (items: CartItem[]) => {
  // Calculate total and savings
  const total = items.reduce(
    (sum, item) => sum + (Number(item.real_price) || 0),
    0
  );
  const totalOriginal = items.reduce(
    (sum, item) => sum + (Number(item.strike_price) || 0),
    0
  );
  const totalSavings = totalOriginal - total;

  // Generate cart item rows
  const cartItemRows = items
    .map((item) => {
      const realPrice = (item.real_price || 0) * 1;
      const strikePrice = (item.strike_price || 0) * 1;
      const savings = strikePrice - realPrice;

      return `
<tr>
<td>
<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #FFFFFF; color: #333; width: 480px; margin: 0 auto;" width="480">
<tbody>
<tr>
<td class="column column-1" width="66.66666666666667%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-top: 5px; vertical-align: top;">
<table class="paragraph_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
<tr>
<td class="pad" style="padding-bottom:10px;padding-left:20px;padding-right:20px;padding-top:10px;">
<div style="color:#000000;font-family:'Lato', Tahoma, Verdana, Segoe, sans-serif;font-size:14px;line-height:120%;text-align:left;mso-line-height-alt:16.8px;">
<p style="margin: 0; word-break: break-word;">
  <span style="word-break: break-word; color: #71777D;">1 x ${item.name || "Unnamed Product"}</span>
  ${savings > 0 ? `<br><span style="color: #28a745; font-size: 12px;">Hemat Rp${savings.toLocaleString("id-ID", { maximumFractionDigits: 0 })}</span>` : ""}
</p>
</div>
</td>
</tr>
</table>
</td>
<td class="column column-2" width="33.333333333333336%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-top: 5px; vertical-align: top;">
<table class="paragraph_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
<tr>
<td class="pad" style="padding-bottom:10px;padding-left:20px;padding-right:20px;padding-top:10px;">
<div style="color:#000000;font-family:'Lato', Tahoma, Verdana, Segoe, sans-serif;font-size:14px;line-height:120%;text-align:left;mso-line-height-alt:16.8px;">
<p style="margin: 0; word-break: break-word;">
  <span style="text-decoration: line-through; color: #999; font-size: 12px;">Rp${strikePrice.toLocaleString("id-ID", { maximumFractionDigits: 0 })}</span><br>
  <strong>Rp${realPrice.toLocaleString("id-ID", { maximumFractionDigits: 0 })}</strong>
</p>
</div>
</td>
</tr>
</table>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
`;
    })
    .join("\n");

  return `<!DOCTYPE html>
<html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en">
<head>
<title></title>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link href="https://fonts.googleapis.com/css?family=Lato" rel="stylesheet" type="text/css">
<style>
* { box-sizing: border-box; }
body { margin: 0; padding: 0; }
</style>
</head>
<body>
<table class="nl-container" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
<tbody>
<tr>
<td>

<!-- Logo and Company Name -->
<table class="row row-1" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
<tbody>
<tr>
<td>
<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="color: #333; width: 480px; margin: 0 auto;" width="480">
<tbody>
<tr>
<td class="column column-1" width="50%" style="text-align: left; padding: 5px 10px;">
<div style="max-width: 88px;"><img src="https://esensi.online/logo.webp" style="display: block; height: auto; border: 0; width: 100%;" width="88" alt="Logo"></div>
</td>
<td class="column column-2" width="50%" style="text-align: right; padding: 5px 10px;">
<p style="margin: 0; font-family: TimesNewRoman,'Times New Roman',Times,Baskerville,Georgia,serif; font-size: 14px;"><em>PT Meraih Ilmu Semesta</em></p>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>

<!-- Divider -->
<table align="center" width="480" border="0" cellpadding="0" cellspacing="0" role="presentation">
<tr><td style="border-top: 1px solid #222222; font-size: 1px; height: 1px;">&nbsp;</td></tr>
</table>

<!-- Header -->
<table align="center" width="480" border="0" cellpadding="0" cellspacing="0" role="presentation">
<tr>
<td style="padding: 20px 0; text-align: center;">
<h1 style="margin: 0; font-family: 'Lato', Tahoma, Verdana, Segoe, sans-serif; font-size: 18px;">Hai, pesanan anda belum terbayar</h1>
<p style="margin: 10px 0 0; color: #71777D; font-family: 'Lato', Tahoma, Verdana, Segoe, sans-serif; font-size: 14px;">ini adalah notifikasi pesanan</p>
</td>
</tr>
</table>

<!-- Products Header -->
<table align="center" width="480" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background-color: #000000; color: #FFFFFF;">
<tr>
<td width="320" style="padding: 10px 20px; font-family: 'Lato', Tahoma, Verdana, Segoe, sans-serif; font-size: 14px;">PRODUK</td>
<td width="160" style="padding: 10px 20px; font-family: 'Lato', Tahoma, Verdana, Segoe, sans-serif; font-size: 14px;">HARGA</td>
</tr>
</table>

<!-- Products -->
<table align="center" width="480" border="0" cellpadding="0" cellspacing="0" role="presentation">
<tbody>
${cartItemRows}
</tbody>
</table>

<!-- Total -->
<table align="center" width="480" border="0" cellpadding="0" cellspacing="0" role="presentation" style="margin-top: 20px;">
<tr>
<td width="320" style="padding: 10px 20px; font-family: 'Lato', Tahoma, Verdana, Segoe, sans-serif; font-size: 14px;">
<strong>TOTAL</strong>
${totalSavings > 0 ? `<br><span style="color: #28a745; font-size: 12px;">Total Hemat Rp${totalSavings.toLocaleString("id-ID", { maximumFractionDigits: 0 })}</span>` : ""}
</td>
<td width="160" style="padding: 10px 20px; font-family: 'Lato', Tahoma, Verdana, Segoe, sans-serif; font-size: 14px;">
<span style="text-decoration: line-through; color: #999; font-size: 12px;">Rp${totalOriginal.toLocaleString("id-ID", { maximumFractionDigits: 0 })}</span><br>
<strong>Rp${total.toLocaleString("id-ID", { maximumFractionDigits: 0 })}</strong>
</td>
</tr>
</table>

<!-- Payment Instructions -->
<table align="center" width="480" border="0" cellpadding="0" cellspacing="0" role="presentation" style="margin-top: 30px;">
<tr>
<td style="padding: 20px; text-align: left;">
<p style="margin: 0; font-family: 'Lato', Tahoma, Verdana, Segoe, sans-serif; font-size: 16px;">Gunakan link di bawah untuk melakukan pembayaran segera, sebelum link pembayaran kadaluarsa.</p>
</td>
</tr>
<tr>
<td style="padding: 10px 20px; text-align: center;">
<a href="https://esensi.online/download/_" target="_blank" style="display: inline-block; padding: 10px 30px; background-color: #7747FF; color: #ffffff; font-family: 'Lato', Tahoma, Verdana, Segoe, sans-serif; font-size: 16px; text-decoration: none; border-radius: 4px;">Bayar Sekarang</a>
</td>
</tr>
</table>

<!-- Footer -->
<table align="center" width="480" border="0" cellpadding="0" cellspacing="0" role="presentation" style="margin-top: 40px;">
<tr>
<td style="padding: 20px; text-align: left;">
<p style="margin: 0; color: #555555; font-family: 'Lato', Tahoma, Verdana, Segoe, sans-serif; font-size: 12px;">
PT Meraih Ilmu Semesta<br>
Copyright © 2025 Esensi.online, All rights reserved.
</p>
</td>
</tr>
</table>

</td>
</tr>
</tbody>
</table>
</body>
</html>`;
};
