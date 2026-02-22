const Footer = () => (
  <footer className="border-t border-border bg-secondary mt-8">
    <div className="lg-container py-10">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">LG</span>
            </div>
            <span className="font-bold text-foreground">Live Grid</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Платформа по недвижимости
          </p>
        </div>
        <div>
          <p className="font-semibold text-sm text-foreground mb-3">Покупателям</p>
          <ul className="space-y-2 text-xs text-muted-foreground">
            <li><a href="#" className="hover:text-foreground transition-colors">Квартиры</a></li>
            <li><a href="#" className="hover:text-foreground transition-colors">Новостройки</a></li>
            <li><a href="#" className="hover:text-foreground transition-colors">Дома</a></li>
          </ul>
        </div>
        <div>
          <p className="font-semibold text-sm text-foreground mb-3">Компания</p>
          <ul className="space-y-2 text-xs text-muted-foreground">
            <li><a href="#" className="hover:text-foreground transition-colors">О нас</a></li>
            <li><a href="#" className="hover:text-foreground transition-colors">Контакты</a></li>
          </ul>
        </div>
        <div>
          <p className="font-semibold text-sm text-foreground mb-3">Свяжитесь с нами</p>
          <p className="text-xs text-muted-foreground">+7 (495) 000-00-00</p>
          <p className="text-xs text-muted-foreground mt-1">info@livegrid.ru</p>
        </div>
      </div>
      <div className="mt-8 pt-6 border-t border-border text-xs text-muted-foreground text-center">
        © 2025 Live Grid. Все права защищены.
      </div>
    </div>
  </footer>
);

export default Footer;
