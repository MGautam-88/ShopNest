import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {useSelector} from 'react-redux';
import "../styles/navbar.css";

const Navbar = () => {
    const {user, logout}= useContext(AuthContext);
    const navigate = useNavigate();
    const cartItems = useSelector((state) => state.cart.cartItems);
    const titleWords = ['mr', 'mrs', 'ms', 'miss', 'dr', 'prof', 'sir', 'madam'];
    const firstName = user?.name
        ?.trim()
        .split(/\s+/)
        .find((part) => !titleWords.includes(part.replace(/\./g, '').toLowerCase()));

    const handleLogout = () => {
        logout();
        navigate('/login');// we will see later to use or not 
    }

  return (
    <nav className="navbar">
        <div className="navbar-brand">
            <Link to="/">
                <img src="/images/lgL.png" alt="ShopNest Logo" className="navbar-logo" />
                <span className="navbar-title">ShopNest</span>
            </Link>
        </div>
        <ul className="navbar-links">
            <li><Link to="/shop">Shop</Link></li>
            <li><Link to="/cart">Cart({cartItems.length})</Link></li>
            {user ? (
                <>
                    <li><Link to="/profile">Hi, {firstName || user.name}</Link></li>
                    {user.role === "admin" && <li><Link to="/admin">Admin-Dashboard</Link></li>}
                    <li><button onClick={handleLogout} className = "btn-logout">Logout</button></li>
                </>
            ) : (
                <li><Link to="/login">Login</Link></li>
            )}
        </ul>
    </nav>
  );
};

export default Navbar;
