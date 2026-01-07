const express = require("express");
const auth = require("../middleware/auth");
const { requireRole } = require("../middleware/roles");
const adminController = require("../controllers/adminController");

const router = express.Router();

router.use(auth, requireRole("admin"));

router.get("/metrics", adminController.getMetrics);
router.get("/users", adminController.listUsers);
router.get("/stores", adminController.listStores);

module.exports = router;
