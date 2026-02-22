import React, { createContext, useContext, useState, useCallback } from "react";
import type { CartItem } from "./CartContext";

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: "processing" | "cooking" | "delivery" | "delivered";
  createdAt: string;
  deliveryType: "delivery" | "pickup";
  address?: string;
  eta?: string;
}

interface OrderContextType {
  orders: Order[];
  addOrder: (order: Omit<Order, "id" | "createdAt" | "status">) => Order;
  getOrder: (id: string) => Order | undefined;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const useOrders = () => {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrders must be used within OrderProvider");
  return ctx;
};

const ORDERS_KEY = "fastfood-orders";

function loadOrders(): Order[] {
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

function saveOrders(orders: Order[]) {
  try {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  } catch {}
}

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>(loadOrders);

  const addOrder = useCallback((data: Omit<Order, "id" | "createdAt" | "status">) => {
    const order: Order = {
      ...data,
      id: `ORD-${Date.now().toString(36).toUpperCase()}`,
      createdAt: new Date().toISOString(),
      status: "processing",
      eta: "30-45 мин",
    };
    setOrders((prev) => {
      const next = [order, ...prev];
      saveOrders(next);
      return next;
    });
    return order;
  }, []);

  const getOrder = useCallback((id: string) => orders.find((o) => o.id === id), [orders]);

  return (
    <OrderContext.Provider value={{ orders, addOrder, getOrder }}>
      {children}
    </OrderContext.Provider>
  );
};
