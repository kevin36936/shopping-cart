import { useEffect, useState } from 'react';
import axios from 'axios';
import type { Item } from '../types';

export function useProducts() {
  const [products, setProducts] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    let isMounted = true;
    const loadProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/products`);
        if (isMounted) setProducts(res.data);
      } catch (err) {
        if (isMounted) setError('Failed to load products');
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadProducts();
    return () => { isMounted = false; };
  }, [API_URL]);

  return { products, loading, error };
}