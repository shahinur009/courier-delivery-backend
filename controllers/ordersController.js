const { ObjectId } = require('mongodb');
const client = require('../config/db');

const ordersCollection = client.db('ordersCollection').collection('orders');

// Fetch all orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await ordersCollection.find().toArray();
    res.send(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).send({ error: 'Error fetching orders' });
  }
};

// Fetch orders by deliveredBy ID
const getOrdersByDeliverer = async (req, res) => {
  try {
    const { id } = req.params;
    const orders = await ordersCollection.find({ 'deliveredBy.id': id }).toArray();
    res.send(orders);
  } catch (error) {
    console.error('Error fetching orders by deliverer:', error);
    res.status(500).send({ error: 'Error fetching orders by deliverer' });
  }
};

// Fetch order by ID
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await ordersCollection.findOne({ _id: new ObjectId(id) });
    if (order) {
      res.send(order);
    } else {
      res.status(404).send({ error: 'Order not found' });
    }
  } catch (error) {
    console.error('Error fetching order by ID:', error);
    res.status(500).send({ error: 'Error fetching order by ID' });
  }
};

// Place a new order
const placeOrder = async (req, res) => {
  try {
    const order = req.body;
    const result = await ordersCollection.insertOne(order);
    res.send(result);
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).send({ error: 'Error placing order' });
  }
};

// Update an order by ID
const updateOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    const result = await ordersCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedData }
    );
    res.send(result);
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).send({ error: 'Error updating order' });
  }
};

// Delete an order by ID
const deleteOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await ordersCollection.deleteOne({ _id: new ObjectId(id) });
    res.send(result);
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).send({ error: 'Error deleting order' });
  }
};

module.exports = {
  getAllOrders,
  getOrdersByDeliverer,
  getOrderById,
  placeOrder,
  updateOrderById,
  deleteOrderById,
};
