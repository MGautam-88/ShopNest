const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { admin } = require('../middlewares/adminMiddleware');

const { createOrder, updateOrderStatus, getMyOrders, getOrders } = require('../controllers/orderController');

router.route('/').post(protect, createOrder).get(protect, admin, getOrders);
router.route('/:id/status').put(protect, admin, updateOrderStatus);
router.route('/myorders').get(protect, getMyOrders);

module.exports = router;