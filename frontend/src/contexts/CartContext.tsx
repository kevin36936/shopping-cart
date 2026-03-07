import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react"
import axios from "axios"
import { useUser } from "./UserContext"
import type { CartItem } from "../types/cart.types"
import type { Item } from "../types/item.types"

interface CartContextValue {
  cart: CartItem[];
  addToCart: (product: Item) => Promise<void>;
  removeFromCart: (id: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const { token, logout } = useUser();
  const API_URL = import.meta.env.VITE_API_URL;

  const fetchServerCart = useCallback(async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${API_URL}/cart/items`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(res.data.items);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) logout();
    }
  }, [token, API_URL, logout]);

  const mergeWithServer = useCallback(
    async (guestCart: CartItem[]) => {
      if (!token) {
        return;
      }
      if (guestCart.length === 0) {
        await fetchServerCart();
        return;
      }
      try {
        const serverRes = await axios.get(`${API_URL}/cart/items`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const serverItems: CartItem[] = serverRes.data.items;
        const serverMap = new Map(serverItems.map((item) => [item.id, item]));

        const promises = guestCart.map(async (guestItem) => {
          const serverItem = serverMap.get(guestItem.id);
          if (serverItem) {
            const newQty = serverItem.quantity + guestItem.quantity;
            return axios.patch(
              `${API_URL}/cart/items/${guestItem.id}`,
              { newQuantity: newQty },
              { headers: { Authorization: `Bearer ${token}` } },
            );
          } else {
            return axios.post(
              `${API_URL}/cart/items`,
              { productId: guestItem.id, quantity: guestItem.quantity },
              { headers: { Authorization: `Bearer ${token}` } },
            );
          }
        });

        await Promise.all(promises);

        await fetchServerCart();
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          logout();
        } else {
          console.error("Merge failed", err);
        }
      }
    },
    [token, API_URL, fetchServerCart, logout],
  );

  useEffect(() => {
    if (token) {
      const guestCart = [...cart];
      if (guestCart.length > 0) {
        mergeWithServer(guestCart);
      } else {
        fetchServerCart();
      }
    } else {
      setCart([]);
    }
  }, [token]);

  const addToCart = useCallback(
    async (product: Item) => {
      if (!token) {
        // Guest
        setCart((prev) => {
          const existing = prev.find((item) => item.id === product.id);
          if (existing) {
            return prev.map((item) =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item,
            );
          } else return [...prev, { ...product, quantity: 1 }];
        });
      } else {
        // Authenticated
        try {
          await axios.post(
            `${API_URL}/cart/items`,
            { productId: product.id, quantity: 1 },
            { headers: { Authorization: `Bearer ${token}` } },
          );
          await fetchServerCart();
        } catch (err) {
          if (axios.isAxiosError(err) && err.response?.status === 401) {
            logout();
          } else {
            console.error("Add to cart failed", err);
          }
        }
      }
    },
    [token, API_URL, fetchServerCart, logout],
  );

  const removeFromCart = useCallback(
    async (id: number) => {
      // guest
      if (!token) {
        setCart((prev) => prev.filter((item) => item.id !== id));
      } else {
        // Authenticated
        try {
          await axios.delete(`${API_URL}/cart/items/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          await fetchServerCart();
        } catch (err) {
          if (axios.isAxiosError(err) && err.response?.status == 401) {
            logout();
          } else {
            console.error("Remove failed", err);
          }
        }
      }
    },
    [token, API_URL, fetchServerCart, logout],
  );

  const clearCart = useCallback(async () => {
    // guest
    if (!token) {
      setCart([]);
    } else {
      try {
        await axios.delete(`${API_URL}/cart/items/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        await fetchServerCart();
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status == 401) {
          logout();
        } else {
          console.error("Clear failed", err);
        }
      }
    }
  }, [token, API_URL, fetchServerCart, logout]);

  const value = useMemo(
    () => ({
      cart,
      addToCart,
      removeFromCart,
      clearCart,
    }),
    [cart, addToCart, removeFromCart, clearCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
