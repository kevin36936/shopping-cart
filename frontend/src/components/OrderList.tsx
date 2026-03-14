import { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '../contexts/UserContext';
import OrderCard from './OrderCard';
import type { Order } from '../types/order.types';

const OrderList = () => {
  const { token } = useUser();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get(`${API_URL}/api/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(response.data.orders);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
        setError('Could not load order history.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token, API_URL]);

  if (loading) return <div>Loading orders...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (orders.length === 0) return <div>You have no past orders.</div>;

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
};

export default OrderList;