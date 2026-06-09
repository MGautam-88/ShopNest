const Order = require('../models/Order');
const Product = require('../models/Product');
const sendEmail = require('../utils/sendEmail');

// for Creating a new order by all verified users 
const createOrder = async (req, res) => {
    try {
        const { items, totalAmount, address, paymentID } = req.body;
        if(!items || items.length === 0 || !totalAmount || !address || !paymentID){
            return res.status(400).json({message: 'All fields are required'});
        }
        else{
            const productMap = {} ;

            for (const item of items) {
                const product = await Product.findById(item.productID);

                if (!product) {
                    return res.status(404).json({ message: `Product not found for item ${item.productID}` });
                }

                if (product.stock < item.quantity) {
                    return res.status(400).json({
                        message: `Insufficient stock for ${product.name}. Available: ${product.stock}, requested: ${item.quantity}`
                    });
                }

                productMap[item.productID] = product.name;
            }

            const order = new Order({
                user: req.user._id,
                items,
                totalAmount,
                address,
                paymentID
            });
            await order.save();

            for (const item of items) {
                await Product.findByIdAndUpdate(
                    item.productID,
                    { $inc: { stock: -item.quantity } },
                    { new: true }
                );
            }

            const message =`Dear ${req.user.name},\n\nThank you for your order! Here are the details:\n\nOrder ID: ${order._id}\nTotal Amount: ₹${order.totalAmount}\nShipping Address: ${order.address.addressLine1}, ${order.address.addressLine2 ? order.address.addressLine2 + ', ' : ''}${order.address.city}, ${order.address.postalCode}, ${order.address.country}\n\nItems:\n${order.items.map(item => `- ${productMap[item.productID]}, Quantity: ${item.quantity}, Price: ₹${item.price}`).join('\n')}\n\nWe will notify you once your order is shipped.\n\nBest regards,\nShopNest Team`;
            await sendEmail({email: req.user.email, subject: 'Order Confirmation', message});
            res.status(201).json({message: 'Order created successfully', order});
        }
    } catch (error) {
        res.status(500).json({message: 'Error creating order', error: error.message});
    }
};

//for getting all orders of a particular user 
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({user: req.user._id}).sort({createdAt: -1}).populate('items.productID', 'name price');
        res.json(orders);
    } catch (error) {
        res.status(500).json({message: 'Error fetching orders', error: error.message});
    }
};

//for getting all orders of all users by admin
const getOrders = async (req, res) => {
    try {
        const orders = await Order.find().sort({createdAt: -1}).populate('user', 'id name email').populate('items.productID', 'name price');//D
        res.json(orders);
    }catch (error) {
        res.status(500).json({message: 'Error fetching orders', error: error.message});
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id)
                                 .populate('user', 'name email')  // ← add this
                                 .populate('items.productID', 'name'); // ← add this

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        order.status = status;
        await order.save();

        // status messages for each stage
        const statusMessages = {
            shipped: `Dear ${order.user.name},\n\nGreat news! Your order has been shipped! 🚚\n\nOrder ID: ${order._id}\nTotal Amount: ₹${order.totalAmount}\n\nItems:\n${order.items.map(item => `- ${item.productID.name}, Quantity: ${item.quantity}`).join('\n')}\n\nYour order is on its way. We will notify you once it's delivered.\n\nBest regards,\nShopNest Team`,

            delivered: `Dear ${order.user.name},\n\nYour order has been delivered! 🎉\n\nOrder ID: ${order._id}\nTotal Amount: ₹${order.totalAmount}\n\nItems:\n${order.items.map(item => `- ${item.productID.name}, Quantity: ${item.quantity}`).join('\n')}\n\nThank you for shopping with ShopNest!\n\nBest regards,\nShopNest Team`
        }

        // send email only for shipped and delivered
        if (statusMessages[status]) {
            await sendEmail({
                email: order.user.email,
                subject: `Your ShopNest Order has been ${status}!`,
                message: statusMessages[status]
            })
        }

        res.json({ message: 'Order status updated successfully', order });
    } catch (error) {
        res.status(500).json({ message: 'Error updating order status', error: error.message });
    }
};

module.exports = {createOrder, getMyOrders, getOrders, updateOrderStatus};
