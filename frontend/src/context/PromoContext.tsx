import React, { createContext, useContext, useState, useCallback } from "react";
import { PROMO_CODES, type PromoCode } from "@/data/promoCodes";
import { useUser } from "./UserContext";

interface PromoContextType {
  appliedPromo: PromoCode | null;
  promoError: string | null;
  applyPromo: (code: string, subtotal: number) => boolean;
  removePromo: () => void;
  calculateDiscount: (subtotal: number) => number;
  isFreeDelivery: boolean;
  bonusPoints: number;
}

const PromoContext = createContext<PromoContextType | undefined>(undefined);

export const usePromo = () => {
  const ctx = useContext(PromoContext);
  if (!ctx) throw new Error("usePromo must be used within PromoProvider");
  return ctx;
};

export const PromoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);
  const { user, getPromoUsageCount } = useUser();

  const applyPromo = useCallback((code: string, subtotal: number): boolean => {
    setPromoError(null);
    const upper = code.trim().toUpperCase();
    const promo = PROMO_CODES.find(p => p.code === upper);

    if (!promo) {
      setPromoError("Промокод не найден");
      return false;
    }

    const now = new Date();
    if (now < new Date(promo.startDate) || now > new Date(promo.endDate)) {
      setPromoError("Промокод истёк");
      return false;
    }

    if (promo.newUsersOnly && !user.isNewUser) {
      setPromoError("Только для новых пользователей");
      return false;
    }

    const userUsage = getPromoUsageCount(upper);
    if (userUsage >= promo.maxUsesPerUser) {
      setPromoError("Лимит использований исчерпан");
      return false;
    }

    if (subtotal < promo.minOrderAmount) {
      setPromoError(`Минимальная сумма заказа: ${promo.minOrderAmount.toLocaleString("ru-RU")} ₽`);
      return false;
    }

    setAppliedPromo(promo);
    return true;
  }, [user.isNewUser, getPromoUsageCount]);

  const removePromo = useCallback(() => {
    setAppliedPromo(null);
    setPromoError(null);
  }, []);

  const calculateDiscount = useCallback((subtotal: number): number => {
    if (!appliedPromo) return 0;
    if (appliedPromo.type === "percent") return Math.round(subtotal * appliedPromo.value / 100);
    if (appliedPromo.type === "fixed") return Math.min(appliedPromo.value, subtotal);
    return 0; // free_delivery and bonus don't reduce subtotal
  }, [appliedPromo]);

  const isFreeDelivery = appliedPromo?.type === "free_delivery";
  const bonusPoints = appliedPromo?.type === "bonus_points" ? appliedPromo.value : 0;

  return (
    <PromoContext.Provider value={{ appliedPromo, promoError, applyPromo, removePromo, calculateDiscount, isFreeDelivery, bonusPoints }}>
      {children}
    </PromoContext.Provider>
  );
};
