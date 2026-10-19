import { useEffect } from "react";
import { useLocation } from "react-router";
import Hero from "../components/home/Hero";
import MenuSection from "../components/home/MenuSection";
import AboutSection from "../components/home/AboutSection";
import HowToOrder from "../components/home/HowToOrder";
import CartBar from "../components/CartBar";
import { useMenu } from "../hooks/useMenu";
import { useCart } from "../context/cart-context";
import { usePageTitle } from "../hooks/usePageTitle";

// Home: hero, menu (category strip + cards), about and info cards, how to order.
export default function HomePage() {
  usePageTitle(null);
  const menu = useMenu();
  const { addItem } = useCart();
  const { hash } = useLocation();

  // Arriving at /#about or /#how-to-order from another page: the menu loads after the
  // first scroll and pushes those sections down, so scroll to them again once it's in.
  useEffect(() => {
    if (menu.status !== "ready" || !hash) return;
    document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView({ block: "start" });
  }, [menu.status]); // eslint-disable-line react-hooks/exhaustive-deps -- only when the menu finishes loading

  return (
    <>
      <Hero />
      <MenuSection menu={menu} onAdd={addItem} />
      <AboutSection />
      <HowToOrder />
      <CartBar />
    </>
  );
}
