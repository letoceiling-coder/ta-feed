import { motion } from "framer-motion";
import { Home, ShoppingBag, ClipboardList, User } from "lucide-react";
import { useCart } from "@/context/CartContext";

interface Props {
  active: string;
  onNavigate: (tab: string) => void;
}

const tabs = [
  { id: "home", icon: Home, label: "Главная" },
  { id: "cart", icon: ShoppingBag, label: "Корзина" },
  { id: "orders", icon: ClipboardList, label: "Заказы" },
  { id: "profile", icon: User, label: "Профиль" },
];

const BottomNav = ({ active, onNavigate }: Props) => {
  const { totalItems } = useCart();

  return (
    <nav className="fixed bottom-0 inset-x-0 z-30 glass border-t border-border safe-bottom">
      <div className="flex items-center justify-around py-2 px-2">
        {tabs.map((tab) => {
          const isActive = active === tab.id;
          return (
            <motion.button
              key={tab.id}
              whileTap={{ scale: 0.9 }}
              onClick={() => onNavigate(tab.id)}
              className="flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl relative"
            >
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute -top-0.5 w-8 h-1 rounded-full gradient-primary"
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                />
              )}
              <div className="relative">
                <tab.icon
                  size={22}
                  className={`transition-colors ${isActive ? "text-primary" : "text-muted-foreground"}`}
                />
                {tab.id === "cart" && totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1.5 -right-2.5 min-w-[16px] h-4 px-1 gradient-accent text-accent-foreground rounded-full text-[10px] font-bold flex items-center justify-center"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </div>
              <span
                className={`text-[10px] font-semibold transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {tab.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
