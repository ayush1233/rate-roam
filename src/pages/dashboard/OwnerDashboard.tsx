import React from "react";
import { motion } from "framer-motion";

import { useAuth, api } from "../../context/AuthContext";

const OwnerDashboard = () => {
  const { user, logout } = useAuth();

  const [summary, setSummary] = React.useState<{
    averageRating: number | null;
    totalReviews: number;
    uniqueReviewers: number;
  }>();

  const [reviewers, setReviewers] = React.useState<
    { id: string; user_name: string; store_name: string; rating: number; created_at: string }[]
  >();

  React.useEffect(() => {
    api.get("/owner/summary").then((res) => {
      setSummary(res.data.summary);
      setReviewers(res.data.reviewers);
    });
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground px-6 py-6">
      <header className="flex items-center justify-between mb-6">
        <div>
          <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground">Store owner</p>
          <h1 className="text-xl font-semibold tracking-tight">Your store pulse</h1>
        </div>
        <button
          onClick={logout}
          className="text-xs px-3 py-1.5 rounded-md border border-border text-muted-foreground hover:bg-muted transition-colors"
        >
          Logout
        </button>
      </header>

      <section className="grid gap-4 md:grid-cols-3 mb-8">
        {summary &&
          [
            { label: "Average rating", value: summary.averageRating ?? 0 },
            { label: "Total reviews", value: summary.totalReviews },
            { label: "Unique reviewers", value: summary.uniqueReviewers },
          ].map((m) => (
            <motion.div
              key={m.label}
              className="rounded-xl bg-card/70 border border-border/80 px-4 py-3 shadow-sm shadow-black/30"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <p className="text-[11px] text-muted-foreground mb-1">{m.label}</p>
              <motion.p
                className="text-2xl font-semibold tracking-tight"
                initial={{ opacity: 0.4 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                {m.value}
              </motion.p>
            </motion.div>
          ))}
      </section>

      <section className="rounded-xl bg-card/70 border border-border/80 p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-medium">Recent reviewers</h2>
          <p className="text-[11px] text-muted-foreground">Last 20 customers</p>
        </div>
        <div className="overflow-hidden rounded-lg border border-border/60">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/40 sticky top-0">
              <tr className="text-[11px] text-muted-foreground/90">
                <th className="px-3 py-2 font-medium">User</th>
                <th className="px-3 py-2 font-medium">Rating</th>
                <th className="px-3 py-2 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {reviewers && reviewers.length > 0 ? (
                reviewers.map((r) => (
                  <tr key={r.id} className="hover:bg-muted/40 transition-colors">
                    <td className="px-3 py-2 text-xs text-muted-foreground/90">{r.user_name}</td>
                    <td className="px-3 py-2 text-xs text-muted-foreground/70">{r.rating}</td>
                    <td className="px-3 py-2 text-xs text-muted-foreground/70">
                      {new Date(r.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="hover:bg-muted/40 transition-colors">
                  <td className="px-3 py-2 text-xs text-muted-foreground/70" colSpan={3}>
                    No reviews yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <footer className="mt-8 text-[11px] text-muted-foreground flex justify-between">
        <span>{user?.email}</span>
        <span>Polaris Ratings · Owner</span>
      </footer>
    </div>
  );
};

export default OwnerDashboard;
