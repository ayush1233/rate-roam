const express = require("express");
const auth = require("../middleware/auth");
const { requireRole } = require("../middleware/roles");
const ratingController = require("../controllers/ratingController");

const router = express.Router();

router.use(auth, requireRole("owner"));

router.get("/summary", ratingController.getOwnerSummary);

module.exports = router;
