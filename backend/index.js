const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config(); // Load environment variables from .env file
const connectDB = require('./config/db');

const userRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/analyticsRoutes');

connectDB(); 
const app = express();

app.use(cors(
    {
        origin: ['http://localhost:3000', 'http://127.0.0.1:3000'], // Adjust this to your frontend URL
        credentials: true, // Allow cookies to be sent with requests
    }
));

app.use(express.json()); //  to parse JSON bodies
app.use(express.urlencoded({ extended: true }));

// we can use rate limiter which will limit the number of requests from a single IP address in a given time frame to prevent abuse and DDoS attacks

app.use('/api/auth',userRoutes);//more clean way , we can use this again simply if wated without writing the whole path again!
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/payment', require('./routes/paymentRoutes'));
app.use('/api/analytics', adminRoutes);

// Serve frontend build files
if (process.env.NODE_ENV === 'production') {
    const frontendBuildPath = path.join(__dirname, '../frontend/build');

    app.use(express.static(frontendBuildPath));

    // For any route not found in API, serve React app
    app.use((req, res) => {
        res.sendFile(path.join(frontendBuildPath, 'index.html'));
    });
} else {
    app.get("/", (req,res)=>{
        res.send("ShopNest Backend is running");
    });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
