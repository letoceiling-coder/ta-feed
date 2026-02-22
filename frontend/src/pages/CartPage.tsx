import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import CartProgressBars from "@/components/CartProgressBars";
import PromoInput from "@/components/PromoInput";

const CartPage = () => {
  const navigate = useNavigate();
  const { items, updateQuantity, removeItem, totalPrice, clearCart, totalItems } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="px-4 pt-4 pb-2 flex items-center gap-3">
          <motion.button whileTap={{ scale: 0.9 }} onClick={() => navigate(-1)} className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
            <ArrowLeft size={20} className="text-foreground" />
          </motion.button>
          <h1 className="text-xl font-extrabold font-display text-foreground">Корзина</h1>
        </header>
        <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground px-4">
          <ShoppingBag size={64} className="mb-4 opacity-20" />
          <p className="font-bold text-lg">Корзина пуста</p>
          <p className="text-sm mt-1 text-center">Добавьте что-нибудь вкусное из каталога!</p>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/")}
            className="mt-6 gradient-primary text-primary-foreground py-3 px-8 rounded-2xl font-bold shadow-glow"
          >
            К каталогу
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-32">
      <header className="px-4 pt-4 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.button whileTap={{ scale: 0.9 }} onClick={() => navigate(-1)} className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
            <ArrowLeft size={20} className="text-foreground" />
          </motion.button>
          <h1 className="text-xl font-extrabold font-display text-foreground">Корзина</h1>
          <span className="text-sm text-muted-foreground">{totalItems} шт.</span>
        </div>
        <motion.button whileTap={{ scale: 0.9 }} onClick={clearCart} className="p-2 rounded-xl bg-secondary text-muted-foreground">
          <Trash2 size={18} />
        </motion.button>
      </header>

      {/* Delivery progress */}
      <div className="px-4 py-3">
        <CartProgressBars cartTotal={totalPrice} />
      </div>

      {/* Items */}
      <div className="px-4 flex flex-col gap-3">
        <AnimatePresence>
          {items.map((item) => (
            <motion.div
              key={item.product.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0 }}
              className="flex gap-3 bg-card rounded-2xl p-3 shadow-card"
            >
              <img
                src={item.product.image}
                alt={item.product.name}
                className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <h4 className="font-bold text-sm text-card-foreground truncate pr-2">{item.product.name}</h4>
                  <motion.button whileTap={{ scale: 0.85 }} onClick={() => removeItem(item.product.id)} className="text-muted-foreground p-1 flex-shrink-0">
                    <Trash2 size={14} />
                  </motion.button>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{item.product.weight}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="font-extrabold text-card-foreground">
                    {item.product.price * item.quantity} ₽
                  </span>
                  <div className="flex items-center gap-1 bg-secondary rounded-xl px-1 py-0.5">
                    <motion.button
                      whileTap={{ scale: 0.85 }}
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-card-foreground"
                    >
                      <Minus size={14} />
                    </motion.button>
                    <span className="min-w-[24px] text-center text-sm font-bold text-card-foreground tabular-nums">{item.quantity}</span>
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
        </AnimatePresence>
      </div>

      {/* Promo code */}
      <div className="px-4 mt-4">
        <PromoInput subtotal={totalPrice} />
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 inset-x-0 p-4 glass safe-bottom z-30">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/checkout")}
          className="w-full gradient-primary text-primary-foreground py-4 rounded-2xl font-bold text-base shadow-glow flex items-center justify-center gap-2"
        >
          Оформить заказ · {totalPrice} ₽
        </motion.button>
      </div>
    </div>
  );
};

export default CartPage;
