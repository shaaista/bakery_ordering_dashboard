import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { items, useCart } from "@/lib/store";
import { SiteNav, SiteFooter } from "@/components/site/chrome";
import { OrderModal } from "@/components/site/order-modal";

export const Route = createFileRoute("/menu")({
  head: () => ({
    meta: [
      { title: "Menu — Chocolicious" },
      { name: "description", content: "Browse the full Chocolicious menu — kunafa bars, dates, bites, candies and gift boxes." },
      { property: "og:title", content: "Menu — Chocolicious" },
      { property: "og:description", content: "Browse the full Chocolicious menu — kunafa bars, dates, bites, candies and gift boxes." },
    ],
  }),
  component: MenuPage,
});

function MenuPage() {
  const { cart, updateQty, totalItems } = useCart();
  const [orderOpen, setOrderOpen] = useState(false);
  const categories = Array.from(new Set(items.map((i) => i.category)));

  return (
    <div className="bg-background text-foreground font-[var(--font-body)] min-h-screen overflow-x-hidden">
      <SiteNav cartCount={totalItems} onCart={() => setOrderOpen(true)} />

      <section className="pt-40 pb-20 px-6 md:px-12" style={{ background: "var(--gradient-warm)" }}>
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-primary tracking-[0.3em] text-xs uppercase mb-4">The Full Menu</p>
          <h1 className="text-5xl md:text-7xl mb-6" style={{ fontFamily: "var(--font-display)" }}>
            Every <em className="italic text-primary">bake</em>, in one place.
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">Browse our full catalogue across every category. Tap to add to your cart.</p>
        </div>
      </section>

      <section className="py-20 px-6 md:px-12">
        <div className="max-w-5xl mx-auto space-y-16">
          {categories.map((cat, ci) => (
            <motion.div
              key={cat}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: ci * 0.05 }}
            >
              <div className="flex items-baseline justify-between mb-6 border-b border-border pb-4">
                <h2 className="text-3xl md:text-4xl" style={{ fontFamily: "var(--font-display)" }}>{cat}</h2>
                <span className="text-xs tracking-[0.3em] text-muted-foreground uppercase">
                  {items.filter((i) => i.category === cat).length} {items.filter((i) => i.category === cat).length === 1 ? "recipe" : "recipes"}
                </span>
              </div>
              <div className="divide-y divide-border/60">
                {items.filter((i) => i.category === cat).map((it) => {
                  const q = cart[it.id] || 0;
                  return (
                    <div key={it.id} className="flex items-center gap-4 md:gap-6 py-5 group">
                      <img src={it.image} alt={it.name} loading="lazy" className="w-16 h-16 md:w-20 md:h-20 object-contain flex-shrink-0 transition-transform group-hover:scale-110" style={{ filter: "drop-shadow(0 10px 15px rgba(0,0,0,0.25))" }} />
                      <div className="flex-1 min-w-0">
                        <div className="text-lg md:text-xl" style={{ fontFamily: "var(--font-display)" }}>{it.name}</div>
                        <div className="text-sm text-muted-foreground italic truncate">{it.tagline}</div>
                      </div>
                      <div className="hidden sm:block text-right">
                        <div className="text-base md:text-lg font-light">₹{it.price}</div>
                        <div className="text-xs text-muted-foreground">per {it.unit}</div>
                      </div>
                      <div className="flex items-center gap-2 bg-card border border-border rounded-full px-2 py-1">
                        <button onClick={() => updateQty(it.id, -1)} className="w-7 h-7 rounded-full hover:bg-secondary transition text-sm">−</button>
                        <span className="w-5 text-center text-sm">{q}</span>
                        <button onClick={() => updateQty(it.id, 1)} className="w-7 h-7 rounded-full hover:bg-secondary transition text-sm">+</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-16">
          <button
            onClick={() => setOrderOpen(true)}
            className="px-10 py-5 rounded-full text-primary-foreground text-lg font-medium hover:scale-105 transition"
            style={{ background: "var(--gradient-gold)", boxShadow: "var(--shadow-glow)" }}
          >Open Cart ({totalItems})</button>
        </div>
      </section>

      <SiteFooter />

      <AnimatePresence>
        {orderOpen && <OrderModal onClose={() => setOrderOpen(false)} />}
      </AnimatePresence>
    </div>
  );
}
