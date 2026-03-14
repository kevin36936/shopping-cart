import { Routes, Route } from "react-router-dom";
import { UserProvider } from "./contexts/UserContext";
import { CartProvider } from "./contexts/CartContext";
import { ProductsProvider } from "./contexts/ProductsContext";
import { Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import AccountLayout from "./layouts/AccountLayout";
import CartPage from "./pages/CartPage.tsx";
import HomePage from "./pages/HomePage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import RegisterPage from "./pages/RegisterPage.tsx";
import CheckoutPage from "./pages/CheckoutPage.tsx";
import ProfilePage from "./pages/ProfilePage";
import OrdersPage from "./pages/OrdersPage";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import OrderSuccess from "./pages/OrderSuccess.tsx";
import ChangePasswordPage from "./pages/ChangePasswordPage.tsx";

function App() {
  return (
    <UserProvider>
      <ProductsProvider>
        <CartProvider>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<HomePage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="cart" element={<CartPage />} />
              <Route path="register" element={<RegisterPage />} />
              <Route path="order-success" element={<OrderSuccess />} />
              <Route
                path="checkout"
                element={
                  <ProtectedRoute>
                    <CheckoutPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="account"
                element={
                  <ProtectedRoute>
                    <AccountLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="profile" replace />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="orders" element={<OrdersPage />} />
                <Route path="change-password" element={<ChangePasswordPage />} />
              </Route>
            </Route>
          </Routes>
        </CartProvider>
      </ProductsProvider>
    </UserProvider>
  );
}

export default App;
