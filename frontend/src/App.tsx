import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import { ScrollProvider } from "@/context/ScrollContext";
import { OrderProvider } from "@/context/OrderContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { UserProvider } from "@/context/UserContext";
import { PromoProvider } from "@/context/PromoContext";
import { RaffleProvider } from "@/context/RaffleContext";
import Index from "./pages/Index";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";
import ProfilePage from "./pages/ProfilePage";
import OrdersPage from "./pages/OrdersPage";
import AboutPage from "./pages/AboutPage";
import AddressesPage from "./pages/AddressesPage";
import PaymentMethodsPage from "./pages/PaymentMethodsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider>
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <CartProvider>
          <PromoProvider>
            <OrderProvider>
              <RaffleProvider>
                <ScrollProvider>
                  <TooltipProvider>
                    <Toaster />
                    <Sonner />
                    <BrowserRouter>
                      <Routes>
                        <Route path="/" element={<Index />} />
                        <Route path="/cart" element={<CartPage />} />
                        <Route path="/checkout" element={<CheckoutPage />} />
                        <Route path="/order-success" element={<OrderSuccessPage />} />
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route path="/orders" element={<OrdersPage />} />
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="/addresses" element={<AddressesPage />} />
                        <Route path="/payment-methods" element={<PaymentMethodsPage />} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </BrowserRouter>
                  </TooltipProvider>
                </ScrollProvider>
              </RaffleProvider>
            </OrderProvider>
          </PromoProvider>
        </CartProvider>
      </UserProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
