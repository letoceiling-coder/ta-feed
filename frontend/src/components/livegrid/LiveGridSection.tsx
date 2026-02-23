import { useState } from "react";
import RegionSelector from "./RegionSelector";
import SearchBar from "./SearchBar";
import CategoryTabs from "./CategoryTabs";
import CategoryCard from "./CategoryCard";
import { liveGridCategories } from "@/data/categories.data";
import { cn } from "@/lib/utils";

const LiveGridSection = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [region, setRegion] = useState("Москва и МО");

  return (
    <section className={cn("lg-container pt-8 pb-10")} aria-label="Поиск объектов недвижимости">
      <div className="flex flex-col gap-6">
        <RegionSelector value={region} onChange={setRegion} />

        <h1 className="text-3xl md:text-4xl font-extrabold leading-tight text-center">
          <span className="text-primary">Live Grid.</span>{" "}
          <span className="text-foreground">Более 100 000 объектов по России</span>
        </h1>

        <SearchBar showCount={121563} className="max-w-[800px] mx-auto w-full" />

        <CategoryTabs value={activeTab} onChange={setActiveTab} className="max-w-[800px] mx-auto w-full" />

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {liveGridCategories.map((item) => (
            <CategoryCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default LiveGridSection;
