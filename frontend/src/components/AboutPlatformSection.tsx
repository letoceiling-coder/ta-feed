import { Building2, Users, TrendingUp } from "lucide-react";

const stats = [
  { icon: Building2, value: "100 000+", label: "объектов недвижимости" },
  { icon: Users, value: "50 000+", label: "довольных клиентов" },
  { icon: TrendingUp, value: "10 лет", label: "на рынке" },
];

const AboutPlatformSection = () => (
  <section className="bg-secondary">
    <div className="lg-container py-14">
      <div className="flex flex-col lg:flex-row gap-10 items-start">
        {/* Left text */}
        <div className="flex-1">
          <h2 className="text-xl font-bold text-foreground mb-2">
            О платформе <span className="text-primary">Live Grid</span>
          </h2>
          <p className="text-lg font-semibold text-foreground mb-3">
            Платформа по недвижимости
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">
            Live Grid — это современная платформа для поиска и подбора недвижимости по всей России.
            Мы объединяем застройщиков, агентства и частных продавцов в одном месте, чтобы вы могли
            найти идеальный вариант быстро и удобно. Наша цель — сделать рынок недвижимости
            прозрачным и доступным для каждого.
          </p>
        </div>

        {/* Right stats */}
        <div className="grid grid-cols-3 gap-6">
          {stats.map((s) => (
            <div key={s.label} className="rounded-card bg-card p-5 text-center shadow-card min-w-[140px]">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <s.icon size={20} className="text-primary" />
              </div>
              <p className="text-lg font-bold text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default AboutPlatformSection;
