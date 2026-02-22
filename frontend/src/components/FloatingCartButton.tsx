import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";

interface Props {
  onClick: () => void;
}

const FloatingCartButton = ({ onClick }: Props) => {
  const { totalItems, totalPrice } = useCart();

  return (
    <AnimatePresence>
      {totalItems > 0 && (
        <motion.button
          initial={{ scale: 0, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0, y: 50 }}
          whileTap={{ scale: 0.92 }}
          onClick={onClick}
          className="fixed bottom-20 left-4 right-4 z-40 gradient-primary text-primary-foreground py-4 rounded-2xl font-bold shadow-glow flex items-center justify-center gap-3"
        >
          <div className="relative">
            <ShoppingBag size={20} />
            <span className="absolute -top-2 -right-2 w-5 h-5 gradient-accent text-accent-foreground rounded-full text-xs font-bold flex items-center justify-center">
              {totalItems}
            </span>
          </div>
          <span>Корзина · {totalPrice} ₽</span>
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default FloatingCartButton;
