import { useState, useEffect } from "react";
import Header from "./components/Header";
import CategoryPills from "./components/CategoryPills";
import MenuGrid from "./components/MenuGrid";
import CartBar from "./components/CartBar";
import OrderTracker from "./components/OrderTracker";

const API_URL = `${import.meta.env.VITE_API_URL}/api/menu`;

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

  // Add an item to the cart
  const handleAddToCart = (item, selectedOption) => {
    setCart((prevCart) => [
      ...prevCart,
      {
        ...item,
        selectedOption,
        cartId: Date.now(),
      },
    ]);
  };

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  const handleCheckout = async () => {
    const customerName = prompt("What name should we put this order under?");

    if (!customerName) return;

    const orderPayload = {
      customerName,
      items: cart.map((item) => ({
        menuItem: item._id,
        quantity: 1,
      })),
    };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/orders`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderPayload),
        }
      );

      const result = await response.json();

      if (result.success) {
        alert(`Order placed! Total: ₦${result.data.totalPrice}`);
        setCart([]);
      } else {
        alert("Failed to place order: " + result.message);
      }
    } catch (error) {
      alert("Something went wrong placing your order.");
      console.error("Checkout error:", error);
    }
  };
    return (
    <div className="min-h-screen bg-cream">
      <Header cartCount={cart.length} />
      <CategoryPills
        activeCategory={activeCategory}
        onSelect={setActiveCategory}
      />

      {loading ? (
        <p className="px-5 py-10 text-center text-charcoal/50">
          Loading menu...
        </p>
      ) : (
        <MenuGrid items={filteredItems} onAddToCart={handleAddToCart} />
      )}

      <CartBar cartItems={cart} total={total} onCheckout={handleCheckout} />
    </div>
  );
}