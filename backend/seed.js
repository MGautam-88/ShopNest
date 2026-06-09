require('dotenv').config();

const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');

const seedDatabase = async () => {
    try {
        await connectDB();

        await Order.deleteMany({});
        await Product.deleteMany({});
        await User.deleteMany({});

        const users = await User.insertMany([
            {
                name: 'Admin One',
                email: 'admin1@shopnest.com',
                password: await bcrypt.hash('ab12', 10), // Password: ab12
                role: 'admin',
                verified: true,
            },
            {
                name: 'Admin Two',
                email: 'admin2@shopnest.com',
                password: await bcrypt.hash('cd34', 10), // Password: cd34
                role: 'admin',
                verified: true,
            },
            {
                name: 'John Doe',
                email: 'john@example.com',
                password: await bcrypt.hash('ef56', 10), // Password: ef56
                role: 'user',
                verified: true,
            },
            {
                name: 'Jane Smith',
                email: 'jane@example.com',
                password: await bcrypt.hash('gh78', 10), // Password: gh78
                role: 'user',
                verified: true,
            },
            {
                name: 'Michael Brown',
                email: 'michael@example.com',
                password: await bcrypt.hash('jk90', 10), // Password: jk90
                role: 'user',
                verified: true,
            },
            {
                name: 'Sara Wilson',
                email: 'sara@example.com',
                password: await bcrypt.hash('mn21', 10), // Password: mn21
                role: 'user',
                verified: true,
            },
        ]);

        const products = await Product.insertMany([

            {
                name: 'Coffee Mug',
                description: 'Ceramic mug with a clean matte finish',
                price: 299,
                category: 'Home',
                stock: 100,
                imageUrl: 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcSSq1OGFLLowatVE76IGJcmtX_Hx5J8dES7VasUfW5-DA482MNJJlHVSqIq8LkmEpmJKgZUEc7fjONLzpEc7nZBop7kCYr_8w',
                ratings: 4.2,
                numReviews: 8,
            },

            {
                name: 'Water Bottle',
                description: 'Insulated stainless steel water bottle',
                price: 699,
                category: 'Accessories',
                stock: 60,
                imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSstP-wjb_c21Q1GkkERCD-HfqzAWn_d9UVJQ&s',
                ratings: 4.7,
                numReviews: 18,
            },

            {
                name: 'Laptop Stand',
                description: 'Adjustable aluminum laptop stand',
                price: 1299,
                category: 'Office',
                stock: 25,
                imageUrl: 'data:image/jpeg;base64,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',
                ratings: 4.5,
                numReviews: 9,
            },

            {
                name: 'Desk Lamp',
                description: 'Minimal desk lamp with warm LED lighting',
                price: 899,
                category: 'Home',
                stock: 40,
                imageUrl: 'data:image/jpeg;base64,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',
                ratings: 4.4,
                numReviews: 10,
            },

            {
                name: 'Classic T-Shirt',
                description: 'Soft cotton t-shirt for everyday wear',
                price: 499,
                category: 'Clothing',
                stock: 50,
                imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcrmbsj4R66qDn0ph_7OtO0Uf9GGQSz4Eonw&s',
                ratings: 4.5,
                numReviews: 12,
            },

            {
                name: 'Wireless Headphones',
                description: 'Noise-isolating wireless headphones with deep bass',
                price: 2499,
                category: 'Electronics',
                stock: 20,
                imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRG9VV-A71Gkki9tx-gpqDUPR5bbAWkfadoCw&s',
                ratings: 4.8,
                numReviews: 26,
            },

            {
                name: 'Running Shoes',
                description: 'Lightweight running shoes for daily workouts',
                price: 3499,
                category: 'Footwear',
                stock: 30,
                imageUrl: 'data:image/jpeg;base64,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',
                ratings: 4.6,
                numReviews: 15,
            },

        ]);

        await Order.create([

            {
                user: users[2]._id,
                items: [
                    {
                        productID: products[0]._id,
                        quantity: 2,
                        price: products[0].price,
                    },
                    {
                        productID: products[1]._id,
                        quantity: 1,
                        price: products[1].price,
                    },
                ],
                totalAmount: products[0].price * 2 + products[1].price,
                address: {
                    fullName: 'John Doe',
                    addressLine1: '221B Baker Street',
                    addressLine2: 'Apt 2',
                    postalCode: '10001',
                    city: 'New York',
                    country: 'USA',
                },
                paymentID: 'seed_payment_001',
                status: 'ordered',
            },

            {
                user: users[3]._id,
                items: [
                    {
                        productID: products[3]._id,
                        quantity: 1,
                        price: products[3].price,
                    },
                    {
                        productID: products[4]._id,
                        quantity: 2,
                        price: products[4].price,
                    },
                ],
                totalAmount: products[3].price + products[4].price * 2,
                address: {
                    fullName: 'Jane Smith',
                    addressLine1: '45 Park Avenue',
                    addressLine2: '',
                    postalCode: '10011',
                    city: 'Chicago',
                    country: 'USA',
                },
                paymentID: 'seed_payment_002',
                status: 'shipped',
            },
            
            {
                user: users[4]._id,
                items: [
                    {
                        productID: products[5]._id,
                        quantity: 3,
                        price: products[5].price,
                    },
                    {
                        productID: products[6]._id,
                        quantity: 1,
                        price: products[6].price,
                    },
                ],
                totalAmount: products[5].price * 3 + products[6].price,
                address: {
                    fullName: 'Michael Brown',
                    addressLine1: '12 Lake View Road',
                    addressLine2: 'Suite 5',
                    postalCode: '90001',
                    city: 'Los Angeles',
                    country: 'USA',
                },
                paymentID: 'seed_payment_003',
                status: 'delivered',
            },
        ]);

        console.log('Seed completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('Seed failed:', error.message);
        process.exit(1);
    }
};

seedDatabase();