import burgerImg from "@/assets/burger.jpg";
import friesImg from "@/assets/fries.jpg";
import pizzaImg from "@/assets/pizza.jpg";
import colaImg from "@/assets/cola.jpg";
import nuggetsImg from "@/assets/nuggets.jpg";
import saladImg from "@/assets/salad.jpg";
import hotdogImg from "@/assets/hotdog.jpg";
import icecreamImg from "@/assets/icecream.jpg";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  image: string;
  category: string;
  calories: number;
  weight: string;
  badge?: "hit" | "new" | "sale";
  ingredients: string[];
  nutrition: { protein: number; fat: number; carbs: number };
  sizes?: { name: string; priceAdd: number }[];
  extras?: { name: string; price: number }[];
}

export interface Category {
  id: string;
  name: string;
  emoji: string;
}

export const categories: Category[] = [
  { id: "all", name: "Все", emoji: "🍽" },
  { id: "burgers", name: "Бургеры", emoji: "🍔" },
  { id: "pizza", name: "Пицца", emoji: "🍕" },
  { id: "snacks", name: "Закуски", emoji: "🍟" },
  { id: "salads", name: "Салаты", emoji: "🥗" },
  { id: "drinks", name: "Напитки", emoji: "🥤" },
  { id: "desserts", name: "Десерты", emoji: "🍨" },
];

export const products: Product[] = [
  {
    id: "1",
    name: "Классик Бургер",
    description: "Сочная говяжья котлета, свежие овощи, фирменный соус и хрустящий салат",
    price: 349,
    image: burgerImg,
    category: "burgers",
    calories: 520,
    weight: "320г",
    badge: "hit",
    ingredients: ["Говядина", "Чеддер", "Томат", "Салат", "Лук", "Соус"],
    nutrition: { protein: 28, fat: 32, carbs: 38 },
    sizes: [
      { name: "Стандарт", priceAdd: 0 },
      { name: "Двойной", priceAdd: 150 },
      { name: "Тройной", priceAdd: 280 },
    ],
    extras: [
      { name: "Бекон", price: 80 },
      { name: "Яйцо", price: 50 },
      { name: "Халапеньо", price: 40 },
    ],
  },
  {
    id: "2",
    name: "Картошка Фри",
    description: "Хрустящая золотистая картошка с фирменной приправой",
    price: 179,
    image: friesImg,
    category: "snacks",
    calories: 340,
    weight: "180г",
    ingredients: ["Картофель", "Соль", "Специи"],
    nutrition: { protein: 4, fat: 18, carbs: 42 },
    sizes: [
      { name: "Маленькая", priceAdd: 0 },
      { name: "Средняя", priceAdd: 50 },
      { name: "Большая", priceAdd: 100 },
    ],
  },
  {
    id: "3",
    name: "Пепперони",
    description: "Пряная пепперони, тягучая моцарелла и фирменный томатный соус",
    price: 549,
    oldPrice: 689,
    image: pizzaImg,
    category: "pizza",
    calories: 680,
    weight: "450г",
    badge: "sale",
    ingredients: ["Пепперони", "Моцарелла", "Томатный соус", "Орегано"],
    nutrition: { protein: 24, fat: 28, carbs: 58 },
    sizes: [
      { name: "25 см", priceAdd: 0 },
      { name: "30 см", priceAdd: 150 },
      { name: "35 см", priceAdd: 280 },
    ],
  },
  {
    id: "4",
    name: "Кола",
    description: "Ледяная кола со льдом — классика к любому заказу",
    price: 129,
    image: colaImg,
    category: "drinks",
    calories: 140,
    weight: "400мл",
    ingredients: ["Кола", "Лёд"],
    nutrition: { protein: 0, fat: 0, carbs: 35 },
    sizes: [
      { name: "0.4л", priceAdd: 0 },
      { name: "0.6л", priceAdd: 40 },
    ],
  },
  {
    id: "5",
    name: "Наггетсы x9",
    description: "Хрустящие куриные наггетсы с золотистой корочкой",
    price: 269,
    image: nuggetsImg,
    category: "snacks",
    calories: 420,
    weight: "270г",
    badge: "hit",
    ingredients: ["Куриное филе", "Панировка", "Специи"],
    nutrition: { protein: 22, fat: 18, carbs: 30 },
    extras: [
      { name: "Кетчуп", price: 30 },
      { name: "Барбекю", price: 30 },
      { name: "Сырный", price: 40 },
    ],
  },
  {
    id: "6",
    name: "Цезарь",
    description: "Свежий салат с курицей-гриль, пармезаном и крутонами",
    price: 389,
    image: saladImg,
    category: "salads",
    calories: 310,
    weight: "280г",
    badge: "new",
    ingredients: ["Курица", "Салат Романо", "Пармезан", "Крутоны", "Соус Цезарь"],
    nutrition: { protein: 26, fat: 18, carbs: 12 },
  },
  {
    id: "7",
    name: "Хот-дог Классик",
    description: "Сочная сосиска в мягкой булке с кетчупом и горчицей",
    price: 199,
    image: hotdogImg,
    category: "snacks",
    calories: 380,
    weight: "220г",
    ingredients: ["Сосиска", "Булка", "Кетчуп", "Горчица"],
    nutrition: { protein: 14, fat: 22, carbs: 34 },
  },
  {
    id: "8",
    name: "Мороженое Сандэй",
    description: "Нежное ванильное мороженое с шоколадным топпингом и вишенкой",
    price: 189,
    image: icecreamImg,
    category: "desserts",
    calories: 280,
    weight: "200г",
    badge: "new",
    ingredients: ["Ванильное мороженое", "Шоколадный соус", "Вишня"],
    nutrition: { protein: 4, fat: 14, carbs: 38 },
  },
];
