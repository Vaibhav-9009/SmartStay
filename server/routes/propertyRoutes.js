const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const {
  createProperty,
  getAllProperties,
  getMyProperties,
  searchProperties,
  updateProperty,
  deleteProperty,   // 👈 MUST EXIST
} = require("../controllers/propertyController");




// public routes
router.get("/", getAllProperties);
router.get("/search", searchProperties);
// private routes
router.post("/", authMiddleware, createProperty);
router.put("/:id", authMiddleware, updateProperty);
router.get("/my", authMiddleware, getMyProperties);
router.delete("/:id", authMiddleware, deleteProperty);

module.exports = router;
