import { useState } from "react"
import axios from "axios"
import type { CartItem, Item } from "../types"


export function useCart(API_URL: string, onUnauthorized?: () => void) {
    const [cart, setCart] = useState<CartItem[]>([])

    // --- Fetch server cart (for authenticated users) ---
    const fetchServerCart = async (token: string) => {
        try {
            const res = await axios.get(`${API_URL}/cart/items`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCart(res.data.items);
        } catch (err) {
            console.error("Failed to fetch cart", err)
        }
    };

    // --- Merge guest cart with server cart after login ---
    const mergeGuestCart = async (token: string, guestCart: CartItem[]) => {
        if (guestCart.length === 0) {
            await fetchServerCart(token);
            return;
        }

        try {
            const serverRes = await axios.get(`${API_URL}/cart/items`, {
                headers: { Authorization: `Bearer ${token}` }
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
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                } else {
                    return axios.post(
                        `${API_URL}/cart/items`,
                        { productId: guestItem.id, quantity: guestItem.quantity },
                        { headers: { Authorization: `Bearer ${token}` } }
                    )
                }
            });

            await Promise.all(promises);

            await fetchServerCart(token);
        } catch (err) {
            if (axios.isAxiosError(err) && err.response?.status === 401) {
                onUnauthorized?.();
            } else {
                console.error("Merge failed", err);
            }
        }
    };

    const addToCart = async (product: Item, token: string | null) => {
        // guest
        if (!token) {
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
                await fetchServerCart(token);
            } catch (err) {
                if (axios.isAxiosError(err) && err.response?.status === 401) {
                    onUnauthorized?.();
                } else {
                    console.error("Add to cart failed", err);
                }
            }
        }
    }

    const removeFromCart = async (id: number, token: string | null) => {
        // guest
        if (!token) {
            setCart((prev) => prev.filter((item) => item.id !== id));
        } else {
            // Authenticated
            try {
                await axios.delete(`${API_URL}/cart/items/${id}`,
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                await fetchServerCart(token);
            } catch (err) {
                if (axios.isAxiosError(err) && err.response?.status == 401) {
                    onUnauthorized?.();
                } else {
                    console.log("Deleted from cart failed");
                }
            }
        }
    };

    const clearCart = async (token: string | null) => {
        // guest
        if (!token) {
            setCart([]);
        } else {
            try {
                await axios.delete(`${API_URL}/cart/items`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                await fetchServerCart(token);
            } catch (err) {
                if (axios.isAxiosError(err) && err.response?.status === 401) {
                    onUnauthorized?.();
                } else {
                    console.error("Deleted from cart failed");
                }
            }
        }
    };

    return { cart, setCart, fetchServerCart, mergeGuestCart, addToCart, removeFromCart, clearCart };
}