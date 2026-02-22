import { MIN_DELIVERY_TOTAL } from "@/constants/checkout";

interface CheckoutRulesInput {
  subtotal: number;
  deliveryType: "delivery" | "pickup";
  calculatedDeliveryCost: number;
}

export function useCheckoutRules({ subtotal, deliveryType, calculatedDeliveryCost }: CheckoutRulesInput) {
  const isPickup = deliveryType === "pickup";
  const deliveryCost = isPickup ? 0 : calculatedDeliveryCost;
  const canCheckout = isPickup ? subtotal > 0 : subtotal >= MIN_DELIVERY_TOTAL;
  const remaining = MIN_DELIVERY_TOTAL - subtotal;

  return { deliveryCost, canCheckout, isPickup, remaining };
}
