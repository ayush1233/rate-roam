const express = require("express");
const auth = require("../middleware/auth");
const ratingController = require("../controllers/ratingController");

const router = express.Router();

router.use(auth);

router.get("/summary", ratingController.getUserSummary);

module.exports = router;
