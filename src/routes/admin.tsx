import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { useOrders, type Order } from "@/lib/store";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Chocolicious" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const { orders, setStatus, remove } = useOrders();
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all");

  const filtered = orders.filter((o) => filter === "all" || o.status === filter);

  const totalOrders = orders.length;
  const pending = orders.filter((o) => o.status === "pending").length;
  const completed = orders.filter((o) => o.status === "completed").length;
  const revenue = orders.filter((o) => o.status === "completed").reduce((s, o) => s + o.total, 0);
  const pendingRevenue = orders.filter((o) => o.status === "pending").reduce((s, o) => s + o.total, 0);
  const codCount = orders.filter((o) => o.payment === "cod").length;
  const onlineCount = orders.filter((o) => o.payment === "online").length;
  const avgOrder = totalOrders ? Math.round(orders.reduce((s, o) => s + o.total, 0) / totalOrders) : 0;

  // top items
  const itemTotals: Record<string, { name: string; qty: number; revenue: number }> = {};
  orders.forEach((o) =>
    o.lines.forEach((l) => {
      if (!itemTotals[l.id]) itemTotals[l.id] = { name: l.name, qty: 0, revenue: 0 };
      itemTotals[l.id].qty += l.qty;
      itemTotals[l.id].revenue += l.qty * l.price;
    })
  );
  const topItems = Object.values(itemTotals).sort((a, b) => b.qty - a.qty).slice(0, 5);
  const maxQty = topItems[0]?.qty || 1;

  return (
    <div className="bg-background text-foreground min-h-screen font-[var(--font-body)] overflow-x-hidden">
      <header className="border-b border-border px-4 sm:px-6 md:px-12 py-4 md:py-6 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 shrink-0 rounded-full flex items-center justify-center text-primary-foreground font-bold" style={{ background: "var(--gradient-gold)" }}>C</div>
          <div className="min-w-0">
            <h1 className="text-lg sm:text-2xl truncate" style={{ fontFamily: "var(--font-display)" }}>Admin Dashboard</h1>
            <p className="text-[10px] sm:text-xs text-muted-foreground tracking-[0.2em] uppercase truncate">Orders & Analytics</p>
          </div>
        </div>
        <Link to="/" className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition shrink-0">← Back</Link>
      </header>

      <div className="px-4 sm:px-6 md:px-12 py-6 md:py-10 max-w-7xl mx-auto space-y-8 md:space-y-10">
        {/* Stats */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Stat label="Total Orders" value={totalOrders.toString()} />
          <Stat label="Pending" value={pending.toString()} accent />
          <Stat label="Completed" value={completed.toString()} />
          <Stat label="Avg Order" value={`₹${avgOrder}`} />
          <Stat label="Revenue (Completed)" value={`₹${revenue}`} />
          <Stat label="Pending Revenue" value={`₹${pendingRevenue}`} />
          <Stat label="COD Orders" value={codCount.toString()} />
          <Stat label="Online Orders" value={onlineCount.toString()} />
        </section>

        {/* Top items */}
        <section className="bg-card border border-border rounded-2xl p-6">
          <h2 className="text-xl mb-4" style={{ fontFamily: "var(--font-display)" }}>Top selling items</h2>
          {topItems.length === 0 ? (
            <p className="text-muted-foreground text-sm">No sales yet.</p>
          ) : (
            <div className="space-y-3">
              {topItems.map((t) => (
                <div key={t.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{t.name}</span>
                    <span className="text-muted-foreground">{t.qty} sold · ₹{t.revenue}</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(t.qty / maxQty) * 100}%` }}
                      transition={{ duration: 0.6 }}
                      className="h-full"
                      style={{ background: "var(--gradient-gold)" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Orders */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <h2 className="text-2xl" style={{ fontFamily: "var(--font-display)" }}>Orders</h2>
            <div className="flex gap-2 flex-wrap">
              {(["all", "pending", "completed"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 sm:px-4 py-1.5 rounded-full text-[10px] sm:text-xs uppercase tracking-wider transition ${filter === f ? "text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}
                  style={filter === f ? { background: "var(--gradient-gold)" } : undefined}
                >{f}</button>
              ))}
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="bg-card border border-border rounded-2xl p-12 text-center text-muted-foreground">
              No orders {filter !== "all" ? `(${filter})` : "yet"}.
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((o) => (
                <OrderCard key={o.id} order={o} onComplete={() => setStatus(o.id, "completed")} onReopen={() => setStatus(o.id, "pending")} onDelete={() => remove(o.id)} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={`rounded-2xl border p-4 sm:p-5 ${accent ? "border-primary/40 bg-primary/5" : "border-border bg-card"}`}>
      <div className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2 leading-tight">{label}</div>
      <div className="text-2xl sm:text-3xl break-words" style={{ fontFamily: "var(--font-display)" }}>{value}</div>
    </div>
  );
}

function OrderCard({ order, onComplete, onReopen, onDelete }: { order: Order; onComplete: () => void; onReopen: () => void; onDelete: () => void }) {
  const [open, setOpen] = useState(false);
  const date = new Date(order.createdAt).toLocaleString();
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border rounded-2xl overflow-hidden">
      <button onClick={() => setOpen((o) => !o)} className="w-full text-left px-4 sm:px-6 py-4 sm:py-5 flex flex-wrap items-center gap-3 sm:gap-4 hover:bg-secondary/30 transition">
        <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase tracking-widest ${order.status === "pending" ? "bg-primary/15 text-primary" : "bg-emerald-500/15 text-emerald-500"}`}>
          {order.status}
        </span>
        <div className="flex-1 min-w-0 order-3 sm:order-none basis-full sm:basis-auto">
          <div className="font-medium truncate">{order.name} · <span className="text-muted-foreground">{order.phone}</span></div>
          <div className="text-xs text-muted-foreground truncate">{order.id} · {date}</div>
        </div>
        <div className="text-right ml-auto sm:ml-0">
          <div className="text-lg font-medium">₹{order.total}</div>
          <div className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider">{order.payment === "cod" ? "COD" : "Online"}</div>
        </div>
        <span className="text-muted-foreground">{open ? "−" : "+"}</span>
      </button>

      {open && (
        <div className="px-4 sm:px-6 pb-6 border-t border-border pt-4 space-y-4">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-1">Delivery address</div>
            <p className="text-sm whitespace-pre-wrap">{order.address}</p>
          </div>
          {order.notes && (
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-1">Notes</div>
              <p className="text-sm whitespace-pre-wrap">{order.notes}</p>
            </div>
          )}
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">Items</div>
            <div className="divide-y divide-border/60">
              {order.lines.map((l) => (
                <div key={l.id} className="flex justify-between py-2 text-sm">
                  <span>{l.name} <span className="text-muted-foreground">× {l.qty}</span></span>
                  <span>₹{l.price * l.qty}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
            {order.status === "pending" ? (
              <button onClick={onComplete} className="px-5 py-2 rounded-full text-primary-foreground text-sm font-medium hover:scale-105 transition" style={{ background: "var(--gradient-gold)" }}>Mark Completed ✓</button>
            ) : (
              <button onClick={onReopen} className="px-5 py-2 rounded-full bg-secondary text-secondary-foreground text-sm hover:bg-secondary/80 transition">Reopen</button>
            )}
            <button onClick={onDelete} className="px-5 py-2 rounded-full border border-border text-sm text-muted-foreground hover:text-destructive hover:border-destructive transition">Delete</button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
