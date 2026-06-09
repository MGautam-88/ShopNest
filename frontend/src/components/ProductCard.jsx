import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart } from '../redux/cartSlice';
import "../styles/product.css";

const ProductCard = ({ product }) => {
    const dispatch = useDispatch();
    const cartItem = useSelector((state) =>
        state.cart.cartItems.find((item) => item.productId === product._id)
    );

    const updateCartQty = (qty) => {
        if (product) {
            dispatch(addToCart({
                productId: product._id,
                name: product.name,
                price: product.price,
                imageUrl: product.imageUrl,
                qty
            }));
        }
    };

    const handleAddToCart = () => {
        updateCartQty((cartItem?.qty || 0) + 1);
    };

    const handleDecreaseQty = () => {
        if (!cartItem) return;

        if (cartItem.qty <= 1) {
            dispatch(removeFromCart(product._id));
        } else {
            updateCartQty(cartItem.qty - 1);
        }
    };

    return (
        <div className="product-card">
            <Link to={`/product/${product._id}`} className="product-link">
                <img src={product.imageUrl} alt={product.name} className="product-image" />
                <div className="product-info">
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-price">₹{product.price.toFixed(2)}</p>
                </div>
            </Link>
            <div className="product-card-actions">
                {cartItem ? (
                    <div className="product-qty-controls" aria-label={`${product.name} quantity in cart`}>
                        <button type="button" onClick={handleDecreaseQty} aria-label={`Decrease ${product.name} quantity`}>
                            -
                        </button>
                        <span>{cartItem.qty}</span>
                        <button type="button" onClick={handleAddToCart} aria-label={`Increase ${product.name} quantity`}>
                            +
                        </button>
                    </div>
                ) : (
                    <button type="button" onClick={handleAddToCart} className="btn">Add to cart</button>
                )}
            </div>
        </div>
    );
};

export default ProductCard;
