import { useState } from "react";
import { Check } from "lucide-react";

import catApartments from "@/assets/cat-apartments.png";
import catHouses from "@/assets/cat-houses.png";
import catLand from "@/assets/cat-land.png";
import catCommercial from "@/assets/cat-commercial.png";

const steps = [
  {
    title: "Что ищете?",
    options: [
      { label: "Квартиру", icon: catApartments },
      { label: "Дом", icon: catHouses },
      { label: "Участок", icon: catLand },
      { label: "Коммерцию", icon: catCommercial },
    ],
  },
  {
    title: "Цель",
    options: [
      { label: "Покупка" },
      { label: "Аренда" },
      { label: "Ипотека" },
    ],
  },
  {
    title: "Бюджет",
    options: [
      { label: "до 5 млн" },
      { label: "5–10 млн" },
      { label: "10–20 млн" },
      { label: "от 20 млн" },
    ],
  },
];

const QuizWidget = () => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<(string | null)[]>([null, null, null]);

  const current = steps[step];
  const selected = answers[step];
  const canProceed = selected !== null;

  const handleSelect = (label: string) => {
    const next = [...answers];
    next[step] = label;
    setAnswers(next);
  };

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      // Mock result
      const params = new URLSearchParams();
      if (answers[0]) params.set("type", answers[0]);
      if (answers[1]) params.set("goal", answers[1]);
      if (answers[2]) params.set("budget", answers[2]);
      window.location.hash = `/search?${params.toString()}`;
    }
  };

  return (
    <section className="lg-container py-12">
      <div className="rounded-tile bg-secondary p-8 flex flex-col lg:flex-row gap-8">
        {/* Left: quiz */}
        <div className="flex-1">
          <h2 className="text-xl font-bold text-foreground mb-1">
            Подберем объект под Ваш запрос
          </h2>
          <p className="text-xs text-muted-foreground mb-1">
            Шаг {step + 1} из {steps.length}: {current.title}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
            {current.options.map((opt) => {
              const isSelected = selected === opt.label;
              return (
                <button
                  key={opt.label}
                  onClick={() => handleSelect(opt.label)}
                  className={`relative rounded-card p-4 flex flex-col items-center gap-2 text-sm font-medium transition-all border-2 ${
                    isSelected
                      ? "border-primary bg-card shadow-card"
                      : "border-transparent bg-card/60 hover:bg-card hover:shadow-card"
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                      <Check size={12} className="text-primary-foreground" />
                    </div>
                  )}
                  {"icon" in opt && opt.icon && (
                    <img src={opt.icon} alt={opt.label} className="w-14 h-14 object-contain" />
                  )}
                  <span className="text-foreground">{opt.label}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-6 flex gap-3">
            {step > 0 && (
              <button
                onClick={() => setStep(step - 1)}
                className="px-6 py-3 rounded-lg text-sm font-medium text-muted-foreground bg-card border border-border hover:bg-secondary transition-colors"
              >
                Назад
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={!canProceed}
              className="px-8 py-3 rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:bg-lg-blue-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {step === steps.length - 1 ? "Подобрать" : "Далее"}
            </button>
          </div>
        </div>

        {/* Right: promo card */}
        <div className="w-full lg:w-[280px] rounded-card bg-primary text-primary-foreground p-6 flex flex-col justify-between min-h-[200px]">
          <div>
            <p className="text-2xl font-bold leading-tight">Подберём<br />за 5 минут</p>
            <p className="text-sm mt-3 opacity-90">
              Ответьте на несколько вопросов и мы предложим лучшие варианты
            </p>
          </div>
          <div className="mt-4 text-xs opacity-70">Бесплатно • Без регистрации</div>
        </div>
      </div>
    </section>
  );
};

export default QuizWidget;
