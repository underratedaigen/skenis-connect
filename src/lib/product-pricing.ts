/** Existing NFC_CARD prices, in euros. Commercial thresholds are unchanged. */
export function getProductPrice(quantity: number) {
  const unitPrice = quantity >= 100 ? 13.99 : quantity >= 25 ? 16.99 : 19.99;
  return {
    unitPrice,
    totalPrice: Math.round(quantity * unitPrice * 100) / 100,
  };
}
