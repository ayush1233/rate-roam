const express = require("express");
const auth = require("../middleware/auth");
const { requireRole } = require("../middleware/roles");
const validate = require("../middleware/validate");
const { storeCreateSchema, storeQuerySchema } = require("../validation/storeSchemas");
const storeController = require("../controllers/storeController");

const router = express.Router();

router.get("/", validate(storeQuerySchema), storeController.searchStores);

router.post("/", auth, requireRole("admin"), validate(storeCreateSchema), storeController.createStore);

module.exports = router;
