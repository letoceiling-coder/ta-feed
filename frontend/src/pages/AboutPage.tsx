import { motion } from "framer-motion";
import { ArrowLeft, Clock, MapPin, Phone, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AboutPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-8">
      <header className="px-4 pt-4 pb-2 flex items-center gap-3">
        <motion.button whileTap={{ scale: 0.9 }} onClick={() => navigate(-1)} className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
          <ArrowLeft size={20} className="text-foreground" />
        </motion.button>
        <h1 className="text-xl font-extrabold font-display text-foreground">О нас</h1>
      </header>

      <div className="px-4 mt-4 space-y-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl p-5 shadow-card">
          <div className="flex items-center gap-2 mb-3">
            <Heart size={20} className="text-primary" />
            <h2 className="font-bold text-lg text-card-foreground">Наша миссия</h2>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            БыстроЕда — это сервис доставки, созданный с любовью к еде и заботой о вашем времени. 
            Мы доставляем вкусную еду быстро, горячей и с улыбкой!
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card rounded-2xl p-5 shadow-card">
          <div className="flex items-center gap-2 mb-3">
            <Clock size={20} className="text-primary" />
            <h2 className="font-bold text-lg text-card-foreground">Режим работы</h2>
          </div>
          <div className="space-y-1 text-sm text-muted-foreground">
            <p>Пн-Пт: 10:00 — 23:00</p>
            <p>Сб-Вс: 11:00 — 00:00</p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card rounded-2xl p-5 shadow-card">
          <div className="flex items-center gap-2 mb-3">
            <MapPin size={20} className="text-primary" />
            <h2 className="font-bold text-lg text-card-foreground">Адреса</h2>
          </div>
          <div className="space-y-1 text-sm text-muted-foreground">
            <p>ул. Ленина, 42</p>
            <p>пр. Мира, 18</p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-card rounded-2xl p-5 shadow-card">
          <div className="flex items-center gap-2 mb-3">
            <Phone size={20} className="text-primary" />
            <h2 className="font-bold text-lg text-card-foreground">Контакты</h2>
          </div>
          <p className="text-sm text-muted-foreground">+7 (800) 123-45-67</p>
          <p className="text-sm text-muted-foreground">hello@bystroeda.ru</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-card rounded-2xl p-5 shadow-card">
          <h2 className="font-bold text-lg text-card-foreground mb-2">Условия доставки</h2>
          <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
            <li>Бесплатная доставка от 1500 ₽</li>
            <li>Стоимость доставки — 149 ₽</li>
            <li>Среднее время доставки — 30-45 мин</li>
            <li>Зона доставки — до 5 км от ресторана</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutPage;
