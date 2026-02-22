import { Search } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  value: string;
  onChange: (v: string) => void;
}

const SearchBar = ({ value, onChange }: Props) => (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    className="px-4 pb-3"
  >
    <div className="relative">
      <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Найти блюдо..."
        className="w-full bg-secondary text-foreground placeholder:text-muted-foreground rounded-xl py-3 pl-10 pr-4 text-sm font-medium border-0 outline-none focus:ring-2 focus:ring-primary/30 transition-all"
      />
    </div>
  </motion.div>
);

export default SearchBar;
