import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";

const AdminDashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-background text-foreground px-6 py-6">
      <header className="flex items-center justify-between mb-6">
        <div>
          <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground">Admin</p>
          <h1 className="text-xl font-semibold tracking-tight">System overview</h1>
        </div>
        <button
          onClick={logout}
          className="text-xs px-3 py-1.5 rounded-md border border-border text-muted-foreground hover:bg-muted transition-colors"
        >
          Logout
        </button>
      </header>

      <section className="grid gap-4 md:grid-cols-3 mb-8">
        {["Total users", "Total stores", "Total ratings"].map((label) => (
          <motion.div
            key={label}
            className="rounded-xl bg-card/70 border border-border/80 px-4 py-3 shadow-sm shadow-black/30"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <p className="text-[11px] text-muted-foreground mb-1">{label}</p>
            <motion.p
              className="text-2xl font-semibold tracking-tight"
              initial={{ opacity: 0.4 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              0
            </motion.p>
          </motion.div>
        ))}
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl bg-card/70 border border-border/80 p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium">Users</h2>
            <p className="text-[11px] text-muted-foreground">Sorted by name</p>
          </div>
          <div className="overflow-hidden rounded-lg border border-border/60">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/40 sticky top-0">
                <tr className="text-[11px] text-muted-foreground/90">
                  <th className="px-3 py-2 font-medium">Name</th>
                  <th className="px-3 py-2 font-medium">Email</th>
                  <th className="px-3 py-2 font-medium">Role</th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-muted/40 transition-colors">
                  <td className="px-3 py-2 text-xs text-muted-foreground/70" colSpan={3}>
                    No users yet.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-xl bg-card/70 border border-border/80 p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium">Stores</h2>
            <p className="text-[11px] text-muted-foreground">Sorted by rating</p>
          </div>
          <div className="overflow-hidden rounded-lg border border-border/60">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/40 sticky top-0">
                <tr className="text-[11px] text-muted-foreground/90">
                  <th className="px-3 py-2 font-medium">Store</th>
                  <th className="px-3 py-2 font-medium">Email</th>
                  <th className="px-3 py-2 font-medium">Rating</th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-muted/40 transition-colors">
                  <td className="px-3 py-2 text-xs text-muted-foreground/70" colSpan={3}>
                    No stores yet.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <footer className="mt-8 text-[11px] text-muted-foreground flex justify-between">
        <span>{user?.email}</span>
        <span>Polaris Ratings · Admin</span>
      </footer>
    </div>
  );
};

export default AdminDashboard;
