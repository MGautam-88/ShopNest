import React, { useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { removeFromCart, addToCart, clearCart } from '../redux/cartSlice';
import { useAppMessage } from '../components/AppMessage';
import { AuthContext } from '../context/AuthContext';
import '../styles/cart.css';

const Cart = () => {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const { user } = useContext(AuthContext);
  const { showAlert, showConfirm } = useAppMessage();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
  };

  const handleUpdateQty = (item, qty) => {
    if (qty > 0) {
      dispatch(addToCart({ ...item, qty }));
    } else {
      dispatch(removeFromCart(item.productId));
    }
  };

  const handleClearCart = async () => {
    const confirmed = await showConfirm({
      title: 'Clear your cart?',
      text: 'This will remove all items from your shopping cart.',
      type: 'danger',
      confirmText: 'Clear Cart',
      cancelText: 'Keep Items'
    });

    if (confirmed) {
      dispatch(clearCart());
    }
  };

  const handleCheckout = async () => {
    if (!user) {
      await showAlert({ title: 'Login required', text: 'Please login first', type: 'warning' });
      navigate('/login');
      return;
    }

    navigate('/checkout');
  };

  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  return (
    <div className="cart-container">
      <h2>Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty. <Link to="/shop">Go Shopping</Link></p>
      ) : (
        <div className="cart-layout">
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.productId} className="cart-item">
                <img src={item.imageUrl} alt={item.name} className="cart-item-image" />
                <div className="cart-item-details">
                  <h4>{item.name}</h4>
                  <p>₹{item.price}</p>
                  <div className="qty-controls">
                    <button onClick={() => handleUpdateQty(item, item.qty - 1)}>-</button>
                    <span>{item.qty}</span>
                    <button onClick={() => handleUpdateQty(item, item.qty + 1)}>+</button>
                  </div>
                  <button onClick={() => handleRemove(item.productId)} className="btn-remove">Remove</button>
                </div>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <h3>Total: ₹{totalPrice.toFixed(2)}</h3>
            <button onClick={handleClearCart} className="btn-clear-cart">Clear Cart</button>
            <button onClick={handleCheckout} className="btn btn-checkout">Proceed to Checkout</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
