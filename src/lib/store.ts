import { useEffect, useState } from "react";

// ---- Items (shared catalogue) ----
import pistachioKunafa from "@/assets/pistachio-kunafa.png";
import biscoffKunafa from "@/assets/biscoff-kunafa.png";
import nutellaKunafa from "@/assets/nutella-kunafa.png";
import strawberryKunafa from "@/assets/strawberry-kunafa.png";
import rosePistachioKunafa from "@/assets/rose-pistachio-kunafa.png";
import datesKunafa from "@/assets/dates-kunafa.png";
import chikkiBites from "@/assets/chikki-bites.png";
import dubaiDelightBox from "@/assets/dubai-delight-box.png";
import candies from "@/assets/candies.png";
import luxuryBox from "@/assets/luxury-box.png";

export type Item = {
  id: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  price: number;
  unit: string;
  image: string;
  accent: string;
};

export const items: Item[] = [
  { id: "pistachio-kunafa", name: "Pistachio Kunafa Bar", category: "Kunafa Bars", tagline: "Crispy. Nutty. Timeless.", description: "Crispy kunafa, rich pistachio filling, and premium dark chocolate. A timeless favourite of the house.", price: 599, unit: "bar", image: pistachioKunafa, accent: "from-emerald-400 to-amber-700" },
  { id: "biscoff-kunafa", name: "Lotus Biscoff Kunafa", category: "Kunafa Bars", tagline: "Caramelised. Crunchy. Bliss.", description: "Crispy kunafa layered with creamy Biscoff spread and crumbled caramelised cookies. Pure bliss.", price: 649, unit: "bar", image: biscoffKunafa, accent: "from-amber-300 to-orange-700" },
  { id: "nutella-kunafa", name: "Nutella Hazelnut Kunafa", category: "Kunafa Bars", tagline: "Oozing. Roasted. Decadent.", description: "Creamy Nutella, roasted hazelnuts, and crispy kunafa wrapped in glossy dark chocolate.", price: 699, unit: "bar", image: nutellaKunafa, accent: "from-amber-700 to-stone-900" },
  { id: "strawberry-kunafa", name: "Strawberry Kunafa", category: "Kunafa Bars", tagline: "Pink. Fruity. Dreamy.", description: "Crispy kunafa with luscious strawberry filling and a touch of pink-white-chocolate creaminess.", price: 649, unit: "bar", image: strawberryKunafa, accent: "from-rose-300 to-rose-700" },
  { id: "rose-pistachio-kunafa", name: "Rose Pistachio Kunafa", category: "Kunafa Bars", tagline: "Floral. Royal. Refined.", description: "Floral rose petals, creamy pistachio, and crispy kunafa — a truly royal Middle-Eastern combination.", price: 699, unit: "bar", image: rosePistachioKunafa, accent: "from-rose-300 to-emerald-600" },
  { id: "dates-kunafa", name: "Dates Kunafa Delight", category: "Dates", tagline: "Plump. Glossy. Indulgent.", description: "Premium Medjool dates dipped in dark chocolate and crowned with crushed almonds and pistachios.", price: 899, unit: "box of 9", image: datesKunafa, accent: "from-amber-700 to-stone-900" },
  { id: "chikki-bites", name: "Chikki Bites", category: "Bites", tagline: "Crunchy. Loaded. Wholesome.", description: "Dark chocolate discs drizzled with white chocolate and loaded with cashews, pistachios and seeds.", price: 399, unit: "box of 6", image: chikkiBites, accent: "from-amber-300 to-amber-700" },
  { id: "candies", name: "Chocolate Candies", category: "Candies", tagline: "Playful. Bright. Joyful.", description: "Dark and white chocolate lollipops dusted with rainbow sprinkles. Made for celebrations.", price: 449, unit: "box of 6", image: candies, accent: "from-rose-300 to-purple-600" },
  { id: "dubai-delight", name: "Dubai Delight Box", category: "Gift Boxes", tagline: "Opulent. Hand-finished. Luxe.", description: "A curated tray of hand-finished bonbons and truffles with gold-leaf accents, in our signature navy gift box.", price: 1299, unit: "box of 9", image: dubaiDelightBox, accent: "from-amber-300 to-amber-700" },
  { id: "luxury-box", name: "Assorted Luxury Box", category: "Gift Boxes", tagline: "Curated. Generous. Gift-ready.", description: "A curated selection of our signature kunafa bars and chocolate-dipped dates. The perfect luxury treat.", price: 1499, unit: "box", image: luxuryBox, accent: "from-amber-300 to-stone-900" },
];

// ---- Cart (localStorage + cross-tab + same-tab sync) ----
const CART_KEY = "chocolicious_cart";
const ORDERS_KEY = "chocolicious_orders";
const EV = "chocolicious-storage";

function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent(EV, { detail: { key } }));
}

function useLocalState<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(fallback);

  useEffect(() => {
    setValue(readJSON(key, fallback));
    const sync = () => setValue(readJSON(key, fallback));
    const onCustom = (e: Event) => {
      if ((e as CustomEvent).detail?.key === key) sync();
    };
    window.addEventListener("storage", sync);
    window.addEventListener(EV, onCustom);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(EV, onCustom);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const update = (next: T | ((prev: T) => T)) => {
    setValue((prev) => {
      const v = typeof next === "function" ? (next as (p: T) => T)(prev) : next;
      writeJSON(key, v);
      return v;
    });
  };

  return [value, update] as const;
}

export type Cart = Record<string, number>;

export function useCart() {
  const [cart, setCart] = useLocalState<Cart>(CART_KEY, {});

  const updateQty = (id: string, delta: number) => {
    setCart((c) => {
      const next = { ...c, [id]: Math.max(0, (c[id] || 0) + delta) };
      if (next[id] === 0) delete next[id];
      return next;
    });
  };

  const clear = () => setCart({});

  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);
  const totalPrice = Object.entries(cart).reduce((sum, [id, q]) => {
    const it = items.find((c) => c.id === id);
    return sum + (it?.price || 0) * q;
  }, 0);

  return { cart, updateQty, clear, totalItems, totalPrice };
}

// ---- Orders ----
export type OrderLine = { id: string; name: string; price: number; qty: number };
export type PaymentMethod = "cod" | "online";
export type OrderStatus = "pending" | "completed";

export type Order = {
  id: string;
  createdAt: number;
  name: string;
  phone: string;
  address: string;
  notes: string;
  payment: PaymentMethod;
  lines: OrderLine[];
  total: number;
  status: OrderStatus;
};

export function useOrders() {
  const [orders, setOrders] = useLocalState<Order[]>(ORDERS_KEY, []);

  const addOrder = (o: Omit<Order, "id" | "createdAt" | "status">) => {
    const order: Order = {
      ...o,
      id: `ORD-${Date.now().toString(36).toUpperCase()}`,
      createdAt: Date.now(),
      status: "pending",
    };
    setOrders((prev) => [order, ...prev]);
    return order;
  };

  const setStatus = (id: string, status: OrderStatus) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  };

  const remove = (id: string) => setOrders((prev) => prev.filter((o) => o.id !== id));

  return { orders, addOrder, setStatus, remove };
}
