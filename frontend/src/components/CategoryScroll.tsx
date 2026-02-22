import { useRef } from "react";
import { motion } from "framer-motion";
import { categories } from "@/data/products";

interface Props {
  active: string;
  onSelect: (id: string) => void;
}

const CategoryScroll = ({ active, onSelect }: Props) => {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div className="sticky top-0 z-20 glass py-3">
      <div
        ref={ref}
        className="flex gap-2 overflow-x-auto hide-scrollbar px-4 snap-x snap-mandatory"
      >
        {categories.map((cat) => (
          <motion.button
            key={cat.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(cat.id)}
            className={`flex-shrink-0 snap-start px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
              active === cat.id
                ? "gradient-primary text-primary-foreground shadow-glow"
                : "bg-secondary text-secondary-foreground hover:bg-muted"
            }`}
          >
            <span className="mr-1">{cat.emoji}</span>
            {cat.name}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default CategoryScroll;
