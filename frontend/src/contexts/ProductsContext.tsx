import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
} from "react";
import axios from "axios";
import type { Item } from "../types/item.types.ts";

interface ProductsContextValue {
  products: Item[];
  loading: boolean;
  error: string | null;
}

const ProductsContext = createContext<ProductsContextValue | undefined>(
  undefined,
);

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    let isMounted = true;
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/api/products`);
        if (isMounted) setProducts(res.data);
      } catch (err) {
        if (isMounted) setError("Failed to load products");
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchProducts();
    return () => {
      isMounted = false;
    };
  }, [API_URL]);

  const value = useMemo(
    () => ({ products, loading, error }),
    [products, loading, error],
  );

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductsContext);
  if (context === undefined) {
    throw new Error("useProducts must be used within a ProductsProvider");
  }
  return context;
}
