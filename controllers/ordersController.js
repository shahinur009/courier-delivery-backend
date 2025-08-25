const { ObjectId } = require("mongodb");
const Order = require("../models/Order");

// Fetch all orders (Admin only)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.getAllOrders();
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Error fetching orders" });
  }
};

// Fetch orders by customer ID
const getOrdersByCustomer = async (req, res) => {
  try {
    const { customerId } = req.params;
    const orders = await Order.findByCustomerId(customerId);
    res.json(orders);
  } catch (error) {
    console.error("Error fetching customer orders:", error);
    res.status(500).json({ error: "Error fetching customer orders" });
  }
};

// Fetch orders by delivery agent ID
const getOrdersByAgent = async (req, res) => {
  try {
    const { agentId } = req.params;
    const orders = await Order.findByAgentId(agentId);
    res.json(orders);
  } catch (error) {
    console.error("Error fetching agent orders:", error);
    res.status(500).json({ error: "Error fetching agent orders" });
  }
};

// Fetch order by ID
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ error: "Order not found" });
    }
  } catch (error) {
    console.error("Error fetching order by ID:", error);
    res.status(500).json({ error: "Error fetching order by ID" });
  }
};

// Fetch order by tracking number
const getOrderByTrackingNumber = async (req, res) => {
  try {
    const { trackingNumber } = req.params;
    const order = await Order.findByTrackingNumber(trackingNumber);
    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ error: "Order not found" });
    }
  } catch (error) {
    console.error("Error fetching order by tracking number:", error);
    res.status(500).json({ error: "Error fetching order by tracking number" });
  }
};

// Place a new order
const placeOrder = async (req, res) => {
  try {
    const orderData = {
      ...req.body,
      customerId: req.user.userId, // From authenticated user
    };

    const order = await Order.create(orderData);
    res.status(201).json({
      message: "Order placed successfully",
      order,
      trackingNumber: order.trackingNumber,
    });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ error: "Error placing order" });
  }
};

// Update an order by ID
const updateOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Order.updateOrder(id, req.body);

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json({ message: "Order updated successfully", result });
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ error: "Error updating order" });
  }
};

// Update order status
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, currentLocation } = req.body;

    const updateData = { status };
    if (currentLocation) {
      updateData.currentLocation = currentLocation;
    }

    const result = await Order.updateOrder(id, updateData);

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json({ message: "Order status updated successfully", result });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ error: "Error updating order status" });
  }
};

// Assign order to delivery agent
const assignOrderToAgent = async (req, res) => {
  try {
    const { id } = req.params;
    const { agentId } = req.body;

    const result = await Order.updateOrder(id, {
      assignedTo: agentId,
      status: "assigned",
    });

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json({ message: "Order assigned to agent successfully", result });
  } catch (error) {
    console.error("Error assigning order to agent:", error);
    res.status(500).json({ error: "Error assigning order to agent" });
  }
};

// Get dashboard metrics (Admin only)
const getDashboardMetrics = async (req, res) => {
  try {
    const metrics = await Order.getDashboardMetrics();
    res.json(metrics);
  } catch (error) {
    console.error("Error fetching dashboard metrics:", error);
    res.status(500).json({ error: "Error fetching dashboard metrics" });
  }
};

module.exports = {
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
};
