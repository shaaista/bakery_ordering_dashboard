import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import { items, useCart, type Item } from "@/lib/store";
import { SiteNav, SiteFooter } from "@/components/site/chrome";
import { OrderModal } from "@/components/site/order-modal";
import pistachioKunafa from "@/assets/pistachio-kunafa.png";
import biscoffKunafa from "@/assets/biscoff-kunafa.png";
import nutellaKunafa from "@/assets/nutella-kunafa.png";
import rosePistachioKunafa from "@/assets/rose-pistachio-kunafa.png";
import datesKunafa from "@/assets/dates-kunafa.png";
import chikkiBites from "@/assets/chikki-bites.png";
import candies from "@/assets/candies.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Chocolicious — Luxury Kunafa Bars, Dates & Chocolates" },
      { name: "description", content: "Handcrafted luxury kunafa bars, chocolate-dipped dates, Dubai chocolates, chikki bites & assorted gift boxes. Order from Chocolicious." },
    ],
  }),
  component: Index,
});

function Index() {
  const { cart, updateQty, totalItems } = useCart();
  const [orderOpen, setOrderOpen] = useState(false);

  return (
    <div className="bg-background text-foreground font-[var(--font-body)] overflow-x-hidden">
      <SiteNav cartCount={totalItems} onCart={() => setOrderOpen(true)} />
      <Hero />
      <Marquee />
      <ItemShowcase items={items} cart={cart} updateQty={updateQty} />
      <ParallaxSection />
      <MenuTeaser />
      <OrderSection onOpen={() => setOrderOpen(true)} />
      <SiteFooter />

      <AnimatePresence>
        {orderOpen && <OrderModal onClose={() => setOrderOpen(false)} />}
      </AnimatePresence>
    </div>
  );
}

function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.5]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -80]);

  return (
    <section ref={ref} className="relative min-h-[92vh] md:min-h-screen flex items-center overflow-hidden px-6 md:px-12 pt-28" style={{ background: "var(--gradient-warm)" }}>
      <motion.div style={{ y: textY }} className="relative z-20 max-w-3xl">
        <p className="text-primary tracking-[0.3em] text-xs md:text-sm uppercase mb-6">Est. With Love</p>
        <h1
          className="text-5xl sm:text-6xl md:text-9xl leading-[0.95] tracking-tight text-foreground whitespace-nowrap"
          style={{ fontFamily: "var(--font-display)" }}
        >
          <em className="italic text-primary">Choco</em>licious
        </h1>
        <p className="mt-6 md:mt-8 text-muted-foreground max-w-md text-sm md:text-base">Handcrafted luxury kunafa bars, chocolate-dipped dates & gourmet gift boxes. Crafted to perfection.</p>
        <a
          href="#menu"
          className="inline-block mt-8 md:mt-10 px-6 md:px-8 py-3 md:py-4 rounded-full text-primary-foreground font-medium hover:scale-105 transition text-sm md:text-base"
          style={{ background: "var(--gradient-gold)", boxShadow: "var(--shadow-glow)" }}
        >Explore the Menu ↓</a>
      </motion.div>

      <motion.div
        style={{ y, rotate, scale }}
        className="absolute z-0 md:z-10 right-[-30%] md:right-[8%] top-[55%] md:top-[16%] w-[300px] md:w-[540px] aspect-square pointer-events-none opacity-40 md:opacity-100"
      >
        <img src={pistachioKunafa} alt="Pistachio kunafa bar" className="w-full h-full object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.5)]" />
      </motion.div>

      <motion.div
        animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-muted-foreground text-xs tracking-widest"
      >SCROLL</motion.div>
    </section>
  );
}

function Marquee() {
  const labels = ["Kunafa Bars", "Dates", "Chocolates", "Bites", "Candies", "Gift Boxes", "Handcrafted Daily"];
  return (
    <div className="border-y border-border py-6 overflow-hidden bg-card/30">
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="flex gap-12 whitespace-nowrap"
      >
        {[...labels, ...labels, ...labels].map((it, i) => (
          <span key={i} className="text-3xl md:text-5xl text-muted-foreground/60" style={{ fontFamily: "var(--font-display)" }}>
            {it} <span className="text-primary">✦</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}

function ItemShowcase({ items, cart, updateQty }: { items: Item[]; cart: Record<string, number>; updateQty: (id: string, delta: number) => void }) {
  return (
    <section id="menu" className="py-32 px-6 md:px-12">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto text-center mb-32"
      >
        <p className="text-primary tracking-[0.3em] text-xs uppercase mb-4">The Showcase</p>
        <h2 className="text-5xl md:text-7xl" style={{ fontFamily: "var(--font-display)" }}>
          A whole bakery.<br />
          <em className="italic text-primary">Infinite</em> joy.
        </h2>
      </motion.div>

      <div className="space-y-32 md:space-y-48">
        {items.map((c, i) => (
          <ItemRow key={c.id} item={c} index={i} qty={cart[c.id] || 0} updateQty={updateQty} />
        ))}
      </div>
    </section>
  );
}

function ItemRow({ item, index, qty, updateQty }: { item: Item; index: number; qty: number; updateQty: (id: string, d: number) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const yRaw = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const rotateRaw = useTransform(scrollYProgress, [0, 1], [-15, 15]);
  const scaleRaw = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1.05, 0.85]);
  const spring = { stiffness: 120, damping: 30, mass: 0.4 };
  const y = useSpring(yRaw, spring);
  const rotate = useSpring(rotateRaw, spring);
  const scale = useSpring(scaleRaw, spring);
  const isReverse = index % 2 === 1;
  const num = String(index + 1).padStart(2, "0");

  return (
    <div ref={ref} className={`flex flex-col ${isReverse ? "md:flex-row-reverse" : "md:flex-row"} items-center gap-12 max-w-7xl mx-auto`}>
      <motion.div style={{ y, rotate, scale, willChange: "transform" }} className="relative w-full md:w-1/2 aspect-square">
        <div className="absolute inset-[20%] rounded-full opacity-30" style={{ background: "var(--gradient-gold)", filter: "blur(40px)" }} />
        <img src={item.image} alt={item.name} loading="lazy" className="relative w-full h-full object-contain" style={{ filter: "drop-shadow(0 25px 35px rgba(0,0,0,0.35))" }} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: isReverse ? -50 : 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="w-full md:w-1/2"
      >
        <p className="text-primary tracking-[0.3em] text-xs uppercase mb-4">No. {num} · {item.category}</p>
        <h3 className="text-5xl md:text-6xl mb-3" style={{ fontFamily: "var(--font-display)" }}>{item.name}</h3>
        <p className="text-2xl text-muted-foreground italic mb-6" style={{ fontFamily: "var(--font-display)" }}>{item.tagline}</p>
        <p className="text-muted-foreground mb-8 leading-relaxed max-w-md">{item.description}</p>

        <div className="flex items-center gap-6 mb-6">
          <span className="text-3xl font-light">₹{item.price}<span className="text-sm text-muted-foreground">/{item.unit}</span></span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 bg-card border border-border rounded-full px-2 py-1">
            <button onClick={() => updateQty(item.id, -1)} className="w-9 h-9 rounded-full hover:bg-secondary transition text-xl">−</button>
            <span className="w-8 text-center font-medium">{qty}</span>
            <button onClick={() => updateQty(item.id, 1)} className="w-9 h-9 rounded-full hover:bg-secondary transition text-xl">+</button>
          </div>
          <button
            onClick={() => updateQty(item.id, 1)}
            className="px-6 py-3 rounded-full text-primary-foreground font-medium hover:scale-105 transition text-sm"
            style={{ background: "var(--gradient-gold)" }}
          >Add to Cart</button>
        </div>
      </motion.div>
    </div>
  );
}

function ParallaxSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -400]);

  return (
    <section id="story" ref={ref} className="relative min-h-[80vh] flex items-center justify-center py-32 overflow-hidden" style={{ background: "var(--gradient-warm)" }}>
      <motion.img src={nutellaKunafa} style={{ y: y1 }} className="absolute left-[5%] top-[8%] w-32 md:w-48 opacity-50 drop-shadow-2xl" alt="" />
      <motion.img src={rosePistachioKunafa} style={{ y: y2 }} className="absolute right-[6%] top-[18%] w-32 md:w-52 opacity-50 drop-shadow-2xl" alt="" />
      <motion.img src={datesKunafa} style={{ y: y1 }} className="absolute left-[18%] bottom-[12%] w-28 md:w-40 opacity-50 drop-shadow-2xl" alt="" />
      <motion.img src={chikkiBites} style={{ y: y2 }} className="absolute right-[20%] bottom-[10%] w-28 md:w-44 opacity-50 drop-shadow-2xl" alt="" />
      <motion.img src={biscoffKunafa} style={{ y: y1 }} className="absolute left-[40%] top-[6%] w-24 md:w-36 opacity-40 drop-shadow-2xl" alt="" />
      <motion.img src={candies} style={{ y: y2 }} className="absolute right-[40%] bottom-[6%] w-24 md:w-36 opacity-40 drop-shadow-2xl" alt="" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="relative z-10 text-center max-w-3xl px-6"
      >
        <p className="text-primary tracking-[0.3em] text-xs uppercase mb-6">Our Story</p>
        <h2 className="text-4xl md:text-6xl leading-tight mb-8" style={{ fontFamily: "var(--font-display)" }}>
          "We don't just bake.<br />
          <em className="italic text-primary">We bake memories.</em>"
        </h2>
        <p className="text-muted-foreground text-lg leading-relaxed">
          Every kunafa bar, dipped date and bonbon from Chocolicious starts with single-origin chocolate, premium pistachios, and time — the one ingredient that can't be rushed.
        </p>
      </motion.div>
    </section>
  );
}

function MenuTeaser() {
  return (
    <section className="py-32 px-6 text-center border-t border-border" style={{ background: "var(--gradient-warm)" }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-2xl mx-auto"
      >
        <p className="text-primary tracking-[0.3em] text-xs uppercase mb-4">The Full Menu</p>
        <h2 className="text-5xl md:text-7xl mb-6" style={{ fontFamily: "var(--font-display)" }}>
          Browse every <em className="italic text-primary">bake</em>.
        </h2>
        <p className="text-muted-foreground mb-10 text-lg">All categories, all recipes, in one beautifully organised page.</p>
        <Link
          to="/menu"
          className="inline-block px-10 py-5 rounded-full text-primary-foreground text-lg font-medium hover:scale-105 transition"
          style={{ background: "var(--gradient-gold)", boxShadow: "var(--shadow-glow)" }}
        >Open the Menu →</Link>
      </motion.div>
    </section>
  );
}

function OrderSection({ onOpen }: { onOpen: () => void }) {
  return (
    <section id="order" className="py-32 px-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-2xl mx-auto"
      >
        <h2 className="text-5xl md:text-7xl mb-6" style={{ fontFamily: "var(--font-display)" }}>
          Ready to <em className="italic text-primary">indulge?</em>
        </h2>
        <p className="text-muted-foreground mb-10 text-lg">Mix, match, and place your order. Baked fresh, delivered to your door within 24 hours.</p>
        <button
          onClick={onOpen}
          className="px-10 py-5 rounded-full text-primary-foreground text-lg font-medium hover:scale-105 transition"
          style={{ background: "var(--gradient-gold)", boxShadow: "var(--shadow-glow)" }}
        >Open Cart</button>
      </motion.div>
    </section>
  );
}
