import { motion } from "framer-motion";
import * as React from "react";
import { api } from "../context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

const StoreList = () => {
  const [query, setQuery] = React.useState("");
  const [stores, setStores] = React.useState<
    { id: string; name: string; email: string | null; address: string; averageRating: number | null; ratingsCount: number }[]
  >([]);
  const [activeStoreId, setActiveStoreId] = React.useState<string | null>(null);
  const [rating, setRating] = React.useState<number | null>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const { toast } = useToast();

  const activeStore = React.useMemo(
    () => stores.find((s) => s.id === activeStoreId) ?? null,
    [activeStoreId, stores],
  );

  React.useEffect(() => {
    const controller = new AbortController();
    const fetchStores = async () => {
      try {
        const res = await api.get("/stores", { params: { q: query || undefined }, signal: controller.signal });
        setStores(res.data);
      } catch (error) {
        if ((error as any).name === "CanceledError") return;
        toast({
          title: "Failed to load stores",
          description: "Please try again in a moment.",
          variant: "destructive",
        });
      }
    };
    fetchStores();
    return () => controller.abort();
  }, [query, toast]);

  const openRateDialog = (storeId: string) => {
    setActiveStoreId(storeId);
    setRating(3);
  };

  const closeRateDialog = () => {
    setActiveStoreId(null);
    setRating(null);
    setSubmitting(false);
  };

  const handleSubmitRating = async () => {
    if (!activeStore || rating == null) return;
    setSubmitting(true);
    try {
      await api.post(`/ratings/stores/${activeStore.id}`, { rating });
      toast({
        title: "Rating saved",
        description: "Your rating has been recorded.",
      });
      closeRateDialog();
    } catch (error) {
      setSubmitting(false);
      toast({
        title: "Could not save rating",
        description: "Please check your connection and try again.",
        variant: "destructive",
      });
    }
  };

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
        {stores.map((store) => (
          <motion.article
            key={store.id}
            className="rounded-xl bg-card/70 border border-border/80 p-4 shadow-sm shadow-black/30 cursor-pointer hover-scale animate-fade-in"
            whileHover={{ y: -4, boxShadow: "0 18px 35px rgba(0,0,0,0.45)" }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            <h2 className="text-sm font-medium mb-1">{store.name}</h2>
            <p className="text-[11px] text-muted-foreground mb-3">{store.address}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-xs">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} className={star <= (store.averageRating ?? 0) ? "text-primary" : "text-muted-foreground"}>
                    ★
                  </span>
                ))}
                <span className="ml-1 text-[11px] text-muted-foreground">
                  {store.averageRating ? store.averageRating.toFixed(1) : "No ratings"}
                  {store.ratingsCount ? ` · ${store.ratingsCount}` : ""}
                </span>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="text-[11px] px-3 py-1.5 h-auto"
                onClick={() => openRateDialog(store.id)}
              >
                Rate
              </Button>
            </div>
          </motion.article>
        ))}
      </section>

      <Dialog open={!!activeStore} onOpenChange={(open) => (!open ? closeRateDialog() : undefined)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Rate {activeStore?.name}</DialogTitle>
            <DialogDescription>
              Share your experience. You can update this rating at any time.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <motion.button
                  key={star}
                  type="button"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setRating(star)}
                  className={
                    "text-2xl transition-colors " +
                    (rating != null && star <= rating ? "text-primary" : "text-muted-foreground")
                  }
                >
                  ★
                </motion.button>
              ))}
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button variant="ghost" onClick={closeRateDialog} disabled={submitting}>
              Cancel
            </Button>
            <Button onClick={handleSubmitRating} disabled={rating == null || submitting}>
              {submitting ? "Saving..." : "Save rating"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StoreList;
