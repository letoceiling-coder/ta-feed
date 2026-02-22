import { useState, useCallback, useEffect } from "react";

export type PaymentMethod = "card_online" | "card_courier" | "cash" | "sbp";

const STORAGE_KEY = "yum_payment_method_v1";

function load(): PaymentMethod {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return raw as PaymentMethod;
  } catch {}
  return "card_online";
}

export function usePaymentMethods() {
  const [selected, setSelected] = useState<PaymentMethod>(load);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, selected);
  }, [selected]);

  const select = useCallback((method: PaymentMethod) => {
    setSelected(method);
  }, []);

  return { selected, select };
}
