import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

export interface UserState {
  id: string;
  balancePoints: number;
  referralCode: string;
  referralsCount: number;
  referralBonusEarned: number;
  usedPromoCodes: string[];
  isNewUser: boolean;
  ordersCount: number;
}

interface UserContextType {
  user: UserState;
  addPoints: (amount: number) => void;
  deductPoints: (amount: number) => boolean;
  addReferral: () => void;
  markPromoUsed: (code: string) => void;
  getPromoUsageCount: (code: string) => number;
  incrementOrdersCount: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const USER_KEY = "fastfood-user";

const REFERRER_BONUS = 300;
const REFERRAL_WELCOME_BONUS = 200;
const CASHBACK_PERCENT = 5;

function generateId() {
  return `USR-${Date.now().toString(36).toUpperCase()}`;
}

function generateReferralCode(id: string) {
  return id.replace("USR-", "REF");
}

function loadUser(): UserState {
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  const id = generateId();
  return {
    id,
    balancePoints: 0,
    referralCode: generateReferralCode(id),
    referralsCount: 0,
    referralBonusEarned: 0,
    usedPromoCodes: [],
    isNewUser: true,
    ordersCount: 0,
  };
}

function saveUser(user: UserState) {
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch {}
}

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
};

export { REFERRER_BONUS, REFERRAL_WELCOME_BONUS, CASHBACK_PERCENT };

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserState>(loadUser);

  useEffect(() => { saveUser(user); }, [user]);

  const addPoints = useCallback((amount: number) => {
    setUser(prev => ({ ...prev, balancePoints: prev.balancePoints + amount }));
  }, []);

  const deductPoints = useCallback((amount: number) => {
    let ok = false;
    setUser(prev => {
      if (prev.balancePoints >= amount) {
        ok = true;
        return { ...prev, balancePoints: prev.balancePoints - amount };
      }
      return prev;
    });
    return ok;
  }, []);

  const addReferral = useCallback(() => {
    setUser(prev => ({
      ...prev,
      referralsCount: prev.referralsCount + 1,
      referralBonusEarned: prev.referralBonusEarned + REFERRER_BONUS,
      balancePoints: prev.balancePoints + REFERRER_BONUS,
    }));
  }, []);

  const markPromoUsed = useCallback((code: string) => {
    setUser(prev => ({
      ...prev,
      usedPromoCodes: [...prev.usedPromoCodes, code.toUpperCase()],
    }));
  }, []);

  const getPromoUsageCount = useCallback((code: string) => {
    return user.usedPromoCodes.filter(c => c === code.toUpperCase()).length;
  }, [user.usedPromoCodes]);

  const incrementOrdersCount = useCallback(() => {
    setUser(prev => ({
      ...prev,
      ordersCount: prev.ordersCount + 1,
      isNewUser: false,
    }));
  }, []);

  return (
    <UserContext.Provider value={{ user, addPoints, deductPoints, addReferral, markPromoUsed, getPromoUsageCount, incrementOrdersCount }}>
      {children}
    </UserContext.Provider>
  );
};
