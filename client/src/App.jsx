import { Suspense, lazy } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import CartProvider from "./context/CartProvider";
import AuthProvider from "./context/AuthProvider";
import SiteLayout from "./components/layout/SiteLayout";
import HomePage from "./pages/HomePage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import NotFoundPage from "./pages/NotFoundPage";
import RequireAdmin from "./components/admin/RequireAdmin";

// Loaded only when visited, so customers browsing the menu don't download the
// admin screens or the live-status (Socket.io) code.
const OrderConfirmationPage = lazy(() => import("./pages/OrderConfirmationPage"));
const AdminLayout = lazy(() => import("./components/admin/AdminLayout"));
const AdminLoginPage = lazy(() => import("./pages/admin/AdminLoginPage"));
const AdminMenuPage = lazy(() => import("./pages/admin/AdminMenuPage"));
const AdminAreasPage = lazy(() => import("./pages/admin/AdminAreasPage"));
const AdminOrdersPage = lazy(() => import("./pages/admin/AdminOrdersPage"));

function PageLoading() {
  return (
    <p role="status" className="px-4 py-24 text-center text-muted">
      Loading
    </p>
  );
}

// /styleguide: design tokens and components. Development only; left out of
// production builds because import.meta.env.DEV is false there.
const StyleGuide = import.meta.env.DEV ? lazy(() => import("./dev/StyleGuide.jsx")) : null;

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Suspense fallback={<PageLoading />}>
            <Routes>
              <Route element={<SiteLayout />}>
                <Route index element={<HomePage />} />
                <Route path="cart" element={<CartPage />} />
                <Route path="checkout" element={<CheckoutPage />} />
                <Route path="order/:id" element={<OrderConfirmationPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>

              <Route path="admin/login" element={<AdminLoginPage />} />
              <Route
                path="admin"
                element={
                  <RequireAdmin>
                    <AdminLayout />
                  </RequireAdmin>
                }
              >
                <Route index element={<Navigate to="menu" replace />} />
                <Route path="menu" element={<AdminMenuPage />} />
                <Route path="areas" element={<AdminAreasPage />} />
                <Route path="orders" element={<AdminOrdersPage />} />
                <Route path="*" element={<Navigate to="menu" replace />} />
              </Route>

              {StyleGuide && <Route path="styleguide" element={<StyleGuide />} />}
            </Routes>
          </Suspense>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
