import { Search, Percent, Home, Smartphone } from "lucide-react";

const features = [
  { icon: Search, title: "Максимальный выбор", description: "Более 100 000 объектов по всей России от застройщиков и агентств" },
  { icon: Percent, title: "Выгодная ипотека", description: "Подберём лучшие ипотечные программы от ведущих банков" },
  { icon: Home, title: "Без посредников", description: "Прямые контакты застройщиков и собственников без наценок" },
  { icon: Smartphone, title: "Удобный поиск", description: "Фильтры, карта и персональные рекомендации для быстрого подбора" },
];

const AdditionalFeaturesSection = () => (
  <section className="lg-container py-10">
    <h2 className="text-xl font-bold text-foreground mb-6">Дополнительные возможности</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {features.map((f) => (
        <div key={f.title} className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-card bg-secondary flex items-center justify-center shrink-0">
            <f.icon size={24} className="text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">{f.title}</p>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{f.description}</p>
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default AdditionalFeaturesSection;
