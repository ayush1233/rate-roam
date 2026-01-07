import { motion } from "framer-motion";
import * as React from "react";
import { api } from "../context/AuthContext";

const StoreList = () => {
  const [query, setQuery] = React.useState("");
  const [stores, setStores] = React.useState<
    { id: string; name: string; email: string | null; address: string; averageRating: number | null; ratingsCount: number }[]
  >([]);

  React.useEffect(() => {
    const controller = new AbortController();
    const fetchStores = async () => {
      const res = await api.get("/stores", { params: { q: query || undefined }, signal: controller.signal });
      setStores(res.data);
    };
    fetchStores();
    return () => controller.abort();
  }, [query]);

  return (
    <div className="min-h-screen bg-background text-foreground px-6 py-6">
      <header className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground">Discover</p>
          <h1 className="text-xl font-semibold tracking-tight">Stores</h1>
        </div>
        <div className="relative w-full md:w-72">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or address"
            className="w-full rounded-md bg-background/40 border border-border/70 px-3 py-2 text-sm outline-none
                       focus:border-primary focus:ring-1 focus:ring-primary transition"
          />
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((id) => (
          <motion.article
            key={id}
            className="rounded-xl bg-card/70 border border-border/80 p-4 shadow-sm shadow-black/30 cursor-pointer"
            whileHover={{ y: -4, boxShadow: "0 18px 35px rgba(0,0,0,0.45)" }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            <h2 className="text-sm font-medium mb-1">Sample Store {id}</h2>
            <p className="text-[11px] text-muted-foreground mb-3">
              123 Placeholder Ave, Crafted City
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-xs">
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.span
                    key={star}
                    whileHover={{ scale: 1.1 }}
                    className="text-primary"
                  >
                    ★
                  </motion.span>
                ))}
              </div>
              <button className="text-[11px] px-3 py-1.5 rounded-md border border-border text-muted-foreground hover:bg-muted transition-colors">
                Rate
              </button>
            </div>
          </motion.article>
        ))}
      </section>
    </div>
  );
};

export default StoreList;
