import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import type { Product } from "@/data/products";
import { FREE_DELIVERY_THRESHOLD } from "@/constants/checkout";

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedExtras?: string[];
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, size?: string, extras?: string[]) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  getItemQuantity: (productId: string) => number;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "fastfood-cart";

function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

function saveCart(items: CartItem[]) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch {}
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};

export const useFreeDeliveryProgress = () => {
  const { totalPrice } = useCart();
  const progress = Math.min((totalPrice / FREE_DELIVERY_THRESHOLD) * 100, 100);
  const remaining = Math.max(FREE_DELIVERY_THRESHOLD - totalPrice, 0);
  return { progress, remaining, isFree: remaining === 0, threshold: FREE_DELIVERY_THRESHOLD };
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(loadCart);

  useEffect(() => {
    saveCart(items);
  }, [items]);

  const addItem = useCallback((product: Product, size?: string, extras?: string[]) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { product, quantity: 1, selectedSize: size, selectedExtras: extras }];
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.product.id !== productId));
    } else {
      setItems((prev) =>
        prev.map((i) => (i.product.id === productId ? { ...i, quantity } : i))
      );
    }
  }, []);

  const getItemQuantity = useCallback((productId: string) => {
    return items.find((i) => i.product.id === productId)?.quantity ?? 0;
  }, [items]);

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, getItemQuantity, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};
