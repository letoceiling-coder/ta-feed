import { useState, useCallback, useEffect } from "react";

export type AddressLabel = "Дом" | "Работа" | "Другое";

export interface Address {
  id: string;
  label: AddressLabel;
  address: string;
  entrance?: string;
  floor?: string;
  apartment?: string;
  comment?: string;
}

const STORAGE_KEY = "yum_addresses_v1";

function load(): Address[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

function save(items: Address[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function useAddresses() {
  const [addresses, setAddresses] = useState<Address[]>(load);

  useEffect(() => { save(addresses); }, [addresses]);

  const addAddress = useCallback((data: Omit<Address, "id">) => {
    const addr: Address = { ...data, id: crypto.randomUUID() };
    setAddresses((prev) => [...prev, addr]);
    return addr;
  }, []);

  const updateAddress = useCallback((id: string, data: Partial<Omit<Address, "id">>) => {
    setAddresses((prev) => prev.map((a) => (a.id === id ? { ...a, ...data } : a)));
  }, []);

  const deleteAddress = useCallback((id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  }, []);

  return { addresses, addAddress, updateAddress, deleteAddress };
}
