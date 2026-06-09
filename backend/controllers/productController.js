const Product = require('../models/Product');
// const cloudinary = require('../utils/cloudinary.js');
const cloudinary = require('../utils/cloudinary.js');

const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server error!' });
    }
};

const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found!' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error!' });
    }
};

const createProduct = async (req, res) => {
   try {
    const { name, description, price, category, stock } = req.body;
    let imageUrl = '';

    if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path);
        imageUrl = result.secure_url;
    }

    const product = new Product({
        name,
        description,
        price,
        category,
        stock,
        imageUrl
    });

    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
    } catch (error) {
        console.error('createProduct error:', error);
        res.status(500).json({ message: error.message || 'Server error!' });
    }
};   

const updateProduct = async (req, res) => {
    try {
        const { name, description, price, category, stock } = req.body;
        //we will get the updated data from the request body, from the form data that we will send from the frontend
        const product = await Product.findById(req.params.id);
        if(product) {
            product.name = name || product.name;// name is given in the request body, then update it, otherwise keep the old name(product.name)
            product.description = description || product.description;
            product.price = price || product.price;
            product.category = category || product.category;
            product.stock = stock || product.stock;
            if(req.file) {
                const result = await cloudinary.uploader.upload(req.file.path);
                product.imageUrl = result.secure_url;
            }

            const updatedProduct = await product.save();
            res.json(updatedProduct);
        }
        else {
            res.status(404).json({ message: 'Product not found!' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error!' });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if(product) {
            await product.deleteOne();//or we can also use remove()
            res.json({ message: 'Product removed!' });
        }
        else {
            res.status(404).json({ message: 'Product not found!' });
        }
        } catch (error) {
            res.status(500).json({ message: 'Server error!' });
        }
    };

module.exports = { getProducts, createProduct, getProductById, updateProduct, deleteProduct };