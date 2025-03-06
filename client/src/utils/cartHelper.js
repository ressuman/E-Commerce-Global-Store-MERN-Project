export const addDecimals = (num) => (Math.round(num * 100) / 100).toFixed(2);

// Regional tax rates based on country codes
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

// export const updateCart = (state) => {
//   // Convert string prices to numbers for calculations
//   const itemsPrice = state.cartItems.reduce(
//     (acc, item) => acc + Number(item.price) * item.qty,
//     0
//   );

//   state.itemsPrice = addDecimals(itemsPrice);
//   state.shippingPrice = addDecimals(itemsPrice > 100 ? 0 : 10);
//   state.taxPrice = addDecimals(itemsPrice * 0.15);
//   state.totalPrice = addDecimals(
//     Number(state.itemsPrice) +
//       Number(state.shippingPrice) +
//       Number(state.taxPrice)
//   );

//   try {
//     localStorage.setItem("cart", JSON.stringify(state));
//   } catch (error) {
//     console.error("Cart save error:", error);
//   }

//   return state;
// };

export const updateCart = (state) => {
  // Calculate items price
  const itemsPrice = state.cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  // Get shipping country or default
  const country = state.shippingAddress?.country?.toUpperCase() || "DEFAULT";

  // Calculate shipping price
  const shippingPrice = itemsPrice > 100 ? 0 : 10;

  // Get tax rate based on country
  const taxRate = regionalTaxRates[country] || regionalTaxRates.DEFAULT;
  const taxPrice = itemsPrice * taxRate;

  // Calculate total price
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  // Update state with formatted prices
  // state.itemsPrice = addDecimals(itemsPrice);
  // state.shippingPrice = addDecimals(shippingPrice);
  // state.taxPrice = addDecimals(taxPrice);
  // state.totalPrice = addDecimals(totalPrice);
  // state.subTotal = addDecimals(itemsPrice);
  // state.taxRate = taxRate;
  state.itemsPrice = itemsPrice;
  state.shippingPrice = shippingPrice;
  state.taxPrice = taxPrice;
  state.totalPrice = totalPrice;
  state.subTotal = itemsPrice;
  state.taxRate = taxRate;

  // Save to localStorage
  try {
    localStorage.setItem(
      "cart",
      JSON.stringify(state)
      // JSON.stringify({
      //   ...state,
      //   // Store raw numbers for calculations
      //   _itemsPrice: itemsPrice,
      //   _taxRate: taxRate,
      // })
    );
  } catch (error) {
    console.error("Cart save error:", error);
  }

  return state;
};
