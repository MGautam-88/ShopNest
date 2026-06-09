const express = require('express');
const cors = require('cors');
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

app.get("/", (req,res)=>{
    res.send("ShopNest Backend is running");
})

app.use('/api/auth',userRoutes);//more clean way , we can use this again simply if wated without writing the whole path again!
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/analytics', adminRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});



const path = require('path')

// Serve frontend build files
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/dist')))

    // For any route not found in API, serve React app
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../frontend/dist/index.html'))
    })
}