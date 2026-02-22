import { useState } from "react";
import { Heart, ChevronRight } from "lucide-react";

interface ResidentialCardProps {
  image: string;
  name: string;
  badges: string[];
  forSale: string;
  priceFrom: string;
  showDetails?: boolean;
}

const details = [
  { type: "Студия", area: "от 25 м²", price: "от 5.2 млн" },
  { type: "1-комнатная", area: "от 38 м²", price: "от 7.8 млн" },
  { type: "2-комнатная", area: "от 55 м²", price: "от 11.5 млн" },
  { type: "3-комнатная", area: "от 78 м²", price: "от 16.2 млн" },
];

const ResidentialCard = ({
  image,
  name,
  badges,
  forSale,
  priceFrom,
  showDetails = false,
}: ResidentialCardProps) => {
  const [liked, setLiked] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const isExpanded = showDetails && detailsOpen;

  return (
    <div
      className="rounded-card bg-card shadow-card overflow-hidden transition-shadow duration-200 hover:shadow-card-hover group"
      onMouseEnter={() => showDetails && setDetailsOpen(true)}
      onMouseLeave={() => showDetails && setDetailsOpen(false)}
      onClick={() => {
        if (showDetails && window.innerWidth < 1024) {
          setDetailsOpen((v) => !v);
        }
      }}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute top-3 left-3 flex gap-1.5">
          {badges.map((b) => (
            <span
              key={b}
              className="rounded-badge bg-primary text-primary-foreground text-[11px] font-medium px-2.5 py-1"
            >
              {b}
            </span>
          ))}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setLiked((v) => !v);
          }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center transition-colors hover:bg-card"
        >
          <Heart
            size={16}
            className={liked ? "fill-destructive text-destructive" : "text-muted-foreground"}
          />
        </button>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-[15px] text-foreground leading-tight">{name}</h3>
        <div className="mt-1.5 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{forSale}</span>
          <span className="text-sm font-bold text-foreground">{priceFrom}</span>
        </div>
        <a
          href="#"
          className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-lg-blue-hover transition-colors"
        >
          Подробнее <ChevronRight size={12} />
        </a>
      </div>

      {showDetails && (
        <div
          className={`overflow-hidden transition-all duration-300 ${
            isExpanded ? "max-h-[300px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="border-t border-border px-4 pb-4 pt-3">
            <p className="text-xs font-semibold text-foreground mb-2">Планировки и цены</p>
            <div className="space-y-2">
              {details.map((d) => (
                <div
                  key={d.type}
                  className="flex items-center justify-between text-xs py-1.5 border-b border-border last:border-0"
                >
                  <span className="text-foreground font-medium">{d.type}</span>
                  <span className="text-muted-foreground">{d.area}</span>
                  <span className="font-semibold text-foreground">{d.price}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResidentialCard;
