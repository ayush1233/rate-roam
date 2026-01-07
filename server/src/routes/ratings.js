const express = require("express");
const auth = require("../middleware/auth");
const validate = require("../middleware/validate");
const { ratingUpsertSchema } = require("../validation/ratingSchemas");
const ratingController = require("../controllers/ratingController");

const router = express.Router();

router.post("/stores/:storeId", auth, validate(ratingUpsertSchema), ratingController.upsertRating);

module.exports = router;
