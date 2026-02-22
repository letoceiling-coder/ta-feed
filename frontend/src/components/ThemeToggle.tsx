import { motion } from "framer-motion";
import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

const modes = [
  { value: "system" as const, icon: Monitor, label: "Авто" },
  { value: "light" as const, icon: Sun, label: "Светлая" },
  { value: "dark" as const, icon: Moon, label: "Тёмная" },
];

const ThemeToggle = ({ variant = "icon" }: { variant?: "icon" | "full" }) => {
  const { mode, setMode, resolved } = useTheme();

  if (variant === "icon") {
    const next = resolved === "dark" ? "light" : "dark";
    const Icon = resolved === "dark" ? Sun : Moon;
    return (
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => setMode(next)}
        className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center"
        aria-label="Переключить тему"
      >
        <motion.div
          key={resolved}
          initial={{ rotate: -90, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ duration: 0.25 }}
        >
          <Icon size={20} className="text-foreground" />
        </motion.div>
      </motion.button>
    );
  }

  return (
    <div className="flex gap-1 bg-secondary rounded-xl p-1">
      {modes.map((m) => (
        <motion.button
          key={m.value}
          whileTap={{ scale: 0.95 }}
          onClick={() => setMode(m.value)}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium transition-colors ${
            mode === m.value
              ? "bg-card text-card-foreground shadow-sm"
              : "text-muted-foreground"
          }`}
        >
          <m.icon size={14} />
          {m.label}
        </motion.button>
      ))}
    </div>
  );
};

export default ThemeToggle;
