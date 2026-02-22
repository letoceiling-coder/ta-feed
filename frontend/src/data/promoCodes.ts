export interface PromoCode {
  code: string;
  type: "percent" | "fixed" | "free_delivery" | "bonus_points";
  value: number; // percent amount, fixed ₽, 0 for free_delivery, points amount
  minOrderAmount: number;
  startDate: string; // ISO
  endDate: string; // ISO
  maxUsesTotal: number;
  maxUsesPerUser: number;
  newUsersOnly: boolean;
  description: string;
}

// Demo promo codes
export const PROMO_CODES: PromoCode[] = [
  {
    code: "WELCOME",
    type: "percent",
    value: 10,
    minOrderAmount: 2000,
    startDate: "2024-01-01",
    endDate: "2027-12-31",
    maxUsesTotal: 9999,
    maxUsesPerUser: 1,
    newUsersOnly: true,
    description: "Скидка 10% для новых пользователей",
  },
  {
    code: "SALE500",
    type: "fixed",
    value: 500,
    minOrderAmount: 3000,
    startDate: "2024-01-01",
    endDate: "2027-12-31",
    maxUsesTotal: 9999,
    maxUsesPerUser: 3,
    newUsersOnly: false,
    description: "Скидка 500 ₽ от 3000 ₽",
  },
  {
    code: "FREEDELIVERY",
    type: "free_delivery",
    value: 0,
    minOrderAmount: 1000,
    startDate: "2024-01-01",
    endDate: "2027-12-31",
    maxUsesTotal: 9999,
    maxUsesPerUser: 5,
    newUsersOnly: false,
    description: "Бесплатная доставка",
  },
  {
    code: "BONUS200",
    type: "bonus_points",
    value: 200,
    minOrderAmount: 0,
    startDate: "2024-01-01",
    endDate: "2027-12-31",
    maxUsesTotal: 9999,
    maxUsesPerUser: 1,
    newUsersOnly: false,
    description: "+200 баллов к заказу",
  },
];
