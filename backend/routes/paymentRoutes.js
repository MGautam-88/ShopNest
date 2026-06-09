const express = require('express');
const router = express.Router();

const {createdOrder, verifyPayment} = require('../controllers/paymentController');

router.post('/orders', createdOrder);
router.post('/verify', verifyPayment);

module.exports = router;