import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

const nameSchema = z
  .string()
  .min(20, "Name must be at least 20 characters")
  .max(60, "Name must be at most 60 characters");

const passwordSchema = z
  .string()
  .min(8, "Min 8 characters")
  .max(16, "Max 16 characters")
  .regex(/[A-Z]/, "At least one uppercase letter")
  .regex(/[^A-Za-z0-9]/, "At least one special character");

const schema = z.object({
  name: nameSchema,
  email: z.string().email("Invalid email"),
  password: passwordSchema,
});

type FormValues = z.infer<typeof schema>;

const SignupPage = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const passwordValue = watch("password") || "";

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    try {
      await signup(values as { name: string; email: string; password: string });
      navigate("/dashboard/user");
    } finally {
      setSubmitting(false);
    }
  };

  const strength = Math.min(
    3,
    [/[A-Z]/.test(passwordValue), /[^A-Za-z0-9]/.test(passwordValue), passwordValue.length >= 8].filter(Boolean)
      .length,
  );

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <motion.div
        className="w-full max-w-md bg-card/60 border border-border/60 rounded-xl p-6 shadow-lg shadow-black/40"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <div className="space-y-1 mb-6">
          <p className="text-[10px] tracking-[0.35em] uppercase text-muted-foreground">Store Rating Platform</p>
          <h1 className="text-xl font-semibold tracking-tight">Create your account</h1>
          <p className="text-xs text-muted-foreground">Join to share honest feedback and discover trusted stores.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-4">
            <div className="relative">
              <input
                type="text"
                autoComplete="name"
                {...register("name")}
                className={`peer w-full rounded-md bg-background/40 border px-3 pt-4 pb-1.5 text-sm outline-none transition
                ${errors.name ? "border-destructive" : "border-border/70 focus:border-primary focus:ring-1 focus:ring-primary"}`}
              />
              <label
                className="pointer-events-none absolute left-3 top-2.5 text-[11px] text-muted-foreground/80
                           transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-xs
                           peer-focus:top-1 peer-focus:text-[10px] peer-focus:text-primary"
              >
                Full name
              </label>
              {errors.name && (
                <motion.p
                  className="mt-1 text-[11px] text-destructive"
                  initial={{ opacity: 0, y: -3 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {errors.name.message}
                </motion.p>
              )}
            </div>

            <div className="relative">
              <input
                type="email"
                autoComplete="email"
                {...register("email")}
                className={`peer w-full rounded-md bg-background/40 border px-3 pt-4 pb-1.5 text-sm outline-none transition
                ${errors.email ? "border-destructive" : "border-border/70 focus:border-primary focus:ring-1 focus:ring-primary"}`}
              />
              <label
                className="pointer-events-none absolute left-3 top-2.5 text-[11px] text-muted-foreground/80
                           transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-xs
                           peer-focus:top-1 peer-focus:text-[10px] peer-focus:text-primary"
              >
                Email
              </label>
              {errors.email && (
                <motion.p
                  className="mt-1 text-[11px] text-destructive"
                  initial={{ opacity: 0, y: -3 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {errors.email.message}
                </motion.p>
              )}
            </div>

            <div className="relative space-y-2">
              <input
                type="password"
                autoComplete="new-password"
                {...register("password")}
                className={`peer w-full rounded-md bg-background/40 border px-3 pt-4 pb-1.5 text-sm outline-none transition
                ${errors.password ? "border-destructive" : "border-border/70 focus:border-primary focus:ring-1 focus:ring-primary"}`}
              />
              <label
                className="pointer-events-none absolute left-3 top-2.5 text-[11px] text-muted-foreground/80
                           transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-xs
                           peer-focus:top-1 peer-focus:text-[10px] peer-focus:text-primary"
              >
                Password
              </label>

              <div className="flex items-center gap-2 pt-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className={`h-1.5 flex-1 rounded-full bg-muted ${
                      strength > i ? "bg-primary" : "bg-muted"
                    }`}
                    layout
                    transition={{ duration: 0.2 }}
                  />
                ))}
                <span className="text-[10px] text-muted-foreground min-w-[40px] text-right">
                  {strength === 0 ? "Weak" : strength === 1 ? "Fair" : strength === 2 ? "Strong" : "Strong"}
                </span>
              </div>

              {errors.password && (
                <motion.p
                  className="mt-1 text-[11px] text-destructive"
                  initial={{ opacity: 0, y: -3 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {errors.password.message}
                </motion.p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={!isValid || submitting}
            className="w-full inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground
                       text-sm font-medium px-4 py-2.5 shadow-sm hover:shadow-md hover:-translate-y-0.5
                       transition-transform transition-shadow duration-200 ease-in-out disabled:opacity-60 disabled:hover:translate-y-0"
          >
            {submitting ? "Creating account…" : "Create account"}
          </button>
        </form>

        <div className="mt-5 text-[11px] text-muted-foreground flex justify-between items-center">
          <span>Already have an account?</span>
          <Link to="/auth/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default SignupPage;
