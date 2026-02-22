import { Phone, Mail, MapPin } from "lucide-react";

const socials = ["VK", "TG", "YT", "OK"];

const ContactSection = () => (
  <section className="bg-secondary">
    <div className="lg-container py-14">
      <h2 className="text-xl font-bold text-foreground mb-1">
        Свяжитесь с <span className="text-primary">LiveGrid</span>
      </h2>

      <div className="flex flex-col lg:flex-row gap-10 mt-6">
        {/* Left: contacts */}
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Phone size={18} className="text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">+7 (495) 000 00 00</p>
              <p className="text-xs text-muted-foreground">Ежедневно 9:00–21:00</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Phone size={18} className="text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">+7 (495) 000 00 13</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Mail size={18} className="text-primary" />
            </div>
            <p className="text-sm font-semibold text-foreground">info@livegrid.ru</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <MapPin size={18} className="text-primary" />
            </div>
            <p className="text-sm text-muted-foreground">Москва, ул. Примерная, д. 1</p>
          </div>

          {/* Socials */}
          <div className="flex items-center gap-3 pt-2">
            {socials.map((s) => (
              <a
                key={s}
                href="#"
                className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {s}
              </a>
            ))}
          </div>
        </div>

        {/* Right: video placeholder */}
        <div className="flex-1 rounded-card bg-foreground/5 flex items-center justify-center min-h-[240px] overflow-hidden">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
              <div className="w-0 h-0 border-l-[14px] border-l-primary border-y-[9px] border-y-transparent ml-1" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">VIDEO</p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default ContactSection;
