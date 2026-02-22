import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tag, X, Check, Loader2 } from "lucide-react";
import { usePromo } from "@/context/PromoContext";
import { toast } from "sonner";

interface Props {
  subtotal: number;
}

const PromoInput = ({ subtotal }: Props) => {
  const { appliedPromo, promoError, applyPromo, removePromo, calculateDiscount, isFreeDelivery, bonusPoints } = usePromo();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleApply = async () => {
    if (!code.trim()) return;
    setLoading(true);
    // Simulate network delay
    await new Promise(r => setTimeout(r, 400));
    const ok = applyPromo(code, subtotal);
    setLoading(false);
    if (ok) {
      toast.success("Промокод применён!");
      setCode("");
    }
  };

  const handleRemove = () => {
    removePromo();
    toast("Промокод удалён");
  };

  const discount = calculateDiscount(subtotal);

  return (
    <div className="space-y-2">
      <AnimatePresence mode="wait">
        {appliedPromo ? (
          <motion.div
            key="applied"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex items-center justify-between bg-accent/10 border-2 border-accent/30 rounded-2xl p-3"
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                <Check size={16} className="text-accent" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-card-foreground truncate">{appliedPromo.code}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {appliedPromo.description}
                  {discount > 0 && ` (−${discount.toLocaleString("ru-RU")} ₽)`}
                  {isFreeDelivery && " (доставка бесплатно)"}
                  {bonusPoints > 0 && ` (+${bonusPoints} баллов)`}
                </p>
              </div>
            </div>
            <motion.button whileTap={{ scale: 0.85 }} onClick={handleRemove} className="p-2 rounded-xl text-muted-foreground flex-shrink-0">
              <X size={16} />
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            key="input"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Tag size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={code}
                  onChange={e => setCode(e.target.value.toUpperCase())}
                  onKeyDown={e => e.key === "Enter" && handleApply()}
                  placeholder="Промокод"
                  maxLength={20}
                  className={`w-full bg-secondary text-foreground rounded-xl py-3 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary/30 border-2 ${promoError ? "border-destructive" : "border-transparent"}`}
                />
              </div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleApply}
                disabled={loading || !code.trim()}
                className="gradient-primary text-primary-foreground px-5 rounded-xl font-bold text-sm shadow-glow disabled:opacity-50 flex items-center"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : "ОК"}
              </motion.button>
            </div>
            <AnimatePresence>
              {promoError && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-xs text-destructive mt-1 pl-1"
                >
                  {promoError}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PromoInput;
