interface CategoryTileProps {
  title: string;
  image: string;
  className?: string;
}

const CategoryTile = ({ title, image, className = "" }: CategoryTileProps) => {
  return (
    <div
      className={`relative overflow-hidden rounded-tile bg-secondary cursor-pointer transition-shadow duration-200 hover:shadow-card-hover p-5 flex flex-col justify-between min-h-[140px] ${className}`}
    >
      <span className="text-sm font-semibold text-foreground z-10 leading-tight max-w-[60%]">
        {title}
      </span>
      <img
        src={image}
        alt={title}
        className="absolute right-0 bottom-0 w-[55%] h-[85%] object-contain pointer-events-none"
      />
    </div>
  );
};

export default CategoryTile;
