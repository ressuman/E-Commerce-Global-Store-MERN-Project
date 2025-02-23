export const addDecimals = (num) => (Math.round(num * 100) / 100).toFixed(2);

export const updateCart = (state) => {
  // Convert string prices to numbers for calculations
  const itemsPrice = state.cartItems.reduce(
    (acc, item) => acc + Number(item.price) * item.qty,
    0
  );

  state.itemsPrice = addDecimals(itemsPrice);
  state.shippingPrice = addDecimals(itemsPrice > 100 ? 0 : 10);
  state.taxPrice = addDecimals(itemsPrice * 0.15);
  state.totalPrice = addDecimals(
    Number(state.itemsPrice) +
      Number(state.shippingPrice) +
      Number(state.taxPrice)
  );

  try {
    localStorage.setItem("cart", JSON.stringify(state));
  } catch (error) {
    console.error("Cart save error:", error);
  }

  return state;
};
