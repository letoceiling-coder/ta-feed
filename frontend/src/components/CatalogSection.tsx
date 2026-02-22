import { MapPin } from "lucide-react";
import SectionHeader from "./SectionHeader";
import ResidentialCard from "./ResidentialCard";

import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";
import property4 from "@/assets/property-4.jpg";
import property5 from "@/assets/property-5.jpg";
import property6 from "@/assets/property-6.jpg";
import property7 from "@/assets/property-7.jpg";
import property8 from "@/assets/property-8.jpg";

const listings = [
  { image: property1, name: "ЖК «Сердце Столицы»", badges: ["Бизнес"], forSale: "В продаже 245 квартир", priceFrom: "от 12.5 млн" },
  { image: property2, name: "ЖК «Савёловский Сити»", badges: ["Комфорт+"], forSale: "В продаже 189 квартир", priceFrom: "от 9.8 млн" },
  { image: property3, name: "ЖК «Прайм Парк»", badges: ["Премиум"], forSale: "В продаже 112 квартир", priceFrom: "от 18.3 млн" },
  { image: property4, name: "ЖК «Город на Реке»", badges: ["Бизнес"], forSale: "В продаже 320 квартир", priceFrom: "от 11.2 млн" },
  { image: property5, name: "ЖК «Новые Черёмушки»", badges: ["Комфорт"], forSale: "В продаже 450 квартир", priceFrom: "от 7.5 млн" },
  { image: property6, name: "ЖК «Кленовый Дом»", badges: ["Элит"], forSale: "В продаже 48 квартир", priceFrom: "от 35.0 млн" },
  { image: property7, name: "ЖК «Парк Легенд»", badges: ["Бизнес"], forSale: "В продаже 167 квартир", priceFrom: "от 14.1 млн" },
  { image: property8, name: "ЖК «Ривер Парк»", badges: ["Комфорт+"], forSale: "В продаже 290 квартир", priceFrom: "от 10.4 млн" },
];

const CatalogSection = () => (
  <section className="lg-container py-10">
    <SectionHeader
      title="Каталог ЖК в"
      highlight="Москве"
      actions={
        <>
          <button className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            <MapPin size={14} /> На карте
          </button>
          <button className="text-sm font-medium text-primary hover:text-lg-blue-hover transition-colors">
            Все предложения
          </button>
        </>
      }
    />
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {listings.slice(0, 4).map((l, i) => (
        <ResidentialCard key={l.name} {...l} showDetails={i === 0} />
      ))}
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-5">
      {listings.slice(4).map((l) => (
        <ResidentialCard key={l.name} {...l} />
      ))}
    </div>
  </section>
);

export default CatalogSection;
