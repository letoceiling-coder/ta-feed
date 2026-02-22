import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight, Coins } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

const OrderSuccessPage = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const orderId = params.get("id") || "???";
  const cashback = Number(params.get("cashback") || 0);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.1 }}
      >
        <CheckCircle2 size={80} className="text-accent mx-auto" strokeWidth={1.5} />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-2xl font-extrabold font-display text-foreground mt-6"
      >
        Заказ оформлен!
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-muted-foreground mt-2"
      >
        Номер заказа: <span className="font-bold text-foreground">{orderId}</span>
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-sm text-muted-foreground mt-1"
      >
        Ожидаемое время: 30-45 мин
      </motion.p>

      {cashback > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, type: "spring" }}
          className="mt-4 flex items-center gap-2 bg-accent/10 px-4 py-2 rounded-2xl"
        >
          <Coins size={18} className="text-accent" />
          <span className="text-sm font-bold text-accent tabular-nums">+{cashback} баллов начислено</span>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="flex flex-col gap-3 mt-8 w-full max-w-xs"
      >
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/orders")}
          className="w-full gradient-primary text-primary-foreground py-4 rounded-2xl font-bold shadow-glow flex items-center justify-center gap-2"
        >
          Мои заказы <ArrowRight size={18} />
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/")}
          className="w-full bg-secondary text-secondary-foreground py-4 rounded-2xl font-bold"
        >
          На главную
        </motion.button>
      </motion.div>
    </div>
  );
};

export default OrderSuccessPage;
