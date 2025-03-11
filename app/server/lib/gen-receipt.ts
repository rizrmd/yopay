import { CartItem } from "app/lib/bizpro/cart";

export const generateReceipt = (items: CartItem[]): string => {
  const formatPrice = (price?: number): string => {
    return price ? new Intl.NumberFormat('id-ID').format(price) : '0';
  };

  const getDiscountPercent = (strike?: number, real?: number): number => {
    if (strike && real) {
      return Math.round(((strike - real) / strike) * 100);
    }
    return 0;
  };

  const calculateTotal = (): number => {
    return items.reduce((sum, item) => sum + (parseInt(item.real_price + '') || 0), 0);
  };

  const calculateTotalOriginal = (): number => {
    return items.reduce((sum, item) => sum + (parseInt(item.strike_price + '') || 0), 0);
  };

  const dateNow = new Date().toLocaleDateString('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  let receipt = `
=============================================
               STRUK PEMBELIAN               
=============================================
Tanggal     : ${dateNow}
No. Transaksi: ${items[0]?.id.slice(0, 8) || '-'}
---------------------------------------------\n`;

  items.forEach((item, index) => {
    const discount = getDiscountPercent(item.strike_price, item.real_price);
    const truncatedName = (item.name || 'Unnamed Item').slice(0, 30);
    const currency = item.currency || 'Rp';
    
    receipt += `${index + 1}. ${truncatedName}${truncatedName.length >= 30 ? '...' : ''}
   ${item.type.toUpperCase()} | ${currency} ${formatPrice(item.strike_price)} -> ${currency} ${formatPrice(item.real_price)} (${discount}%)
---------------------------------------------\n`;
  });

  const totalOriginal = calculateTotalOriginal();
  const totalFinal = calculateTotal();
  const totalSavingsPercent = Math.round(((totalOriginal - totalFinal) / totalOriginal) * 100);

  receipt += `
Harga Normal: Rp ${formatPrice(totalOriginal)}
Total Hemat : ${totalSavingsPercent}%
=============================================
TOTAL BAYAR : Rp ${formatPrice(totalFinal)}
=============================================
              Terima Kasih
=============================================`;

  return receipt;
}