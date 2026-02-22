import { motion } from "framer-motion";
import { Share2, Users, Gift, Copy } from "lucide-react";
import { useUser, REFERRER_BONUS, REFERRAL_WELCOME_BONUS } from "@/context/UserContext";
import { toast } from "sonner";

const ReferralSection = () => {
  const { user } = useUser();

  const referralLink = `https://t.me/YumExpressBot?start=ref_${user.id}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink).then(() => {
      toast.success("Ссылка скопирована!");
    }).catch(() => {
      toast.error("Не удалось скопировать");
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: "Yum Express", text: `Закажи еду в Yum Express и получи ${REFERRAL_WELCOME_BONUS} баллов!`, url: referralLink });
    } else {
      handleCopy();
    }
  };

  return (
    <div className="space-y-3">
      <div className="bg-card rounded-2xl p-4 shadow-card">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
            <Gift size={20} className="text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-bold text-card-foreground text-sm">Пригласи друга</h3>
            <p className="text-xs text-muted-foreground">Получи {REFERRER_BONUS} баллов за каждого!</p>
          </div>
        </div>

        <div className="bg-secondary rounded-xl p-3 mb-3">
          <p className="text-[11px] text-muted-foreground mb-1">Твоя ссылка</p>
          <div className="flex items-center gap-2">
            <p className="text-xs font-mono text-card-foreground truncate flex-1">{referralLink}</p>
            <motion.button whileTap={{ scale: 0.85 }} onClick={handleCopy} className="p-2 rounded-lg bg-card">
              <Copy size={14} className="text-muted-foreground" />
            </motion.button>
          </div>
        </div>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleShare}
          className="w-full gradient-primary text-primary-foreground py-3 rounded-xl font-bold text-sm shadow-glow flex items-center justify-center gap-2"
        >
          <Share2 size={16} /> Поделиться
        </motion.button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-card rounded-2xl p-3 shadow-card text-center">
          <Users size={18} className="text-primary mx-auto mb-1" />
          <p className="text-lg font-extrabold text-card-foreground tabular-nums">{user.referralsCount}</p>
          <p className="text-[11px] text-muted-foreground">Приглашённых</p>
        </div>
        <div className="bg-card rounded-2xl p-3 shadow-card text-center">
          <Gift size={18} className="text-accent mx-auto mb-1" />
          <p className="text-lg font-extrabold text-card-foreground tabular-nums">{user.referralBonusEarned.toLocaleString("ru-RU")}</p>
          <p className="text-[11px] text-muted-foreground">Баллов получено</p>
        </div>
      </div>

      <p className="text-[11px] text-muted-foreground text-center px-2">
        Друг получит {REFERRAL_WELCOME_BONUS} баллов, а ты — {REFERRER_BONUS} баллов после его первого заказа
      </p>
    </div>
  );
};

export default ReferralSection;
