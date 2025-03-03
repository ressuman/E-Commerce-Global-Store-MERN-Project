// config/taxes.js
export const regionalTaxRates = {
  // Africa
  GH: 0.125, // Ghana VAT
  NG: 0.075, // Nigeria VAT
  ZA: 0.15, // South Africa VAT
  KE: 0.16, // Kenya VAT

  // Europe
  GB: 0.2, // UK VAT

  // Americas
  US: 0.0, // US (varies by state)
  CA: 0.05, // Canada GST

  // Asia
  IN: 0.18, // India GST

  // Australia
  AU: 0.1, // Australia GST

  // Default
  DEFAULT: 0.15,
};

export function calcPrices(orderItems) {
  const itemsPrice = orderItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  const taxRate = 0.15;
  const taxPrice = itemsPrice * taxRate;

  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  return {
    itemsPrice: Number(itemsPrice.toFixed(2)),
    shippingPrice: Number(shippingPrice.toFixed(2)),
    taxPrice: Number(taxPrice.toFixed(2)),
    totalPrice: Number(totalPrice.toFixed(2)),
  };
}
