import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import CategoryTile from "./CategoryTile";

import catApartments from "@/assets/cat-apartments.png";
import catHouses from "@/assets/cat-houses.png";
import catParking from "@/assets/cat-parking.png";
import catLand from "@/assets/cat-land.png";
import catCommercial from "@/assets/cat-commercial.png";
import catMortgage from "@/assets/cat-mortgage.png";
import catNewbuild from "@/assets/cat-newbuild.png";
import catCottage from "@/assets/cat-cottage.png";

const tabs = ["Квартиры", "Паркинги", "Дома с участками", "Участки", "Коммерция"];

const categories = [
  { title: "Новостройки Москвы", image: catNewbuild },
  { title: "Вторичное жильё", image: catApartments },
  { title: "Дома и коттеджи", image: catCottage },
  { title: "Участки", image: catLand },
  { title: "Коммерция", image: catCommercial },
  { title: "Паркинги", image: catParking },
  { title: "Ипотека", image: catMortgage },
  { title: "Загородная недвижимость", image: catHouses },
];

const HeroSection = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section className="lg-container pt-8 pb-4">
      {/* Headline */}
      <div className="text-center mb-6">
        <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">
          <span className="text-primary">Live Grid.</span>{" "}
          <span className="text-foreground">Более 100 000 объектов по России</span>
        </h1>
      </div>

      {/* Search bar */}
      <div className="flex items-center gap-3 max-w-[800px] mx-auto mb-5">
        <div className="flex-1 flex items-center bg-secondary rounded-lg h-12 px-4 gap-3 border border-border">
          <Search size={18} className="text-muted-foreground shrink-0" />
          <input
            type="text"
            placeholder="Поиск по сайту"
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
          />
          <button className="text-muted-foreground hover:text-foreground transition-colors">
            <SlidersHorizontal size={18} />
          </button>
        </div>
        <button className="h-12 px-5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-lg-blue-hover transition-colors whitespace-nowrap">
          Показать 121 563 объекта
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-6 overflow-x-auto max-w-[800px] mx-auto">
        {tabs.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            className={`px-4 py-2 rounded-badge text-sm font-medium whitespace-nowrap transition-colors ${
              i === activeTab
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Category tiles grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <CategoryTile key={cat.title} title={cat.title} image={cat.image} />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
