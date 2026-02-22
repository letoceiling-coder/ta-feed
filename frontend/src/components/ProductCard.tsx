import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import type { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";

interface Props {
  product: Product;
  index: number;
  onOpen: (p: Product) => void;
}

const badgeStyles = {
  hit: "gradient-primary",
  new: "gradient-accent",
  sale: "bg-destructive",
};

const badgeLabels = {
  hit: "🔥 Хит",
  new: "Новинка",
  sale: `-${20}%`,
};

const ProductCard = ({ product, index, onOpen }: Props) => {
  const { addItem, updateQuantity, getItemQuantity } = useCart();
  const qty = getItemQuantity(product.id);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product);
    toast.success(`${product.name} добавлен в корзину`);
  };

  const handleMinus = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateQuantity(product.id, qty - 1);
    if (qty <= 1) {
      toast.info(`${product.name} удалён из корзины`);
    }
  };

  const handlePlus = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateQuantity(product.id, qty + 1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.35 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => onOpen(product)}
      className="relative bg-card rounded-2xl overflow-hidden shadow-card cursor-pointer group"
    >
      {/* Badge */}
      {product.badge && (
        <div
          className={`absolute top-2 left-2 z-10 px-2.5 py-1 rounded-lg text-xs font-bold text-primary-foreground ${badgeStyles[product.badge]}`}
        >
          {badgeLabels[product.badge]}
        </div>
      )}

      {/* Image */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent" />
      </div>

      {/* Content */}
      <div className="p-3">
        <h3 className="font-bold text-sm text-card-foreground leading-tight line-clamp-1">
          {product.name}
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5">{product.calories} ккал · {product.weight}</p>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-baseline gap-1.5">
            <span className="font-extrabold text-base text-card-foreground">{product.price} ₽</span>
            {product.oldPrice && (
              <span className="text-xs text-muted-foreground line-through">{product.oldPrice} ₽</span>
            )}
          </div>

          {/* Fixed-width control container: always 96px wide */}
          <div className="w-24 h-8 flex items-center justify-center relative">
            <AnimatePresence mode="wait" initial={false}>
              {qty === 0 ? (
                <motion.button
                  key="add"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.15 }}
                  whileTap={{ scale: 0.85 }}
                  onClick={handleAdd}
                  className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center text-primary-foreground shadow-glow"
                >
                  <Plus size={18} strokeWidth={2.5} />
                </motion.button>
              ) : (
                <motion.div
                  key="stepper"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-center gap-0.5 bg-secondary rounded-xl px-1 py-0.5 w-full justify-between"
                >
                  <motion.button
                    whileTap={{ scale: 0.85 }}
                    onClick={handleMinus}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-card-foreground"
                  >
                    <Minus size={14} strokeWidth={2.5} />
                  </motion.button>
                  <span className="min-w-[24px] text-center text-sm font-bold text-card-foreground tabular-nums select-none">
                    {qty}
                  </span>
                  <motion.button
                    whileTap={{ scale: 0.85 }}
                    onClick={handlePlus}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-card-foreground"
                  >
                    <Plus size={14} strokeWidth={2.5} />
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
