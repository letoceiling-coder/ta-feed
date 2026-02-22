import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

export interface RaffleWinner {
  userId: string;
  place: 1 | 2 | 3;
  points: number;
  month: string; // "2025-01" format
}

export interface RaffleState {
  currentMonthEnd: string; // ISO end of month
  participantIds: string[];
  pastWinners: RaffleWinner[];
}

const RAFFLE_KEY = "fastfood-raffle";
const PRIZES = [5000, 3000, 1000] as const;

function getMonthEnd(): string {
  const now = new Date();
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
  return end.toISOString();
}

function getCurrentMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

function loadRaffle(): RaffleState {
  try {
    const raw = localStorage.getItem(RAFFLE_KEY);
    if (raw) {
      const state = JSON.parse(raw) as RaffleState;
      // Check if month rolled over
      if (new Date(state.currentMonthEnd) < new Date()) {
        return { currentMonthEnd: getMonthEnd(), participantIds: [], pastWinners: state.pastWinners };
      }
      return state;
    }
  } catch {}
  return { currentMonthEnd: getMonthEnd(), participantIds: [], pastWinners: [] };
}

function saveRaffle(state: RaffleState) {
  try { localStorage.setItem(RAFFLE_KEY, JSON.stringify(state)); } catch {}
}

interface RaffleContextType {
  raffle: RaffleState;
  addParticipant: (userId: string) => void;
  runDraw: () => RaffleWinner[];
  timeUntilEnd: number; // ms
  prizes: readonly [number, number, number];
}

const RaffleContext = createContext<RaffleContextType | undefined>(undefined);

export const useRaffle = () => {
  const ctx = useContext(RaffleContext);
  if (!ctx) throw new Error("useRaffle must be used within RaffleProvider");
  return ctx;
};

export const RaffleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [raffle, setRaffle] = useState<RaffleState>(loadRaffle);
  const [timeUntilEnd, setTimeUntilEnd] = useState(0);

  useEffect(() => { saveRaffle(raffle); }, [raffle]);

  useEffect(() => {
    const update = () => {
      const diff = Math.max(0, new Date(raffle.currentMonthEnd).getTime() - Date.now());
      setTimeUntilEnd(diff);
    };
    update();
    const iv = setInterval(update, 1000);
    return () => clearInterval(iv);
  }, [raffle.currentMonthEnd]);

  const addParticipant = useCallback((userId: string) => {
    setRaffle(prev => {
      if (prev.participantIds.includes(userId)) return prev;
      return { ...prev, participantIds: [...prev.participantIds, userId] };
    });
  }, []);

  const runDraw = useCallback((): RaffleWinner[] => {
    const { participantIds } = raffle;
    if (participantIds.length === 0) return [];
    const shuffled = [...participantIds].sort(() => Math.random() - 0.5);
    const month = getCurrentMonth();
    const winners: RaffleWinner[] = shuffled.slice(0, 3).map((userId, i) => ({
      userId,
      place: (i + 1) as 1 | 2 | 3,
      points: PRIZES[i],
      month,
    }));
    setRaffle(prev => ({
      ...prev,
      pastWinners: [...winners, ...prev.pastWinners],
      participantIds: [],
      currentMonthEnd: getMonthEnd(),
    }));
    return winners;
  }, [raffle]);

  return (
    <RaffleContext.Provider value={{ raffle, addParticipant, runDraw, timeUntilEnd, prizes: PRIZES }}>
      {children}
    </RaffleContext.Provider>
  );
};
