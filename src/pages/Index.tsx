import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-6">
      <motion.div
        className="max-w-xl text-center space-y-6"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground">
          Polaris Ratings
        </p>
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
          Store reputation,
          <span className="text-primary"> made tangible.</span>
        </h1>
        <p className="text-sm md:text-base text-muted-foreground max-w-md mx-auto">
          A focused platform where admins, owners, and customers collaborate
          through honest, structured store ratings.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Link
            to="/auth/login"
            className="inline-flex items-center rounded-md px-5 py-2.5 text-sm font-medium
                       bg-primary text-primary-foreground shadow-sm hover:shadow-md
                       transition ease-in-out duration-200 hover:-translate-y-0.5"
          >
            Enter platform
          </Link>
          <Link
            to="/auth/signup"
            className="inline-flex items-center rounded-md px-5 py-2.5 text-sm font-medium
                       border border-border text-foreground/90 hover:bg-muted
                       transition ease-in-out duration-200"
          >
            Create an account
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Index;
