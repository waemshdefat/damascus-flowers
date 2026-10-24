"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export interface CartItem {
  productId: number;
  slug: string;
  nameAr: string;
  priceJod: number;
  priceOnRequest: boolean;
  image: string;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  hydrated: boolean;
  totalCount: number;
  subtotalJod: number;
  hasPriceOnRequest: boolean;
  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  addedPrompt: CartItem | null;
  dismissAddedPrompt: () => void;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number, openSlideOver?: boolean) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  removeItem: (productId: number) => void;
  clearCart: () => void;
}

const STORAGE_KEY = "damascus_flowers_cart_v1";

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [addedPrompt, setAddedPrompt] = useState<CartItem | null>(null);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      }
    } catch {
      // Ignore malformed storage
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignore quota errors
    }
  }, [items, hydrated]);

  const addItem = useCallback(
    (
      newItem: Omit<CartItem, "quantity">,
      quantity = 1,
      openSlideOver = true
    ) => {
      const safeQty = Math.max(1, Math.min(50, Math.floor(quantity)));
      setItems((prev) => {
        const idx = prev.findIndex((i) => i.productId === newItem.productId);
        if (idx === -1) {
          return [...prev, { ...newItem, quantity: safeQty }];
        }
        const copy = [...prev];
        copy[idx] = {
          ...copy[idx],
          ...newItem,
          quantity: Math.min(50, copy[idx].quantity + safeQty),
        };
        return copy;
      });
      if (openSlideOver) {
        setAddedPrompt({ ...newItem, quantity: safeQty });
      }
    },
    []
  );

  const updateQuantity = useCallback((productId: number, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.productId !== productId));
      return;
    }
    const safeQty = Math.min(50, Math.floor(quantity));
    setItems((prev) =>
      prev.map((i) => (i.productId === productId ? { ...i, quantity: safeQty } : i))
    );
  }, []);

  const removeItem = useCallback((productId: number) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const subtotalJod = useMemo(
    () =>
      items.reduce(
        (sum, item) => sum + (item.priceOnRequest ? 0 : item.priceJod * item.quantity),
        0
      ),
    [items]
  );

  const hasPriceOnRequest = useMemo(
    () => items.some((i) => i.priceOnRequest),
    [items]
  );

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      hydrated,
      totalCount,
      subtotalJod,
      hasPriceOnRequest,
      drawerOpen,
      openDrawer: () => setDrawerOpen(true),
      closeDrawer: () => setDrawerOpen(false),
      addedPrompt,
      dismissAddedPrompt: () => setAddedPrompt(null),
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
    }),
    [
      items,
      hydrated,
      totalCount,
      subtotalJod,
      hasPriceOnRequest,
      drawerOpen,
      addedPrompt,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
}
