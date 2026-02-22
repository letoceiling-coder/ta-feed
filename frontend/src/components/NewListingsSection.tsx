import { Heart, ChevronRight, ChevronLeft } from "lucide-react";
import { useState } from "react";
import SectionHeader from "./SectionHeader";

import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";
import property4 from "@/assets/property-4.jpg";
import property5 from "@/assets/property-5.jpg";
import property6 from "@/assets/property-6.jpg";
import property7 from "@/assets/property-7.jpg";
import property8 from "@/assets/property-8.jpg";

const listings = [
  { image: property1, title: "2-комн. кв., 65 м², 12/25 эт.", address: "м. Шелепиха, ЖК «Сердце Столицы»", price: "18 500 000 ₽", pricePerM: "284 615 ₽/м²" },
  { image: property2, title: "1-комн. кв., 42 м², 8/18 эт.", address: "м. Дмитровская, ЖК «Савёловский Сити»", price: "12 300 000 ₽", pricePerM: "292 857 ₽/м²" },
  { image: property3, title: "3-комн. кв., 95 м², 15/30 эт.", address: "м. Ходынка, ЖК «Прайм Парк»", price: "28 700 000 ₽", pricePerM: "302 105 ₽/м²" },
  { image: property4, title: "Студия, 28 м², 5/22 эт.", address: "м. Нагатинская, ЖК «Город на Реке»", price: "7 900 000 ₽", pricePerM: "282 143 ₽/м²" },
  { image: property5, title: "2-комн. кв., 58 м², 10/16 эт.", address: "м. Черёмушки, ЖК «Новые Черёмушки»", price: "14 200 000 ₽", pricePerM: "244 828 ₽/м²" },
  { image: property6, title: "4-комн. кв., 140 м², 6/8 эт.", address: "м. Парк Культуры, «Кленовый Дом»", price: "52 000 000 ₽", pricePerM: "371 429 ₽/м²" },
  { image: property7, title: "1-комн. кв., 45 м², 18/25 эт.", address: "м. Автозаводская, ЖК «Парк Легенд»", price: "13 500 000 ₽", pricePerM: "300 000 ₽/м²" },
  { image: property8, title: "2-комн. кв., 72 м², 9/20 эт.", address: "м. Нагатинская, ЖК «Ривер Парк»", price: "16 800 000 ₽", pricePerM: "233 333 ₽/м²" },
];

const NewListingsSection = () => {
  const [liked, setLiked] = useState<Set<number>>(new Set());

  const toggleLike = (i: number) => {
    setLiked((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  return (
    <section className="lg-container py-10">
      <SectionHeader
        title="Новые объявления"
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

      {/* First row: 4 standard cards + 1 promo card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        {listings.slice(0, 4).map((l, i) => (
          <div key={i} className="rounded-card bg-card shadow-card overflow-hidden group hover:shadow-card-hover transition-shadow">
            <div className="relative aspect-[4/3] overflow-hidden">
              <img src={l.image} alt={l.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
              <button onClick={() => toggleLike(i)} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center">
                <Heart size={16} className={liked.has(i) ? "fill-destructive text-destructive" : "text-muted-foreground"} />
              </button>
            </div>
            <div className="p-3">
              <p className="text-xs text-muted-foreground leading-tight">{l.address}</p>
              <p className="text-sm font-semibold text-foreground mt-1">{l.title}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm font-bold text-foreground">{l.price}</span>
                <span className="text-[11px] text-muted-foreground">{l.pricePerM}</span>
              </div>
            </div>
          </div>
        ))}

        {/* Promo card */}
        <div className="rounded-card bg-primary text-primary-foreground p-5 flex flex-col justify-between min-h-[200px]">
          <div>
            <p className="text-2xl font-bold leading-tight">100 000 +</p>
            <p className="text-sm mt-1 opacity-90">объектов</p>
          </div>
          <a href="#" className="mt-4 inline-flex items-center gap-1 text-sm font-medium opacity-90 hover:opacity-100 transition-opacity">
            Смотреть все <ChevronRight size={14} />
          </a>
        </div>
      </div>

      {/* Second row: 4 cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-5">
        {listings.slice(4, 8).map((l, i) => (
          <div key={i + 4} className="rounded-card bg-card shadow-card overflow-hidden group hover:shadow-card-hover transition-shadow">
            <div className="relative aspect-[4/3] overflow-hidden">
              <img src={l.image} alt={l.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
              <button onClick={() => toggleLike(i + 4)} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center">
                <Heart size={16} className={liked.has(i + 4) ? "fill-destructive text-destructive" : "text-muted-foreground"} />
              </button>
            </div>
            <div className="p-3">
              <p className="text-xs text-muted-foreground leading-tight">{l.address}</p>
              <p className="text-sm font-semibold text-foreground mt-1">{l.title}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm font-bold text-foreground">{l.price}</span>
                <span className="text-[11px] text-muted-foreground">{l.pricePerM}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default NewListingsSection;
