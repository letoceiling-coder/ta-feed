/**
 * Данные карточек категорий секции Live Grid.
 * Иконки — только локальные файлы (из frontend/src/assets/livegrid/ или @/assets).
 * Выгрузка из Figma: php artisan figma:export-icons
 */
import catNewbuild from "@/assets/cat-newbuild.png";
import catApartments from "@/assets/cat-apartments.png";
import catCottage from "@/assets/cat-cottage.png";
import catLand from "@/assets/cat-land.png";
import catMortgage from "@/assets/cat-mortgage.png";
import catParking from "@/assets/cat-parking.png";
import catCommercial from "@/assets/cat-commercial.png";
import arendaIcon from "@/assets/livegrid/arenda.svg";
import podobratIcon from "@/assets/livegrid/podobrat.svg";

export type LiveGridCategory = {
  id: string;
  title: string;
  iconSrc: string;
  href?: string;
};

/** Alias for backward compatibility */
export type CategoryItem = LiveGridCategory;

export const liveGridCategories: LiveGridCategory[] = [
  { id: "novostroyki", title: "Новостройки", iconSrc: catNewbuild },
  { id: "vtorichnaya", title: "Вторичная недвижимость", iconSrc: catApartments },
  { id: "arenda", title: "Аренда", iconSrc: arendaIcon },
  { id: "doma", title: "Дома", iconSrc: catCottage },
  { id: "uchastki", title: "Участки", iconSrc: catLand },
  { id: "ipoteka", title: "Ипотека", iconSrc: catMortgage },
  { id: "kvartiry", title: "Квартиры", iconSrc: catApartments },
  { id: "parkingi", title: "Паркинги", iconSrc: catParking },
  { id: "kommercheskaya", title: "Коммерческая недвижимость", iconSrc: catCommercial },
  { id: "podobrat", title: "Подобрать объект", iconSrc: podobratIcon },
];
