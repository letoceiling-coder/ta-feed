import { motion } from "framer-motion";
import { Trophy, Timer, Users, Star } from "lucide-react";
import { useRaffle } from "@/context/RaffleContext";
import { useUser } from "@/context/UserContext";

const RaffleCard = () => {
  const { raffle, timeUntilEnd, prizes } = useRaffle();
  const { user } = useUser();

  const days = Math.floor(timeUntilEnd / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeUntilEnd / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((timeUntilEnd / (1000 * 60)) % 60);

  const isParticipant = raffle.participantIds.includes(user.id);
  const totalPrize = prizes.reduce((s, p) => s + p, 0);

  // Check if user won in past
  const userWin = raffle.pastWinners.find(w => w.userId === user.id);

  return (
    <div className="space-y-3">
      <div className="bg-card rounded-2xl p-4 shadow-card overflow-hidden relative">
        {/* Decorative */}
        <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full gradient-warm opacity-10" />
        
        <div className="flex items-center gap-2 mb-3 relative">
          <div className="w-10 h-10 rounded-full gradient-warm flex items-center justify-center">
            <Trophy size={20} className="text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-bold text-card-foreground text-sm">Ежемесячный розыгрыш</h3>
            <p className="text-xs text-muted-foreground">Сделай заказ — участвуй!</p>
          </div>
        </div>

        {/* Timer */}
        <div className="flex gap-2 mb-3">
          {[
            { val: days, label: "дн" },
            { val: hours, label: "ч" },
            { val: minutes, label: "мин" },
          ].map(({ val, label }) => (
            <div key={label} className="flex-1 bg-secondary rounded-xl p-2 text-center">
              <p className="text-lg font-extrabold text-card-foreground tabular-nums">{val}</p>
              <p className="text-[10px] text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>

        {/* Prize fund */}
        <div className="bg-secondary rounded-xl p-3 mb-3">
          <p className="text-[11px] text-muted-foreground mb-1">Призовой фонд</p>
          <p className="text-xl font-extrabold text-card-foreground tabular-nums">{totalPrize.toLocaleString("ru-RU")} баллов</p>
          <div className="flex gap-3 mt-2">
            {prizes.map((p, i) => (
              <div key={i} className="flex items-center gap-1">
                <Star size={12} className={i === 0 ? "text-primary" : "text-muted-foreground"} />
                <span className="text-xs text-muted-foreground tabular-nums">{p.toLocaleString("ru-RU")}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Users size={14} className="text-muted-foreground" />
            <span className="text-xs text-muted-foreground tabular-nums">{raffle.participantIds.length} участников</span>
          </div>
          {isParticipant ? (
            <span className="text-xs font-bold text-accent">Вы участвуете ✓</span>
          ) : (
            <span className="text-xs text-muted-foreground">Сделайте заказ для участия</span>
          )}
        </div>
      </div>

      {/* User win banner */}
      {userWin && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-accent/10 border-2 border-accent/30 rounded-2xl p-4 text-center"
        >
          <Trophy size={28} className="text-accent mx-auto mb-2" />
          <p className="font-bold text-card-foreground text-sm">Вы выиграли!</p>
          <p className="text-xs text-muted-foreground mt-1">
            {userWin.place} место — {userWin.points.toLocaleString("ru-RU")} баллов ({userWin.month})
          </p>
        </motion.div>
      )}

      {/* Past winners */}
      {raffle.pastWinners.length > 0 && (
        <div className="bg-card rounded-2xl p-4 shadow-card">
          <h4 className="text-xs font-bold text-card-foreground mb-2">Прошлые победители</h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {raffle.pastWinners.slice(0, 9).map((w, i) => (
              <div key={i} className="flex justify-between text-xs text-muted-foreground">
                <span>{w.month} · {w.place} место</span>
                <span className="font-bold tabular-nums">{w.points.toLocaleString("ru-RU")} баллов</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RaffleCard;
