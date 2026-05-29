import { useState } from "react";
import { motion } from "framer-motion";
import { items, useCart, useOrders, type PaymentMethod } from "@/lib/store";

type Step = "cart" | "method" | "address" | "online" | "done";

export function OrderModal({ onClose }: { onClose: () => void }) {
  const { cart, updateQty, clear, totalItems, totalPrice } = useCart();
  const { addOrder } = useOrders();

  const [step, setStep] = useState<Step>("cart");
  const [method, setMethod] = useState<PaymentMethod>("cod");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [placedId, setPlacedId] = useState("");

  const canPlace = totalItems > 0 && name.trim() && phone.trim() && address.trim();

  const placeOrder = () => {
    if (!canPlace) return;
    const lines = Object.entries(cart).map(([id, qty]) => {
      const it = items.find((i) => i.id === id)!;
      return { id, name: it.name, price: it.price, qty };
    });
    const o = addOrder({ name, phone, address, notes, payment: method, lines, total: totalPrice });
    setPlacedId(o.id);
    clear();
    setStep("done");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92, y: 30 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-card border border-border rounded-3xl max-w-2xl w-full p-8 my-8 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-3xl" style={{ fontFamily: "var(--font-display)" }}>
              {step === "cart" && "Your Cart"}
              {step === "method" && "Payment Method"}
              {step === "address" && "Delivery Details"}
              {step === "online" && "Online Payment"}
              {step === "done" && "Order Confirmed"}
            </h3>
            <p className="text-muted-foreground text-sm mt-1">
              {step === "cart" && "Review your selection"}
              {step === "method" && "Choose how you'd like to pay"}
              {step === "address" && "Where should we deliver?"}
              {step === "online" && "Almost there"}
              {step === "done" && `Order ${placedId}`}
            </p>
          </div>
          <button onClick={onClose} className="text-2xl text-muted-foreground hover:text-foreground">×</button>
        </div>

        {step === "cart" && (
          <>
            {totalItems === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                Your cart is empty. Browse the menu and add some treats!
              </div>
            ) : (
              <div className="space-y-3 mb-6">
                {Object.entries(cart).map(([id, q]) => {
                  const it = items.find((c) => c.id === id);
                  if (!it) return null;
                  return (
                    <div key={id} className="flex items-center gap-4 p-3 rounded-xl bg-secondary/40">
                      <img src={it.image} alt={it.name} className="w-14 h-14 rounded-lg object-contain" />
                      <div className="flex-1">
                        <div className="font-medium">{it.name}</div>
                        <div className="text-sm text-muted-foreground">₹{it.price}/{it.unit}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateQty(id, -1)} className="w-8 h-8 rounded-full bg-background hover:bg-muted transition">−</button>
                        <span className="w-6 text-center text-sm">{q}</span>
                        <button onClick={() => updateQty(id, 1)} className="w-8 h-8 rounded-full bg-background hover:bg-muted transition">+</button>
                      </div>
                      <div className="w-16 text-right text-sm font-medium">₹{it.price * q}</div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="flex justify-between items-center py-4 border-y border-border mb-6">
              <span className="text-muted-foreground">Total ({totalItems} {totalItems === 1 ? "item" : "items"})</span>
              <span className="text-2xl font-medium">₹{totalPrice.toFixed(0)}</span>
            </div>

            <button
              disabled={totalItems === 0}
              onClick={() => setStep("method")}
              className="w-full py-4 rounded-full text-primary-foreground font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.02] transition"
              style={{ background: "var(--gradient-gold)" }}
            >Proceed to Order</button>
          </>
        )}

        {step === "method" && (
          <div className="space-y-4">
            {(["cod", "online"] as PaymentMethod[]).map((m) => (
              <button
                key={m}
                onClick={() => setMethod(m)}
                className={`w-full text-left p-5 rounded-2xl border transition ${method === m ? "border-primary bg-secondary/40" : "border-border hover:border-muted-foreground"}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-lg" style={{ fontFamily: "var(--font-display)" }}>
                      {m === "cod" ? "Cash on Delivery" : "Online Payment"}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {m === "cod" ? "Pay in cash when your order arrives." : "Pay securely with card / UPI."}
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 ${method === m ? "border-primary bg-primary" : "border-muted-foreground"}`} />
                </div>
              </button>
            ))}
            <div className="flex gap-3 pt-4">
              <button onClick={() => setStep("cart")} className="flex-1 py-3 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 transition">Back</button>
              <button
                onClick={() => setStep(method === "online" ? "online" : "address")}
                className="flex-1 py-3 rounded-full text-primary-foreground font-medium hover:scale-[1.02] transition"
                style={{ background: "var(--gradient-gold)" }}
              >Continue</button>
            </div>
          </div>
        )}

        {step === "online" && (
          <div className="text-center py-10">
            <div className="text-5xl mb-4">🚧</div>
            <h4 className="text-2xl mb-2" style={{ fontFamily: "var(--font-display)" }}>Work in progress</h4>
            <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
              Online payments are coming soon. For now, please use Cash on Delivery.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setStep("method")} className="flex-1 py-3 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 transition">Back</button>
              <button
                onClick={() => { setMethod("cod"); setStep("address"); }}
                className="flex-1 py-3 rounded-full text-primary-foreground font-medium hover:scale-[1.02] transition"
                style={{ background: "var(--gradient-gold)" }}
              >Switch to COD</button>
            </div>
          </div>
        )}

        {step === "address" && (
          <div className="space-y-3">
            <input value={name} onChange={(e) => setName(e.target.value)} maxLength={100} placeholder="Your name" className="w-full px-4 py-3 rounded-xl bg-input border border-border focus:outline-none focus:border-primary transition" />
            <input value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={20} placeholder="Phone number" className="w-full px-4 py-3 rounded-xl bg-input border border-border focus:outline-none focus:border-primary transition" />
            <textarea value={address} onChange={(e) => setAddress(e.target.value)} maxLength={300} placeholder="Full delivery address" rows={3} className="w-full px-4 py-3 rounded-xl bg-input border border-border focus:outline-none focus:border-primary transition resize-none" />
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} maxLength={500} placeholder="Special requests (optional)" rows={2} className="w-full px-4 py-3 rounded-xl bg-input border border-border focus:outline-none focus:border-primary transition resize-none" />

            <div className="flex justify-between items-center py-4 border-y border-border my-4">
              <span className="text-muted-foreground text-sm">Payment: <span className="text-foreground font-medium">{method === "cod" ? "Cash on Delivery" : "Online"}</span></span>
              <span className="text-xl font-medium">₹{totalPrice.toFixed(0)}</span>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep("method")} className="flex-1 py-3 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 transition">Back</button>
              <button
                disabled={!canPlace}
                onClick={placeOrder}
                className="flex-[2] py-3 rounded-full text-primary-foreground font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.02] transition"
                style={{ background: "var(--gradient-gold)" }}
              >Confirm Order — ₹{totalPrice.toFixed(0)}</button>
            </div>
          </div>
        )}

        {step === "done" && (
          <div className="text-center py-10">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}
              className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center text-3xl text-primary-foreground"
              style={{ background: "var(--gradient-gold)" }}>✓</motion.div>
            <h4 className="text-3xl mb-3" style={{ fontFamily: "var(--font-display)" }}>Order Received!</h4>
            <p className="text-muted-foreground mb-2">Thank you{name ? `, ${name}` : ""}. We'll call you shortly to confirm.</p>
            <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-8">Order ID · {placedId}</p>
            <button onClick={onClose} className="px-8 py-3 rounded-full text-primary-foreground font-medium hover:scale-[1.02] transition" style={{ background: "var(--gradient-gold)" }}>Close</button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
