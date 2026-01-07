const { z } = require("zod");

const storeCreateSchema = z.object({
  body: z.object({
    name: z.string().min(20).max(60),
    email: z.string().email().optional().or(z.literal("")),
    address: z.string().max(400),
    ownerId: z.string().uuid().optional(),
  }),
});

const storeQuerySchema = z.object({
  query: z.object({
    q: z.string().optional(),
  }),
});

module.exports = { storeCreateSchema, storeQuerySchema };
