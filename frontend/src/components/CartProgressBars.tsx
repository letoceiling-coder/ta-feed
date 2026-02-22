import { motion } from "framer-motion";
import { Check, Truck, Gift } from "lucide-react";
import { MIN_DELIVERY_TOTAL, FREE_DELIVERY_THRESHOLD } from "@/constants/checkout";

const DELIVERY_MIN = MIN_DELIVERY_TOTAL;
const FREE_DELIVERY_MIN = FREE_DELIVERY_THRESHOLD;

interface Props {
  cartTotal: number;
}

const ProgressBar = ({
  label,
  sublabel,
  progress,
  isComplete,
  disabled,
  icon: Icon,
}: {
  label: string;
  sublabel: string;
  progress: number;
  isComplete: boolean;
  disabled?: boolean;
  icon: React.ElementType;
}) => (
  <div className={`flex gap-3 items-start ${disabled ? "opacity-40" : ""}`}>
    <div
      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors duration-300 ${
        isComplete
          ? "bg-accent text-accent-foreground"
          : "bg-secondary text-muted-foreground"
      }`}
    >
      {isComplete ? <Check size={16} /> : <Icon size={16} />}
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex justify-between items-baseline mb-1">
        <span className="text-xs font-semibold text-card-foreground truncate">{label}</span>
        <span className="text-[11px] font-bold text-muted-foreground tabular-nums ml-2 flex-shrink-0">
          {Math.round(progress)}%
        </span>
      </div>
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${isComplete ? "gradient-accent" : "gradient-primary"}`}
          initial={false}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
      <p className="text-[11px] text-muted-foreground mt-0.5 truncate">{sublabel}</p>
    </div>
  </div>
);

const CartProgressBars = ({ cartTotal }: Props) => {
  const deliveryProgress = Math.min((cartTotal / DELIVERY_MIN) * 100, 100);
  const deliveryDone = cartTotal >= DELIVERY_MIN;

  const freeRange = FREE_DELIVERY_MIN - DELIVERY_MIN;
  const freeProgress = deliveryDone
    ? Math.min(((cartTotal - DELIVERY_MIN) / freeRange) * 100, 100)
    : 0;
  const freeDone = cartTotal >= FREE_DELIVERY_MIN;

  return (
    <div className="bg-secondary rounded-2xl p-3 space-y-3">
      <ProgressBar
        icon={Truck}
        label={deliveryDone ? "Доставка доступна ✓" : "Доставка от 3 000 ₽"}
        sublabel={
          deliveryDone
            ? "Минимум 3 000 ₽ выполнен"
            : `Осталось ${(DELIVERY_MIN - cartTotal).toLocaleString("ru-RU")} ₽`
        }
        progress={deliveryProgress}
        isComplete={deliveryDone}
      />
      <ProgressBar
        icon={Gift}
        label={freeDone ? "Бесплатная доставка ✓" : "Бесплатная доставка от 7 000 ₽"}
        sublabel={
          !deliveryDone
            ? "Станет доступен после 3 000 ₽"
            : freeDone
            ? "Бесплатная доставка доступна"
            : `Осталось ${(FREE_DELIVERY_MIN - cartTotal).toLocaleString("ru-RU")} ₽`
        }
        progress={freeProgress}
        isComplete={freeDone}
        disabled={!deliveryDone}
      />
    </div>
  );
};

export default CartProgressBars;
