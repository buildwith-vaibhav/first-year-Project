"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export interface WishlistItem {
  id: number;
  slug: string;
  name: string;
  price: number;
  image: string;
  unit?: string;
}

interface WishlistContextValue {
  items: WishlistItem[];
  count: number;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  has: (id: number) => boolean;
  add: (item: WishlistItem) => void;
  remove: (id: number) => void;
  toggleItem: (item: WishlistItem) => void;
  clear: () => void;
}

const STORAGE_KEY = "vkart-wishlist-v1";
const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as WishlistItem[];
        if (Array.isArray(parsed)) setItems(parsed);
      }
    } catch {
      // ignore corrupt storage
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (err) {
      console.warn("Failed to persist wishlist:", err);
    }
  }, [items, hydrated]);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((v) => !v), []);

  const has = useCallback(
    (id: number) => items.some((i) => i.id === id),
    [items],
  );

  const add = useCallback((item: WishlistItem) => {
    setItems((current) => {
      if (current.some((c) => c.id === item.id)) return current;
      return [...current, item];
    });
  }, []);

  const remove = useCallback((id: number) => {
    setItems((current) => current.filter((c) => c.id !== id));
  }, []);

  const toggleItem = useCallback((item: WishlistItem) => {
    setItems((current) => {
      if (current.some((c) => c.id === item.id)) {
        return current.filter((c) => c.id !== item.id);
      }
      return [...current, item];
    });
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<WishlistContextValue>(
    () => ({
      items,
      count: items.length,
      isOpen,
      open,
      close,
      toggle,
      has,
      add,
      remove,
      toggleItem,
      clear,
    }),
    [items, isOpen, open, close, toggle, has, add, remove, toggleItem, clear],
  );

  return (
    <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
