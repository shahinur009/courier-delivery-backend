const express = require("express");
const {
  getAllOrders,
  getOrdersByCustomer,
  getOrdersByAgent,
  getOrderById,
  getOrderByTrackingNumber,
  placeOrder,
  updateOrderById,
  updateOrderStatus,
  assignOrderToAgent,
  getDashboardMetrics,
} = require("../controllers/ordersController");
const { authenticateToken, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

// Public route (tracking)
router.get("/track/:trackingNumber", getOrderByTrackingNumber);

// Customer routes
router.get("/customer/:customerId", authenticateToken, getOrdersByCustomer);
router.post("/", authenticateToken, placeOrder);

// Delivery agent routes
router.get(
  "/agent/:agentId",
  authenticateToken,
  authorizeRoles("agent", "admin"),
  getOrdersByAgent
);
router.patch(
  "/:id/status",
  authenticateToken,
  authorizeRoles("agent", "admin"),
  updateOrderStatus
);

// Admin routes
router.get("/", authenticateToken, authorizeRoles("admin"), getAllOrders);
router.get(
  "/metrics",
  authenticateToken,
  authorizeRoles("admin"),
  getDashboardMetrics
);
router.patch(
  "/:id/assign",
  authenticateToken,
  authorizeRoles("admin"),
  assignOrderToAgent
);
router.patch(
  "/:id",
  authenticateToken,
  authorizeRoles("admin"),
  updateOrderById
);

// Common routes
router.get("/:id", authenticateToken, getOrderById);

module.exports = router;
