import { ChevronLeft, ChevronRight } from "lucide-react";
import SectionHeader from "./SectionHeader";
import ResidentialCard from "./ResidentialCard";

import property9 from "@/assets/property-9.jpg";
import property10 from "@/assets/property-10.jpg";
import property3 from "@/assets/property-3.jpg";
import property4 from "@/assets/property-4.jpg";

const deals = [
  { image: property9, name: "ЖК «Люблинский Парк»", badges: ["Скидка 10%"], forSale: "В продаже 180 квартир", priceFrom: "от 8.9 млн" },
  { image: property10, name: "ЖК «Остров»", badges: ["Акция"], forSale: "В продаже 95 квартир", priceFrom: "от 15.6 млн" },
  { image: property3, name: "ЖК «Михайловский Парк»", badges: ["Рассрочка"], forSale: "В продаже 210 квартир", priceFrom: "от 6.7 млн" },
  { image: property4, name: "ЖК «Зелёный Бульвар»", badges: ["Ипотека 0%"], forSale: "В продаже 340 квартир", priceFrom: "от 7.2 млн" },
];

const HotDealsSection = () => (
  <section className="lg-container py-10">
    <SectionHeader
      title="Горячие предложения"
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
      {deals.map((d) => (
        <ResidentialCard key={d.name} {...d} />
      ))}
    </div>
  </section>
);

export default HotDealsSection;
