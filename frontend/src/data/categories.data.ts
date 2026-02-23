/**
 * Данные карточек категорий секции Live Grid.
 * Иконки: предпочтительно из Figma (node-id=4-13), в src/assets/livegrid/.
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

export interface CategoryItem {
  id: string;
  title: string;
  icon: string;
  href?: string;
}

export const liveGridCategories: CategoryItem[] = [
  { id: "novostroyki", title: "Новостройки", icon: catNewbuild },
  { id: "vtorichnaya", title: "Вторичная недвижимость", icon: catApartments },
  { id: "arenda", title: "Аренда", icon: arendaIcon },
  { id: "doma", title: "Дома", icon: catCottage },
  { id: "uchastki", title: "Участки", icon: catLand },
  { id: "ipoteka", title: "Ипотека", icon: catMortgage },
  { id: "kvartiry", title: "Квартиры", icon: catApartments },
  { id: "parkingi", title: "Паркинги", icon: catParking },
  { id: "kommercheskaya", title: "Коммерческая недвижимость", icon: catCommercial },
  { id: "podobrat", title: "Подобрать объект", icon: podobratIcon },
];
