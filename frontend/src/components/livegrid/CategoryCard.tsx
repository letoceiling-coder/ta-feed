import { cn } from "@/lib/utils";
import type { LiveGridCategory } from "@/data/categories.data";

interface CategoryCardProps {
  item: LiveGridCategory;
  className?: string;
}

const CategoryCard = ({ item, className }: CategoryCardProps) => (
  <a
    href={item.href ?? "#"}
    className={cn(
      "relative overflow-hidden rounded-[var(--lg-card-radius)] bg-secondary",
      "shadow-[var(--lg-card-shadow)] hover:shadow-[var(--lg-card-shadow-hover)]",
      "transition-shadow duration-200 cursor-pointer",
      "p-5 flex flex-col justify-between min-h-[140px]",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className,
    )}
  >
    <span className="text-sm font-semibold text-foreground z-10 leading-tight max-w-[60%]">
      {item.title}
    </span>
    <img
      src={item.iconSrc}
      alt=""
      className="absolute right-0 bottom-0 w-[55%] h-[85%] object-contain pointer-events-none"
      loading="lazy"
    />
  </a>
);

export default CategoryCard;
