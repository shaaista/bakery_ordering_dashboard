import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";

export function SiteNav({ cartCount, onCart }: { cartCount: number; onCart: () => void }) {
  return (
    <motion.nav
      initial={false}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 md:px-12 py-3 sm:py-5 flex items-center justify-between gap-2 backdrop-blur-md bg-background/40 border-b border-border"
    >
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <Link to="/" className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 shrink-0 rounded-full flex items-center justify-center text-primary-foreground font-bold text-base sm:text-lg" style={{ background: "var(--gradient-gold)" }}>C</div>
          <span className="text-lg sm:text-xl tracking-wide whitespace-nowrap" style={{ fontFamily: "var(--font-display)" }}>Chocolicious</span>
        </Link>
        <Link to="/admin" className="ml-1 px-2 sm:px-2.5 py-1 rounded-full border border-border text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:text-primary hover:border-primary transition shrink-0">Admin</Link>
      </div>
      <div className="hidden md:flex gap-8 text-sm text-muted-foreground">
        <Link to="/" hash="menu" className="hover:text-primary transition">Showcase</Link>
        <Link to="/menu" className="hover:text-primary transition">Menu</Link>
        <Link to="/" hash="story" className="hover:text-primary transition">Our Story</Link>
        <Link to="/" hash="order" className="hover:text-primary transition">Order</Link>
      </div>
      <button onClick={onCart} className="relative px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium text-primary-foreground transition hover:scale-105 shrink-0" style={{ background: "var(--gradient-gold)" }}>
        Cart
        {cartCount > 0 && (
          <motion.span
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-accent text-accent-foreground text-xs flex items-center justify-center font-bold"
          >{cartCount}</motion.span>
        )}
      </button>
    </motion.nav>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border py-12 px-6 text-center text-muted-foreground text-sm">
      <div className="flex items-center justify-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-primary-foreground font-bold" style={{ background: "var(--gradient-gold)" }}>C</div>
        <span style={{ fontFamily: "var(--font-display)" }} className="text-lg text-foreground">Chocolicious</span>
      </div>
      <p>© 2026 Chocolicious — Crafted fresh, delivered with love.</p>
      <div className="mt-4">
        <Link to="/admin" className="text-xs tracking-[0.3em] uppercase text-muted-foreground/60 hover:text-primary transition">Admin</Link>
      </div>
    </footer>
  );
}
