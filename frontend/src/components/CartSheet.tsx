import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import CartProgressBars from "@/components/CartProgressBars";

interface Props {
  open: boolean;
  onClose: () => void;
}

const CartSheet = ({ open, onClose }: Props) => {
  const { items, updateQuantity, removeItem, totalPrice, clearCart } = useCart();

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="cart-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm"
          />
          <motion.div
            key="cart-sheet"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 z-50 max-h-[85vh] bg-card rounded-t-3xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 pb-3">
              <h2 className="text-xl font-extrabold font-display text-card-foreground">Корзина</h2>
              <div className="flex gap-2">
                {items.length > 0 && (
                  <button onClick={clearCart} className="p-2 rounded-xl bg-secondary text-muted-foreground">
                    <Trash2 size={18} />
                  </button>
                )}
                <button onClick={onClose} className="p-2 rounded-xl bg-secondary text-card-foreground">
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Delivery progress */}
            {items.length > 0 && (
              <div className="px-5 pb-3">
                <CartProgressBars cartTotal={totalPrice} />
              </div>
            )}

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5 pb-32">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                  <ShoppingBag size={48} className="mb-3 opacity-30" />
                  <p className="font-semibold text-lg">Корзина пуста</p>
                  <p className="text-sm mt-1">Добавьте что-нибудь вкусное!</p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {items.map((item) => (
                    <motion.div
                      key={item.product.id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex gap-3 bg-secondary rounded-2xl p-3"
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm text-card-foreground truncate">{item.product.name}</h4>
                        <p className="text-xs text-muted-foreground mt-0.5">{item.product.weight}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="font-extrabold text-card-foreground">
                            {item.product.price * item.quantity} ₽
                          </span>
                          <div className="flex items-center gap-1.5 bg-card rounded-xl px-1 py-0.5">
                            <motion.button
                              whileTap={{ scale: 0.85 }}
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="w-7 h-7 rounded-lg flex items-center justify-center text-card-foreground"
                            >
                              <Minus size={14} />
                            </motion.button>
                            <span className="w-5 text-center text-sm font-bold text-card-foreground">{item.quantity}</span>
                            <motion.button
                              whileTap={{ scale: 0.85 }}
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="w-7 h-7 rounded-lg flex items-center justify-center text-card-foreground"
                            >
                              <Plus size={14} />
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom */}
            {items.length > 0 && (
              <div className="absolute bottom-0 inset-x-0 p-4 glass safe-bottom">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  className="w-full gradient-primary text-primary-foreground py-4 rounded-2xl font-bold text-base shadow-glow flex items-center justify-center gap-2"
                >
                  Оформить заказ · {totalPrice} ₽
                </motion.button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartSheet;
