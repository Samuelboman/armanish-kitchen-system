import { useState, useEffect } from "react";
import Header from "./components/Header";
import CategoryPills from "./components/CategoryPills";
import MenuGrid from "./components/MenuGrid";
import CartBar from "./components/CartBar";
import OrderTracker from "./components/OrderTracker";

const API_URL = "http://localhost:5000/api/menu";

export default function App() {
  const [menuItems, setMenuItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch the menu once when the app first loads
  useEffect(() => {
    async function fetchMenu() {
      try {
        const response = await fetch(API_URL);
        const result = await response.json();
        if (result.success) {
          setMenuItems(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch menu:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchMenu();
  }, []);

  // Filter items by the currently selected category
  const filteredItems =
    activeCategory === "all"
      ? menuItems
      : menuItems.filter((item) => item.category === activeCategory);

  // Add an item (with its chosen accompaniment, if any) to the cart
  const handleAddToCart = (item, selectedOption) => {
    setCart((prevCart) => [
      ...prevCart,
      { ...item, selectedOption, cartId: Date.now() },
    ]);
  };

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  const handleCheckout = () => {
    alert(`Checkout coming soon! Total: ₦${total}`);
  };

  return (
    <div className="min-h-screen bg-cream">
      <Header cartCount={cart.length} />
      <CategoryPills activeCategory={activeCategory} onSelect={setActiveCategory} />

      {loading ? (
        <p className="px-5 py-10 text-center text-charcoal/50">Loading menu...</p>
      ) : (
        <MenuGrid items={filteredItems} onAddToCart={handleAddToCart} />
      )}

      <CartBar cartItems={cart} total={total} onCheckout={handleCheckout} />
      <div className="px-5 pb-24">
      <OrderTracker orderId="6ab7628b70c8f09dd51ae4ab" />
      </div>
    </div>
    
  );
}