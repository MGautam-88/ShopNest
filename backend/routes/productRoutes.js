const express = require('express');
const { protect} = require('../middlewares/authMiddleware');
const { admin } = require('../middlewares/adminMiddleware');
const { getProducts, createProduct, getProductById, updateProduct, deleteProduct } = require('../controllers/productController');

const multer = require('multer');//middleware for handling multipart/form-data, which is primarily used for uploading files.
const upload = multer({ dest: 'uploads/' }); // we will store the upld file here temporarily!

const router = express.Router();

router.route('/').get(getProducts).post(protect,admin, upload.single('image'),createProduct);
router.route('/:id').get(getProductById).put(protect,admin,upload.single('image') ,updateProduct).delete(protect,admin, deleteProduct);

module.exports = router;