const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUsers, getUserData, getMyAddresses, addMyAddress } = require('../controllers/authController');
const { protect} = require('../middlewares/authMiddleware');
const { admin } = require('../middlewares/adminMiddleware');

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/users",protect,admin, getUsers);
router.get("/users/email",protect,admin, getUserData); // where protect and admin are the middlewares to authenticate!
router.route("/addresses").get(protect, getMyAddresses).post(protect, addMyAddress);

//otp-email verification route
// router.post("/verify-email", async (req, res) => {
//     const { email, otp } = req.body;

//     try {

module.exports = router;
