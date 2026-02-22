import { motion } from "framer-motion";
import { ArrowLeft, CreditCard, Banknote, Smartphone, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usePaymentMethods, type PaymentMethod } from "@/hooks/usePaymentMethods";
import { toast } from "sonner";

const methods: { id: PaymentMethod; icon: React.ElementType; label: string }[] = [
  { id: "card_online", icon: CreditCard, label: "Картой онлайн" },
  { id: "card_courier", icon: CreditCard, label: "Картой курьеру" },
  { id: "cash", icon: Banknote, label: "Наличными" },
  { id: "sbp", icon: Zap, label: "СБП" },
];

const PaymentMethodsPage = () => {
  const navigate = useNavigate();
  const { selected, select } = usePaymentMethods();

  const handleSelect = (id: PaymentMethod) => {
    select(id);
    toast.success("Способ оплаты сохранён");
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="px-4 pt-4 pb-2 flex items-center gap-3">
        <motion.button whileTap={{ scale: 0.9 }} onClick={() => navigate(-1)} className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
          <ArrowLeft size={20} className="text-foreground" />
        </motion.button>
        <div>
          <h1 className="text-xl font-extrabold font-display text-foreground">Способы оплаты</h1>
          <p className="text-xs text-muted-foreground">Выберите удобный способ оплаты</p>
        </div>
      </header>

      <div className="px-4 mt-4 space-y-2">
        {methods.map((method) => (
          <motion.button
            key={method.id}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleSelect(method.id)}
            className={`w-full flex items-center gap-3 p-4 rounded-2xl text-sm font-medium transition-all ${
              selected === method.id
                ? "bg-primary/10 border-2 border-primary text-foreground"
                : "bg-card border-2 border-transparent text-card-foreground shadow-card"
            }`}
          >
            <method.icon size={20} className={selected === method.id ? "text-primary" : "text-muted-foreground"} />
            <span className="flex-1 text-left">{method.label}</span>
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
              selected === method.id ? "border-primary" : "border-muted-foreground"
            }`}>
              {selected === method.id && <div className="w-2.5 h-2.5 rounded-full gradient-primary" />}
            </div>
          </motion.button>
        ))}
      </div>

      <p className="px-4 mt-4 text-xs text-muted-foreground">
        Выбранный способ оплаты будет использоваться по умолчанию при оформлении заказа
      </p>
    </div>
  );
};

export default PaymentMethodsPage;
