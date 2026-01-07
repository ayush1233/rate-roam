const { z } = require("zod");

const ratingUpsertSchema = z.object({
  params: z.object({
    storeId: z.string().uuid(),
  }),
  body: z.object({
    rating: z.number().int().min(1).max(5),
  }),
});

module.exports = { ratingUpsertSchema };
