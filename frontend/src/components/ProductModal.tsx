import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus } from "lucide-react";
import type { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";

interface Props {
  product: Product | null;
  onClose: () => void;
}

const ProductModal = ({ product, onClose }: Props) => {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(0);
  const [selectedExtras, setSelectedExtras] = useState<Set<string>>(new Set());

  if (!product) return null;

  const sizePrice = product.sizes?.[selectedSize]?.priceAdd ?? 0;
  const extrasPrice = Array.from(selectedExtras).reduce((sum, name) => {
    const extra = product.extras?.find((e) => e.name === name);
    return sum + (extra?.price ?? 0);
  }, 0);
  const totalPrice = (product.price + sizePrice + extrasPrice) * quantity;

  const toggleExtra = (name: string) => {
    setSelectedExtras((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const handleAdd = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product, product.sizes?.[selectedSize]?.name, Array.from(selectedExtras));
    }
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm"
      />
      <motion.div
        key="modal"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
        className="fixed inset-x-0 bottom-0 z-50 max-h-[92vh] bg-card rounded-t-3xl overflow-hidden flex flex-col"
      >
        {/* Image */}
        <div className="relative h-64 flex-shrink-0">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full glass flex items-center justify-center"
          >
            <X size={18} className="text-foreground" />
          </button>
          {product.badge && (
            <div className={`absolute top-4 left-4 px-3 py-1 rounded-lg text-xs font-bold text-primary-foreground ${product.badge === "hit" ? "gradient-primary" : product.badge === "sale" ? "bg-destructive" : "gradient-accent"}`}>
              {product.badge === "hit" ? "🔥 Хит" : product.badge === "sale" ? "-20%" : "Новинка"}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 pb-32">
          <h2 className="text-2xl font-extrabold font-display text-card-foreground mt-3">{product.name}</h2>
          <p className="text-sm text-muted-foreground mt-1">{product.description}</p>

          {/* Nutrition */}
          <div className="flex gap-3 mt-4">
            {[
              { label: "Ккал", value: product.calories },
              { label: "Белки", value: `${product.nutrition.protein}г` },
              { label: "Жиры", value: `${product.nutrition.fat}г` },
              { label: "Углев.", value: `${product.nutrition.carbs}г` },
            ].map((n) => (
              <div key={n.label} className="flex-1 bg-secondary rounded-xl p-2.5 text-center">
                <div className="text-sm font-bold text-secondary-foreground">{n.value}</div>
                <div className="text-xs text-muted-foreground">{n.label}</div>
              </div>
            ))}
          </div>

          {/* Sizes */}
          {product.sizes && (
            <div className="mt-5">
              <h4 className="text-sm font-bold text-card-foreground mb-2">Размер</h4>
              <div className="flex gap-2">
                {product.sizes.map((s, i) => (
                  <button
                    key={s.name}
                    onClick={() => setSelectedSize(i)}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      selectedSize === i
                        ? "gradient-primary text-primary-foreground shadow-glow"
                        : "bg-secondary text-secondary-foreground"
                    }`}
                  >
                    {s.name}
                    {s.priceAdd > 0 && <span className="opacity-70 ml-1">+{s.priceAdd}₽</span>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Extras */}
          {product.extras && (
            <div className="mt-5">
              <h4 className="text-sm font-bold text-card-foreground mb-2">Добавки</h4>
              <div className="flex flex-col gap-2">
                {product.extras.map((ex) => (
                  <button
                    key={ex.name}
                    onClick={() => toggleExtra(ex.name)}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-all ${
                      selectedExtras.has(ex.name)
                        ? "bg-primary/10 border-2 border-primary"
                        : "bg-secondary border-2 border-transparent"
                    }`}
                  >
                    <span className="font-medium text-card-foreground">{ex.name}</span>
                    <span className="font-bold text-muted-foreground">+{ex.price} ₽</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Ingredients */}
          <div className="mt-5">
            <h4 className="text-sm font-bold text-card-foreground mb-2">Состав</h4>
            <p className="text-sm text-muted-foreground">{product.ingredients.join(", ")}</p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="absolute bottom-0 inset-x-0 p-4 glass safe-bottom">
          <div className="flex items-center gap-3">
            {/* Quantity */}
            <div className="flex items-center gap-2 bg-secondary rounded-xl px-2 py-1.5">
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-card-foreground"
              >
                <Minus size={16} />
              </motion.button>
              <span className="w-6 text-center font-bold text-card-foreground">{quantity}</span>
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={() => setQuantity((q) => q + 1)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-card-foreground"
              >
                <Plus size={16} />
              </motion.button>
            </div>

            {/* Add button */}
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={handleAdd}
              className="flex-1 gradient-primary text-primary-foreground py-3.5 rounded-xl font-bold text-base shadow-glow"
            >
              Добавить · {totalPrice} ₽
            </motion.button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProductModal;
