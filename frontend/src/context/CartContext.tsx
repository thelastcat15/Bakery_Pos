// CartContext.tsx
import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { CartItem } from "@/types/cart_type";
import { Product } from "@/types/product_type";
import { usePromotions } from "../hooks/usePromotions";
import {
  getCart as apiGetCart,
  updateQuantityInCart as apiUpdateQuantity,
  deleteCart as apiDeleteCart,
} from "@/services/cart_service";

type CartContextType = {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  removeFromCart: (productId: number) => Promise<void>;
  updateQuantity: (productId: number, quantity: number) => Promise<void>;
  increaseQuantity: (productId: number) => Promise<void>;
  decreaseQuantity: (productId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getOriginalTotalPrice: () => number;
  getTotalSavings: () => number;
  getItemQuantity: (productId: number) => number;
  getCartItemsWithPromotions: () => any[];
  isLoaded: boolean;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const { getDiscountedPrice, getPriceDisplay } = usePromotions();

  // โหลด cart ตอน mount
  useEffect(() => {
    const loadCart = async () => {
      try {
        const items = await apiGetCart();
        setCartItems(items);
      } catch (error) {
        console.error("Failed to load cart from server", error);
      } finally {
        setIsLoaded(true);
      }
    };
    loadCart();
  }, []);

  // ฟังก์ชัน cart
  const addToCart = useCallback(
    async (product: Product, quantity: number = 1) => {
      try {
        const existing = cartItems.find((item) => item.id === product.id);
        const newQuantity = existing ? existing.quantity + quantity : quantity;
        const updatedItems = await apiUpdateQuantity(product.id!!, newQuantity);
        setCartItems(updatedItems);
      } catch (error) {
        console.error("Failed to add item to cart", error);
      }
    },
    [cartItems]
  );

  const removeFromCart = useCallback(async (productId: number) => {
    try {
      const updatedItems = await apiUpdateQuantity(productId, 0);
      setCartItems(updatedItems);
    } catch (error) {
      console.error("Failed to remove item from cart", error);
    }
  }, []);

  const updateQuantity = useCallback(async (productId: number, quantity: number) => {
    try {
      const updatedItems = await apiUpdateQuantity(productId, quantity);
      setCartItems(updatedItems);
    } catch (error) {
      console.error("Failed to update quantity", error);
    }
  }, []);

  const increaseQuantity = useCallback(
    async (productId: number) => {
      const item = cartItems.find((i) => i.id === productId);
      if (!item) return;
      await updateQuantity(productId, item.quantity + 1);
    },
    [cartItems, updateQuantity]
  );

  const decreaseQuantity = useCallback(
    async (productId: number) => {
      const item = cartItems.find((i) => i.id === productId);
      if (!item) return;
      const newQty = Math.max(0, item.quantity - 1);
      await updateQuantity(productId, newQty);
    },
    [cartItems, updateQuantity]
  );

  const clearCart = useCallback(async () => {
    try {
      await apiDeleteCart();
      setCartItems([]);
    } catch (error) {
      console.error("Failed to clear cart", error);
    }
  }, []);

  const getTotalItems = useCallback(() => cartItems.reduce((total, item) => total + item.quantity, 0), [cartItems]);

  const getTotalPrice = useCallback(
    () => cartItems.reduce((total, item) => total + getDiscountedPrice(item) * item.quantity, 0),
    [cartItems, getDiscountedPrice]
  );

  const getOriginalTotalPrice = useCallback(
    () => cartItems.reduce((total, item) => total + item.price * item.quantity, 0),
    [cartItems]
  );

  const getTotalSavings = useCallback(
    () => getOriginalTotalPrice() - getTotalPrice(),
    [getOriginalTotalPrice, getTotalPrice]
  );

  const getItemQuantity = useCallback(
    (productId: number) => cartItems.find((i) => i.id === productId)?.quantity || 0,
    [cartItems]
  );

  const getCartItemsWithPromotions = useCallback(
    () => cartItems.map((item) => ({ ...item, ...getPriceDisplay(item) })),
    [cartItems, getPriceDisplay]
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
        getOriginalTotalPrice,
        getTotalSavings,
        getItemQuantity,
        getCartItemsWithPromotions,
        isLoaded,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Hook สำหรับใช้งานใน component
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};
