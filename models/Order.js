const { ObjectId } = require("mongodb");
const client = require("../config/db");

const ordersCollection = client.db("courierApp").collection("orders");

class Order {
  constructor(orderData) {
    this.customerId = orderData.customerId;
    this.pickupAddress = orderData.pickupAddress;
    this.deliveryAddress = orderData.deliveryAddress;
    this.parcelSize = orderData.parcelSize;
    this.parcelType = orderData.parcelType;
    this.paymentMethod = orderData.paymentMethod; // 'cod' or 'prepaid'
    this.codAmount = orderData.codAmount || 0;
    this.status = "pending"; // pending, assigned, picked_up, in_transit, delivered, failed
    this.assignedTo = orderData.assignedTo || null; // delivery agent ID
    this.trackingNumber = this.generateTrackingNumber();
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.currentLocation = orderData.currentLocation || null;
  }

  generateTrackingNumber() {
    return (
      "TRK" + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase()
    );
  }

  static async create(orderData) {
    const order = new Order(orderData);
    const result = await ordersCollection.insertOne(order);
    return { ...order, _id: result.insertedId };
  }

  static async findById(id) {
    return await ordersCollection.findOne({ _id: new ObjectId(id) });
  }

  static async findByTrackingNumber(trackingNumber) {
    return await ordersCollection.findOne({ trackingNumber });
  }

  static async findByCustomerId(customerId) {
    return await ordersCollection.find({ customerId }).toArray();
  }

  static async findByAgentId(agentId) {
    return await ordersCollection.find({ assignedTo: agentId }).toArray();
  }

  static async updateOrder(id, updateData) {
    updateData.updatedAt = new Date();
    return await ordersCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
  }

  static async getAllOrders() {
    return await ordersCollection.find().toArray();
  }

  static async getOrdersByStatus(status) {
    return await ordersCollection.find({ status }).toArray();
  }

  static async getDashboardMetrics() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dailyBookings = await ordersCollection.countDocuments({
      createdAt: { $gte: today },
    });

    const failedDeliveries = await ordersCollection.countDocuments({
      status: "failed",
      updatedAt: { $gte: today },
    });

    const codAmounts = await ordersCollection
      .aggregate([
        {
          $match: {
            paymentMethod: "cod",
            status: "delivered",
            updatedAt: { $gte: today },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$codAmount" },
          },
        },
      ])
      .toArray();

    return {
      dailyBookings,
      failedDeliveries,
      totalCOD: codAmounts[0]?.total || 0,
    };
  }
}

module.exports = Order;
