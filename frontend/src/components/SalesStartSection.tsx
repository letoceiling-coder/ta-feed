import { ChevronLeft, ChevronRight } from "lucide-react";
import SectionHeader from "./SectionHeader";
import ResidentialCard from "./ResidentialCard";

import property11 from "@/assets/property-11.jpg";
import property12 from "@/assets/property-12.jpg";
import property5 from "@/assets/property-5.jpg";
import property8 from "@/assets/property-8.jpg";

const sales = [
  { image: property11, name: "ЖК «Новая Звезда»", badges: ["Старт продаж"], forSale: "В продаже 500 квартир", priceFrom: "от 5.9 млн" },
  { image: property12, name: "ЖК «Метрополия»", badges: ["Старт продаж"], forSale: "В продаже 380 квартир", priceFrom: "от 8.1 млн" },
  { image: property5, name: "ЖК «Южные Кварталы»", badges: ["Старт продаж"], forSale: "В продаже 620 квартир", priceFrom: "от 6.3 млн" },
  { image: property8, name: "ЖК «Водный»", badges: ["Старт продаж"], forSale: "В продаже 270 квартир", priceFrom: "от 9.5 млн" },
];

const SalesStartSection = () => (
  <section className="lg-container py-10">
    <SectionHeader
      title="Старт продаж"
      actions={
        <div className="flex items-center gap-2">
          <button className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft size={16} />
          </button>
          <button className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
            <ChevronRight size={16} />
          </button>
        </div>
      }
    />
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {sales.map((s) => (
        <ResidentialCard key={s.name} {...s} />
      ))}
    </div>
  </section>
);

export default SalesStartSection;
