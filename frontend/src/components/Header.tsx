import { MapPin } from "lucide-react";

const navItems = [
  "Квартиры",
  "Новостройки",
  "Дома",
  "Участки",
  "Коммерция",
  "Ипотека",
];

const Header = () => (
  <header className="border-b border-border bg-card sticky top-0 z-50">
    <div className="lg-container flex items-center h-14 gap-6">
      {/* Logo */}
      <a href="/" className="flex items-center gap-2 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-sm">LG</span>
        </div>
      </a>

      {/* Geo */}
      <button className="flex items-center gap-1 text-sm text-foreground hover:text-primary transition-colors shrink-0">
        <MapPin size={14} className="text-primary" />
        <span className="font-medium">Москва и МО</span>
      </button>

      {/* Nav */}
      <nav className="hidden lg:flex items-center gap-5 ml-4">
        {navItems.map((item) => (
          <a
            key={item}
            href="#"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {item}
          </a>
        ))}
      </nav>

      <div className="ml-auto flex items-center gap-4">
        <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
          Войти
        </a>
      </div>
    </div>
  </header>
);

export default Header;
