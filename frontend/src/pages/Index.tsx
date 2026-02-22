import { useState, useMemo, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { useNavigate } from "react-router-dom";
import CategoryScroll from "@/components/CategoryScroll";
import ProductCard from "@/components/ProductCard";
import ProductModal from "@/components/ProductModal";
import FloatingCartButton from "@/components/FloatingCartButton";
import BottomNav from "@/components/BottomNav";
import SearchBar from "@/components/SearchBar";
import ProductCardSkeleton from "@/components/ProductCardSkeleton";
import { products, type Product } from "@/data/products";
import { useScrollRestore } from "@/context/ScrollContext";

const Index = () => {
  const navigate = useNavigate();
  const { save, restore, clear } = useScrollRestore();

  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState("home");
  const [loading, setLoading] = useState(true);
  const restoredRef = useRef(false);

  // Restore scroll position on mount
  useEffect(() => {
    const saved = restore();
    if (saved) {
      setActiveCategory(saved.activeCategory);
      setSearch(saved.search);
      // Defer scroll to after render
      requestAnimationFrame(() => {
        window.scrollTo(0, saved.scrollY);
        clear();
      });
    }
    // Simulate initial load
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  const filtered = useMemo(() => {
    let list = products;
    if (activeCategory !== "all") {
      list = list.filter((p) => p.category === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      );
    }
    return list;
  }, [activeCategory, search]);

  const handleOpenProduct = (product: Product) => {
    // Save scroll position before opening modal
    save({ scrollY: window.scrollY, activeCategory, search });
    setSelectedProduct(product);
  };

  const handleCloseProduct = () => {
    setSelectedProduct(null);
    // Restore scroll after modal closes
    const saved = restore();
    if (saved) {
      requestAnimationFrame(() => {
        window.scrollTo(0, saved.scrollY);
      });
    }
  };

  const handleNavigate = (tab: string) => {
    setActiveTab(tab);
    if (tab === "cart") navigate("/cart");
    else if (tab === "orders") navigate("/orders");
    else if (tab === "profile") navigate("/profile");
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-4 pt-4 pb-2 flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-extrabold font-display text-foreground">
            Быстро<span className="text-primary">Еда</span>
          </h1>
          <button className="flex items-center gap-1 mt-0.5 text-sm text-muted-foreground">
            <MapPin size={14} className="text-primary" />
            <span>ул. Пушкина, 10</span>
          </button>
        </div>
        <ThemeToggle variant="icon" />
      </motion.header>

      {/* Search */}
      <SearchBar value={search} onChange={setSearch} />

      {/* Categories */}
      <CategoryScroll active={activeCategory} onSelect={setActiveCategory} />

      {/* Products Grid */}
      <div className="px-4 pt-4 grid grid-cols-2 gap-3">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <ProductCardSkeleton key={i} />)
          : filtered.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} onOpen={handleOpenProduct} />
            ))}
      </div>

      {!loading && filtered.length === 0 && (
        <div className="flex flex-col items-center py-20 text-muted-foreground">
          <p className="text-lg font-semibold">Ничего не найдено</p>
          <p className="text-sm mt-1">Попробуйте изменить запрос</p>
        </div>
      )}

      {/* Product Modal */}
      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={handleCloseProduct} />
      )}

      {/* Floating Cart */}
      <FloatingCartButton onClick={() => navigate("/cart")} />

      {/* Bottom Nav */}
      <BottomNav active={activeTab} onNavigate={handleNavigate} />
    </div>
  );
};

export default Index;
