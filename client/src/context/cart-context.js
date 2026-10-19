import { createContext, useContext } from "react";

export const CartContext = createContext(null);

// { lines, count, subtotal, addItem, setQuantity, removeLine, clearCart, refreshFromMenu }
export function useCart() {
  const cart = useContext(CartContext);
  if (!cart) throw new Error("useCart must be used inside <CartProvider>");
  return cart;
}
