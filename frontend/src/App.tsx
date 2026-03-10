import {Routes, Route} from "react-router-dom";
import { UserProvider } from "./contexts/UserContext";
import { CartProvider } from "./contexts/CartContext";
import { ProductsProvider } from "./contexts/ProductsContext";
import MainLayout from "./layouts/MainLayout";
import CartPage from "./pages/CartPage.tsx";
import HomePage from "./pages/HomePage.tsx";
import LoginPage from "./pages/LoginPage.tsx"
import RegisterPage from "./pages/RegisterPage.tsx";

function App() {
  return (
    <UserProvider>
      <ProductsProvider>
        <CartProvider>
          <Routes>
            <Route path="/" element={<MainLayout/>}>
              <Route index element={<HomePage />}/>
              <Route path="login" element={<LoginPage />}/>
              <Route path="cart" element={<CartPage />}/>
              <Route path="register" element={<RegisterPage/>}/>
            </Route>
          </Routes>
        </CartProvider>
      </ProductsProvider>
    </UserProvider>
  );
}

export default App;
