import { motion } from "framer-motion";
import { ArrowLeft, ChevronRight, MapPin, CreditCard, ClipboardList, Info, User, Coins, Gift, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import BottomNav from "@/components/BottomNav";
import ThemeToggle from "@/components/ThemeToggle";
import ReferralSection from "@/components/ReferralSection";
import RaffleCard from "@/components/RaffleCard";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  const menuItems = [
    { icon: ClipboardList, label: "Мои заказы", to: "/orders" },
    { icon: MapPin, label: "Адреса", to: "/addresses" },
    { icon: CreditCard, label: "Способы оплаты", to: "/payment-methods" },
    { icon: Info, label: "О нас", to: "/about" },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="px-4 pt-4 pb-2 flex items-center gap-3">
        <motion.button whileTap={{ scale: 0.9 }} onClick={() => navigate("/")} className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
          <ArrowLeft size={20} className="text-foreground" />
        </motion.button>
        <h1 className="text-xl font-extrabold font-display text-foreground">Профиль</h1>
      </header>

      {/* Avatar */}
      <div className="flex flex-col items-center mt-6 mb-4">
        <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center shadow-glow">
          <User size={36} className="text-primary-foreground" />
        </div>
        <h2 className="font-bold text-lg text-foreground mt-3">Пользователь</h2>
        <p className="text-sm text-muted-foreground">+7 (***) ***-**-**</p>
      </div>

      {/* Balance */}
      <div className="px-4 mb-4">
        <div className="bg-card rounded-2xl p-4 shadow-card flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full gradient-accent flex items-center justify-center">
              <Coins size={20} className="text-accent-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Баланс баллов</p>
              <p className="text-2xl font-extrabold text-foreground tabular-nums">
                {user.balancePoints.toLocaleString("ru-RU")} <span className="text-sm font-normal text-muted-foreground">= {user.balancePoints.toLocaleString("ru-RU")} ₽</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Theme */}
      <div className="px-4 mb-4">
        <div className="bg-card rounded-2xl p-4 shadow-card">
          <p className="text-sm font-semibold text-card-foreground mb-2">Тема оформления</p>
          <ThemeToggle variant="full" />
        </div>
      </div>

      {/* Referral */}
      <div className="px-4 mb-4">
        <ReferralSection />
      </div>

      {/* Raffle */}
      <div className="px-4 mb-4">
        <RaffleCard />
      </div>

      {/* Menu */}
      <div className="px-4 space-y-2">
        {menuItems.map((item) => (
          <motion.button
            key={item.label}
            whileTap={{ scale: 0.98 }}
            onClick={() => item.to && navigate(item.to)}
            className="w-full flex items-center justify-between bg-card rounded-2xl p-4 shadow-card"
          >
            <div className="flex items-center gap-3">
              <item.icon size={20} className="text-primary" />
              <span className="font-medium text-card-foreground">{item.label}</span>
            </div>
            <ChevronRight size={18} className="text-muted-foreground" />
          </motion.button>
        ))}
      </div>

      <BottomNav active="profile" onNavigate={(tab) => {
        if (tab === "home") navigate("/");
        else if (tab === "cart") navigate("/cart");
        else if (tab === "orders") navigate("/orders");
      }} />
    </div>
  );
};

export default ProfilePage;
