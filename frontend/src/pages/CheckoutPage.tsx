import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Clock, CreditCard, Banknote, Smartphone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useOrders } from "@/context/OrderContext";
import { usePromo } from "@/context/PromoContext";
import { useUser, CASHBACK_PERCENT } from "@/context/UserContext";
import { useRaffle } from "@/context/RaffleContext";
import { useCheckoutRules } from "@/hooks/useCheckoutRules";
import { MIN_DELIVERY_TOTAL } from "@/constants/checkout";
import { toast } from "sonner";
import PointsSlider from "@/components/PointsSlider";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();
  const { addOrder } = useOrders();
  const { appliedPromo, calculateDiscount, isFreeDelivery, bonusPoints, removePromo } = usePromo();
  const { user, addPoints, deductPoints, markPromoUsed, incrementOrdersCount } = useUser();
  const { addParticipant } = useRaffle();

  const [deliveryType, setDeliveryType] = useState<"delivery" | "pickup">("delivery");
  const [address, setAddress] = useState("");
  const [entrance, setEntrance] = useState("");
  const [floor, setFloor] = useState("");
  const [apt, setApt] = useState("");
  const [comment, setComment] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [payment, setPayment] = useState("card");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pointsToUse, setPointsToUse] = useState(0);

  const handlePointsChange = useCallback((p: number) => setPointsToUse(p), []);

  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  const rawDeliveryFee = isFreeDelivery || totalPrice >= 7000 ? 0 : totalPrice >= 1500 ? 149 : 299;

  const { deliveryCost, canCheckout, isPickup, remaining } = useCheckoutRules({
    subtotal: totalPrice,
    deliveryType,
    calculatedDeliveryCost: rawDeliveryFee,
  });

  const promoDiscount = calculateDiscount(totalPrice);
  const subtotalAfterDiscount = totalPrice - promoDiscount;
  const deliveryFee = deliveryCost;
  const finalTotal = Math.max(0, subtotalAfterDiscount - pointsToUse + deliveryFee);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Укажите имя";
    if (!phone.trim()) e.phone = "Укажите телефон";
    if (deliveryType === "delivery" && !address.trim()) e.address = "Укажите адрес";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!canCheckout) {
      toast.error(`Минимальная сумма для доставки — ${MIN_DELIVERY_TOTAL.toLocaleString("ru-RU")} ₽`);
      return;
    }
    if (!validate()) {
      toast.error("Заполните обязательные поля");
      return;
    }

    // Deduct points
    if (pointsToUse > 0) {
      deductPoints(pointsToUse);
    }

    // Mark promo used
    if (appliedPromo) {
      markPromoUsed(appliedPromo.code);
      if (bonusPoints > 0) addPoints(bonusPoints);
    }

    // Cashback
    const cashback = Math.round(finalTotal * CASHBACK_PERCENT / 100);
    if (cashback > 0) addPoints(cashback);

    // Order
    const order = addOrder({
      items: [...items],
      total: finalTotal,
      deliveryType,
      address: deliveryType === "delivery" ? address : "Самовывоз — ул. Ленина, 42",
      eta: "30-45 мин",
    });

    incrementOrdersCount();
    addParticipant(user.id);
    removePromo();
    clearCart();
    navigate(`/order-success?id=${order.id}&cashback=${cashback}`);
  };


  const pickupPoints = [
    { name: "ул. Ленина, 42", time: "15-20 мин" },
    { name: "пр. Мира, 18", time: "20-25 мин" },
  ];

  return (
    <div className="min-h-screen bg-background pb-32">
      <header className="px-4 pt-4 pb-2 flex items-center gap-3">
        <motion.button whileTap={{ scale: 0.9 }} onClick={() => navigate(-1)} className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
          <ArrowLeft size={20} className="text-foreground" />
        </motion.button>
        <h1 className="text-xl font-extrabold font-display text-foreground">Оформление</h1>
      </header>

      <div className="px-4 space-y-4 mt-2">
        {/* Delivery type */}
        <div className="flex gap-2 bg-secondary rounded-2xl p-1">
          {(["delivery", "pickup"] as const).map((type) => (
            <motion.button
              key={type}
              whileTap={{ scale: 0.97 }}
              onClick={() => setDeliveryType(type)}
              className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
                deliveryType === type
                  ? "gradient-primary text-primary-foreground shadow-glow"
                  : "text-muted-foreground"
              }`}
            >
              {type === "delivery" ? "🚚 Доставка" : "🏪 Самовывоз"}
            </motion.button>
          ))}
        </div>

        {/* Delivery address */}
        {deliveryType === "delivery" ? (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            <div>
              <label className="text-sm font-bold text-foreground mb-1 block">Адрес доставки</label>
              <div className="relative">
                <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={address}
                  onChange={(e) => { setAddress(e.target.value); setErrors((p) => ({ ...p, address: "" })); }}
                  placeholder="ул. Пушкина, д. 10"
                  className={`w-full bg-secondary text-foreground rounded-xl py-3 pl-10 pr-4 text-sm border-2 ${errors.address ? "border-destructive" : "border-transparent"} outline-none focus:ring-2 focus:ring-primary/30`}
                />
              </div>
              {errors.address && <p className="text-xs text-destructive mt-1">{errors.address}</p>}
            </div>
            <div className="grid grid-cols-3 gap-2">
              <input value={entrance} onChange={(e) => setEntrance(e.target.value)} placeholder="Подъезд" className="bg-secondary text-foreground rounded-xl py-3 px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30" />
              <input value={floor} onChange={(e) => setFloor(e.target.value)} placeholder="Этаж" className="bg-secondary text-foreground rounded-xl py-3 px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30" />
              <input value={apt} onChange={(e) => setApt(e.target.value)} placeholder="Кв." className="bg-secondary text-foreground rounded-xl py-3 px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Комментарий курьеру"
              rows={2}
              className="w-full bg-secondary text-foreground rounded-xl py-3 px-4 text-sm outline-none focus:ring-2 focus:ring-primary/30 resize-none"
            />
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
            <label className="text-sm font-bold text-foreground mb-1 block">Выберите точку</label>
            {pickupPoints.map((point) => (
              <button key={point.name} className="w-full flex items-center justify-between bg-card rounded-2xl p-4 shadow-card text-left">
                <div>
                  <p className="font-bold text-sm text-card-foreground">{point.name}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5"><Clock size={12} /> {point.time}</p>
                </div>
                <div className="w-5 h-5 rounded-full border-2 border-primary flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full gradient-primary" />
                </div>
              </button>
            ))}
          </motion.div>
        )}

        {/* Contacts */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-foreground">Контакты</h3>
          <input
            value={name}
            onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: "" })); }}
            placeholder="Ваше имя"
            className={`w-full bg-secondary text-foreground rounded-xl py-3 px-4 text-sm border-2 ${errors.name ? "border-destructive" : "border-transparent"} outline-none focus:ring-2 focus:ring-primary/30`}
          />
          {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
          <input
            value={phone}
            onChange={(e) => { setPhone(e.target.value); setErrors((p) => ({ ...p, phone: "" })); }}
            placeholder="+7 (___) ___-__-__"
            type="tel"
            className={`w-full bg-secondary text-foreground rounded-xl py-3 px-4 text-sm border-2 ${errors.phone ? "border-destructive" : "border-transparent"} outline-none focus:ring-2 focus:ring-primary/30`}
          />
          {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone}</p>}
        </div>

        {/* Payment */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-foreground">Оплата</h3>
          {[
            { id: "card", icon: CreditCard, label: "Картой онлайн" },
            { id: "sbp", icon: Smartphone, label: "СБП" },
            { id: "cash", icon: Banknote, label: "Наличными" },
          ].map((method) => (
            <motion.button
              key={method.id}
              whileTap={{ scale: 0.97 }}
              onClick={() => setPayment(method.id)}
              className={`w-full flex items-center gap-3 p-4 rounded-2xl text-sm font-medium transition-all ${
                payment === method.id
                  ? "bg-primary/10 border-2 border-primary text-foreground"
                  : "bg-secondary border-2 border-transparent text-muted-foreground"
              }`}
            >
              <method.icon size={18} />
              {method.label}
            </motion.button>
          ))}
        </div>

        {/* Points */}
        <PointsSlider maxDeductible={subtotalAfterDiscount} onPointsChange={handlePointsChange} />

        {/* Summary */}
        <div className="bg-card rounded-2xl p-4 shadow-card space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Товары</span>
            <span className="font-bold text-card-foreground tabular-nums">{totalPrice.toLocaleString("ru-RU")} ₽</span>
          </div>
          {promoDiscount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Промокод ({appliedPromo?.code})</span>
              <span className="font-bold text-accent tabular-nums">−{promoDiscount.toLocaleString("ru-RU")} ₽</span>
            </div>
          )}
          {pointsToUse > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Баллы</span>
              <span className="font-bold text-accent tabular-nums">−{pointsToUse.toLocaleString("ru-RU")} ₽</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Доставка</span>
            <span className={`font-bold ${deliveryFee === 0 ? "text-accent" : "text-card-foreground"} tabular-nums`}>
              {deliveryFee === 0 ? "Бесплатно" : `${deliveryFee} ₽`}
            </span>
          </div>
          {bonusPoints > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Начисление баллов</span>
              <span className="font-bold text-primary tabular-nums">+{bonusPoints}</span>
            </div>
          )}
          <div className="border-t border-border pt-2 flex justify-between">
            <span className="font-bold text-foreground">Итого</span>
            <span className="font-extrabold text-lg text-foreground tabular-nums">{finalTotal.toLocaleString("ru-RU")} ₽</span>
          </div>
          <p className="text-[11px] text-muted-foreground">Кэшбэк {CASHBACK_PERCENT}% — +{Math.round(finalTotal * CASHBACK_PERCENT / 100)} баллов</p>
        </div>
      </div>

      {/* CTA */}
      <div className="fixed bottom-0 inset-x-0 p-4 glass safe-bottom z-30">
        <motion.button
          whileTap={canCheckout ? { scale: 0.97 } : undefined}
          onClick={handleSubmit}
          disabled={!canCheckout}
          className={`w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center ${
            canCheckout
              ? "gradient-primary text-primary-foreground shadow-glow"
              : "bg-muted text-muted-foreground cursor-not-allowed"
          }`}
        >
          {canCheckout
            ? `Подтвердить заказ · ${finalTotal.toLocaleString("ru-RU")} ₽`
            : `Минимум ${MIN_DELIVERY_TOTAL.toLocaleString("ru-RU")} ₽ для доставки`}
        </motion.button>
        {!canCheckout && !isPickup && (
          <p className="text-xs text-destructive text-center mt-2">
            Добавьте ещё на {remaining.toLocaleString("ru-RU")} ₽
          </p>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;
