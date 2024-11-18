const express = require('express');
const {
  getAllOrders,
  getOrdersByDeliverer,
  getOrderById,
  placeOrder,
  updateOrderById,
  deleteOrderById,
} = require('../controllers/ordersController');

const router = express.Router();

// Route definitions
router.get('/', getAllOrders);
router.get('/:id', getOrdersByDeliverer);
router.get('/order/:id', getOrderById);
router.post('/', placeOrder);
router.patch('/:id', updateOrderById);
router.delete('/:id', deleteOrderById);

module.exports = router;
