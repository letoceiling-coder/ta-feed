import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Coins } from "lucide-react";
import { useUser } from "@/context/UserContext";

interface Props {
  maxDeductible: number; // max points that can be used (min of balance and subtotal after discount)
  onPointsChange: (points: number) => void;
}

const PointsSlider = ({ maxDeductible, onPointsChange }: Props) => {
  const { user } = useUser();
  const [usePoints, setUsePoints] = useState(false);
  const [points, setPoints] = useState(0);
  const max = Math.min(user.balancePoints, maxDeductible);

  useEffect(() => {
    if (!usePoints) {
      setPoints(0);
      onPointsChange(0);
    }
  }, [usePoints, onPointsChange]);

  useEffect(() => {
    if (points > max) {
      setPoints(max);
      onPointsChange(max);
    }
  }, [max, points, onPointsChange]);

  if (user.balancePoints <= 0) return null;

  return (
    <div className="bg-card rounded-2xl p-4 shadow-card space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Coins size={18} className="text-primary" />
          <span className="text-sm font-bold text-card-foreground">Баллы</span>
          <span className="text-xs text-muted-foreground tabular-nums">({user.balancePoints.toLocaleString("ru-RU")} доступно)</span>
        </div>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setUsePoints(!usePoints)}
          className={`w-11 h-6 rounded-full relative transition-colors duration-200 ${usePoints ? "bg-primary" : "bg-muted"}`}
        >
          <motion.div
            className="w-5 h-5 bg-primary-foreground rounded-full absolute top-0.5 shadow"
            animate={{ left: usePoints ? 22 : 2 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        </motion.button>
      </div>

      {usePoints && max > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-2"
        >
          <input
            type="range"
            min={0}
            max={max}
            step={10}
            value={points}
            onChange={e => {
              const v = Number(e.target.value);
              setPoints(v);
              onPointsChange(v);
            }}
            className="w-full accent-primary"
          />
          <div className="flex justify-between text-xs text-muted-foreground tabular-nums">
            <span>0</span>
            <span className="font-bold text-card-foreground">−{points.toLocaleString("ru-RU")} ₽</span>
            <span>{max.toLocaleString("ru-RU")}</span>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default PointsSlider;
