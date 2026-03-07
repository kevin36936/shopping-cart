import { UserProvider } from "./contexts/UserContext";
import { CartProvider } from "./contexts/CartContext";
import { ProductsProvider } from "./contexts/ProductsContext";
import MainLayout from "./components/MainLayout";

function App() {
  return (
    <UserProvider>
      <ProductsProvider>
        <CartProvider>
          <MainLayout />
        </CartProvider>
      </ProductsProvider>
    </UserProvider>
  );
}

export default App;
