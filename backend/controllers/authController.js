const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');

const User = require('../models/User');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '15d' });
}

//Pending: Hashing, JWT, otp(No. or string) , welcomme mail

//Register a New-User
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        let user = await User.findOne({ email });//So we made email as the PK to check if user already exists

        if (user) {
            return res.status(400).json({ message: 'Email already in use!' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // const newUser = new User({ name, email, password: hashedPassword });
        // await newUser.save(); // ← you have to manually save!
        const newUser = await User.create({ name, email, password: hashedPassword });// automatically saved to database ✅

        if (newUser) {
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            const message = `Thanks for registering with ShopNest, ${name}!
            Your OTP for ShopNest registration is: ${otp}`;
            // or we can add a link yo directly verify the email instead of OTP, but for now we will go with OTP!

            await sendEmail({
                email,
                subject: 'Welcome to ShopNest! Your OTP is here',
                message
            });

            res.status(201).json({
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                token: generateToken(newUser._id)
            });
        }
        else {
            res.status(400).json({ message: 'Invalid user data!' });
        }
    }

    catch (error) {
        res.status(500).json({ message: 'Server error!' });
    }
};

//Login User
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: 'Invalid Credentials!' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error!' });
    }
};

//Get All Users (Admin Only)
const getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password'); // Exclude password from the response
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error!' });
    }   
};


//Get User Data
const getUserData = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email }).select('-password'); // Exclude password from the response

        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found!' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error!' });
    }
};

const getMyAddresses = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('addresses');
        res.json(user.addresses || []);
    } catch (error) {
        res.status(500).json({ message: 'Server error!' });
    }
};

const addMyAddress = async (req, res) => {
    try {
        const { fullName, addressLine1, addressLine2, postalCode, city, country } = req.body;

        if (!fullName || !addressLine1 || !postalCode || !city || !country) {
            return res.status(400).json({ message: 'All required address fields must be filled!' });
        }

        const user = await User.findById(req.user._id);
        user.addresses.push({ fullName, addressLine1, addressLine2, postalCode, city, country });
        await user.save();

        res.status(201).json(user.addresses);
    } catch (error) {
        res.status(500).json({ message: 'Server error!' });
    }
};

module.exports = { registerUser, loginUser, getUsers, getUserData, getMyAddresses, addMyAddress };
