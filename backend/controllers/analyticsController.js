const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

const getAdminStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({role: 'user'}); // Count only regular users, not admins
        const totalOrders = await Order.countDocuments({});
        const totalProducts = await Product.countDocuments({});

        const orders = await Order.find({});
        const totalRevenueData = orders.reduce((acc, order) => acc + order.totalAmount, 0);

        res.json({totalUsers, totalOrders, totalProducts, totalRevenue: totalRevenueData});
    } catch (error) {
        res.status(500).json({message: 'Error fetching admin stats', error: error.message});
    }
};

module.exports = {getAdminStats};