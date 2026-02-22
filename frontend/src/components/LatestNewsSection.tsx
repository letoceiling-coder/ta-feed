import SectionHeader from "./SectionHeader";

import news1 from "@/assets/news-1.jpg";
import news2 from "@/assets/news-2.jpg";
import news3 from "@/assets/news-3.jpg";
import news4 from "@/assets/news-4.jpg";

const articles = [
  { image: news1, tag: "Рынок", title: "Цены на квартиры в Москве: прогноз на 2025 год", date: "15 фев 2025" },
  { image: news2, tag: "Ремонт", title: "Как сделать ремонт в новостройке: пошаговое руководство", date: "12 фев 2025" },
  { image: news3, tag: "Ипотека", title: "Семейная ипотека: условия и требования в 2025 году", date: "10 фев 2025" },
  { image: news4, tag: "Новостройки", title: "Топ-10 новых жилых комплексов Москвы с лучшей инфраструктурой", date: "8 фев 2025" },
];

const LatestNewsSection = () => (
  <section className="lg-container py-10">
    <SectionHeader
      title="Последние новости"
      actions={
        <a href="#" className="text-sm font-medium text-primary hover:text-lg-blue-hover transition-colors">
          Все новости
        </a>
      }
    />

    {/* First row: 2 large cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
      {articles.slice(0, 2).map((a) => (
        <a key={a.title} href="#" className="rounded-card overflow-hidden bg-card shadow-card group hover:shadow-card-hover transition-shadow block">
          <div className="relative aspect-[16/9] overflow-hidden">
            <img src={a.image} alt={a.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
            <span className="absolute top-3 left-3 rounded-badge bg-primary text-primary-foreground text-[11px] font-medium px-2.5 py-1">{a.tag}</span>
          </div>
          <div className="p-4">
            <p className="text-sm font-semibold text-foreground leading-snug">{a.title}</p>
            <p className="text-xs text-muted-foreground mt-2">{a.date}</p>
          </div>
        </a>
      ))}
    </div>

    {/* Second row: 4 small cards */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
      {articles.map((a) => (
        <a key={a.title + "-sm"} href="#" className="rounded-card overflow-hidden bg-card shadow-card group hover:shadow-card-hover transition-shadow block">
          <div className="relative aspect-[4/3] overflow-hidden">
            <img src={a.image} alt={a.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
            <span className="absolute top-3 left-3 rounded-badge bg-primary text-primary-foreground text-[11px] font-medium px-2.5 py-1">{a.tag}</span>
          </div>
          <div className="p-3">
            <p className="text-xs font-semibold text-foreground leading-snug">{a.title}</p>
            <p className="text-[11px] text-muted-foreground mt-1.5">{a.date}</p>
          </div>
        </a>
      ))}
    </div>
  </section>
);

export default LatestNewsSection;
