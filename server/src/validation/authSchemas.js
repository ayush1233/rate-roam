const { z } = require("zod");

const nameSchema = z.string().min(20).max(60);

const passwordSchema = z
  .string()
  .min(8)
  .max(16)
  .regex(/[A-Z]/, "At least one uppercase letter")
  .regex(/[^A-Za-z0-9]/, "At least one special character");

const signupSchema = z.object({
  body: z.object({
    name: nameSchema,
    email: z.string().email(),
    password: passwordSchema,
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8).max(16),
  }),
});

module.exports = { signupSchema, loginSchema };
