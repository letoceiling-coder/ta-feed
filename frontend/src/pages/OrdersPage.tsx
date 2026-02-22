import { motion } from "framer-motion";
import { ArrowLeft, ClipboardList, RotateCcw, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useOrders } from "@/context/OrderContext";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import BottomNav from "@/components/BottomNav";

const statusLabels: Record<string, { label: string; color: string }> = {
  processing: { label: "В обработке", color: "text-muted-foreground" },
  cooking: { label: "Готовится", color: "text-primary" },
  delivery: { label: "В пути", color: "text-accent" },
  delivered: { label: "Доставлен", color: "text-accent" },
};

const OrdersPage = () => {
  const navigate = useNavigate();
  const { orders } = useOrders();
  const { addItem } = useCart();

  const repeatOrder = (order: typeof orders[0]) => {
    order.items.forEach((item) => {
      for (let i = 0; i < item.quantity; i++) {
        addItem(item.product, item.selectedSize, item.selectedExtras);
      }
    });
    toast.success("Товары добавлены в корзину");
    navigate("/cart");
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="px-4 pt-4 pb-2 flex items-center gap-3">
        <motion.button whileTap={{ scale: 0.9 }} onClick={() => navigate(-1)} className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
          <ArrowLeft size={20} className="text-foreground" />
        </motion.button>
        <h1 className="text-xl font-extrabold font-display text-foreground">Мои заказы</h1>
      </header>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <ClipboardList size={64} className="mb-4 opacity-20" />
          <p className="font-bold text-lg">Пока нет заказов</p>
          <p className="text-sm mt-1">Ваши заказы появятся здесь</p>
        </div>
      ) : (
        <div className="px-4 space-y-3 mt-2">
          {orders.map((order, idx) => {
            const st = statusLabels[order.status];
            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-card rounded-2xl p-4 shadow-card"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-card-foreground text-sm">{order.id}</span>
                  <span className={`text-xs font-bold ${st.color}`}>{st.label}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {new Date(order.createdAt).toLocaleDateString("ru-RU", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })}
                </p>
                <div className="flex items-center gap-2 mt-2 overflow-hidden">
                  {order.items.slice(0, 3).map((item) => (
                    <img key={item.product.id} src={item.product.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                  ))}
                  {order.items.length > 3 && (
                    <span className="text-xs text-muted-foreground font-medium">+{order.items.length - 3}</span>
                  )}
                </div>
                <div className="flex items-center justify-between mt-3">
                  <span className="font-extrabold text-card-foreground">{order.total} ₽</span>
                  <div className="flex gap-2">
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => repeatOrder(order)}
                      className="flex items-center gap-1 bg-secondary text-secondary-foreground px-3 py-2 rounded-xl text-xs font-bold"
                    >
                      <RotateCcw size={14} /> Повторить
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <BottomNav active="orders" onNavigate={(tab) => {
        if (tab === "home") navigate("/");
        else if (tab === "cart") navigate("/cart");
        else if (tab === "profile") navigate("/profile");
      }} />
    </div>
  );
};

export default OrdersPage;
