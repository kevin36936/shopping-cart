import { useEffect, useState } from 'react'
import axios from 'axios'
import type { Item } from '../types'

export function useProducts(API_URL: string) {
  const [products, setProducts] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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