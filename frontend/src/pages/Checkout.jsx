import React, { useEffect, useState, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { clearCart } from '../redux/cartSlice';
import { useAppMessage } from '../components/AppMessage';

const countries = [
  'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda',
  'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain',
  'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan',
  'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria',
  'Burkina Faso', 'Burundi', 'Cabo Verde', 'Cambodia', 'Cameroon', 'Canada',
  'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros',
  'Congo', 'Costa Rica', 'Croatia', 'Cuba', 'Cyprus', 'Czech Republic',
  'Democratic Republic of the Congo', 'Denmark', 'Djibouti', 'Dominica',
  'Dominican Republic', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea',
  'Eritrea', 'Estonia', 'Eswatini', 'Ethiopia', 'Fiji', 'Finland', 'France',
  'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada',
  'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Honduras',
  'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel',
  'Italy', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati',
  'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia',
  'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Madagascar', 'Malawi',
  'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania',
  'Mauritius', 'Mexico', 'Micronesia', 'Moldova', 'Monaco', 'Mongolia',
  'Montenegro', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 'Nauru', 'Nepal',
  'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Korea',
  'North Macedonia', 'Norway', 'Oman', 'Pakistan', 'Palau', 'Palestine', 'Panama',
  'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal',
  'Qatar', 'Romania', 'Russia', 'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia',
  'Saint Vincent and the Grenadines', 'Samoa', 'San Marino',
  'Sao Tome and Principe', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles',
  'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands',
  'Somalia', 'South Africa', 'South Korea', 'South Sudan', 'Spain', 'Sri Lanka',
  'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan',
  'Tanzania', 'Thailand', 'Timor-Leste', 'Togo', 'Tonga', 'Trinidad and Tobago',
  'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu', 'Uganda', 'Ukraine',
  'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay',
  'Uzbekistan', 'Vanuatu', 'Vatican City', 'Venezuela', 'Vietnam', 'Yemen',
  'Zambia', 'Zimbabwe'
];

const Checkout = () => {
  const { user } = useContext(AuthContext);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showAlert, showConfirm } = useAppMessage();

  const [address, setAddress] = useState({
    fullName: '', addressLine1: '', addressLine2: '', city: '', postalCode: '', country: 'India'
  });
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [useNewAddress, setUseNewAddress] = useState(true);
  const [saveAddress, setSaveAddress] = useState(true);
  const [cityLookupStatus, setCityLookupStatus] = useState('');

  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  useEffect(() => {
    const fetchAddresses = async () => {
      if (!user?.token) return;

      try {
        const res = await fetch('/api/auth/addresses', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        const data = await res.json();
        if (res.ok && Array.isArray(data)) {
          setSavedAddresses(data);
          if (data.length > 0) {
            setSelectedAddressId(data[0]._id);
            setAddress(data[0]);
            setUseNewAddress(false);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchAddresses();
  }, [user]);

  const selectSavedAddress = (id) => {
    const selected = savedAddresses.find((item) => item._id === id);
    setSelectedAddressId(id);
    if (selected) {
      setAddress(selected);
      setUseNewAddress(false);
    }
  };

  const startNewAddress = () => {
    setSelectedAddressId('');
    setUseNewAddress(true);
    setCityLookupStatus('');
    setAddress({ fullName: '', addressLine1: '', addressLine2: '', city: '', postalCode: '', country: 'India' });
  };

  const updatePostalCode = async (value) => {
    const postalCode = value.replace(/\D/g, '').slice(0, 6);
    setAddress((prev) => ({ ...prev, postalCode }));
    setCityLookupStatus('');

    if (postalCode.length === 6) {
      setCityLookupStatus('Finding city...');
      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${postalCode}`);
        const data = await res.json();
        const postOffice = data?.[0]?.PostOffice?.[0];

        if (postOffice) {
          setAddress((prev) => ({
            ...prev,
            postalCode,
            city: postOffice.District || postOffice.Name || prev.city,
            country: postOffice.Country || prev.country || 'India'
          }));
          setCityLookupStatus('City updated from postal code.');
        } else {
          setCityLookupStatus('City not found for this postal code.');
        }
      } catch (error) {
        console.error(error);
        setCityLookupStatus('Unable to fetch city right now.');
      }
    }
  };

  const saveAddressIfNeeded = async () => {
    if (!useNewAddress || !saveAddress) return;

    try {
      const res = await fetch('/api/auth/addresses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify(address)
      });
      const data = await res.json();
      if (res.ok && Array.isArray(data)) {
        setSavedAddresses(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const orderItems = cartItems.map((item) => ({
    productID: item.productId,
    quantity: item.qty,
    price: item.price
  }));

  const handlePayment = async () => {
    try {
      const orderRes = await fetch('/api/payment/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: totalPrice })
      });
      const orderData = await orderRes.json().catch(() => ({}));

      if (!orderRes.ok) {
        // Razorpay unconfigured exception handler
        const fallback = await showConfirm({
          title: 'Payment setup unavailable',
          text: 'Razorpay keys unconfigured on backend. Use Student Bypass Mode to place test order?',
          type: 'warning',
          confirmText: 'Use Bypass Mode',
          cancelText: 'Cancel'
        });
        if (fallback) {
          return bypassPayment();
        } else {
          await showAlert({
            title: 'Payment failed',
            text: 'Payment failed to initialize',
            type: 'error'
          });
          return;
        }
      }

      const options = {
        key: 'rzp_test_dummykey123', // Student dummy fallback
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'ShopNest',
        description: 'Test Transaction',
        order_id: orderData.id,
        handler: async function (response) {
          const verifyRes = await fetch('/api/payment/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(response)
          });
          if (verifyRes.ok) {
            const saveOrderRes = await fetch('/api/orders', {
              method: 'POST',
              headers: { 
                'Content-Type': 'application/json',
                Authorization: `Bearer ${user.token}`
              },
              body: JSON.stringify({
                items: orderItems,
                totalAmount: totalPrice,
                address,
                paymentID: response.razorpay_payment_id
              })
            });

            if (saveOrderRes.ok) {
              dispatch(clearCart());
              navigate('/ordersuccess');
            } else {
              await showAlert({ title: 'Order failed', text: 'Order saving failed', type: 'error' });
            }
          } else {
            await showAlert({ title: 'Payment failed', text: 'Payment verification failed', type: 'error' });
          }
        },
        prefill: {
          name: address.fullName,
          email: user?.email,
          contact: '9999999999'
        },
        theme: {
          color: '#f97316'
        }
      };
      
      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error(error);
    }
  };

  const bypassPayment = async () => {
    const saveOrderRes = await fetch('/api/orders', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`
      },
      body: JSON.stringify({
        items: orderItems,
        totalAmount: totalPrice,
        address,
        paymentID: 'bypass_txn_' + Date.now()
      })
    });
    if (saveOrderRes.ok) {
      dispatch(clearCart());
      navigate('/ordersuccess');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      await showAlert({ title: 'Login required', text: 'Please login first', type: 'warning' });
      navigate('/login');
      return;
    }
    await saveAddressIfNeeded();
    handlePayment();
  };

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>
      <div className="checkout-content">
        <form onSubmit={handleSubmit} className="shipping-form">
          <h3>Shipping Address</h3>
          {savedAddresses.length > 0 && (
            <div className="saved-addresses">
              <select value={useNewAddress ? 'new' : selectedAddressId} onChange={(e) => e.target.value === 'new' ? startNewAddress() : selectSavedAddress(e.target.value)}>
                {savedAddresses.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.fullName} - {item.addressLine1}, {item.city}
                  </option>
                ))}
                <option value="new">Add new address</option>
              </select>
            </div>
          )}
          <input type="text" placeholder="Full Name" required value={address.fullName} onChange={(e) => setAddress({...address, fullName: e.target.value})} />
          <input type="text" placeholder="Address Line 1" required value={address.addressLine1} onChange={(e) => setAddress({...address, addressLine1: e.target.value})} />
          <input type="text" placeholder="Address Line 2 (Optional)" value={address.addressLine2 || ''} onChange={(e) => setAddress({...address, addressLine2: e.target.value})} />
          <input type="text" inputMode="numeric" pattern="[0-9]*" maxLength="6" placeholder="Postal Code" required value={address.postalCode} onChange={(e) => updatePostalCode(e.target.value)} />
          {cityLookupStatus && <span className="postal-lookup-status">{cityLookupStatus}</span>}
          <input type="text" placeholder="City" required value={address.city} onChange={(e) => setAddress({...address, city: e.target.value})} />
          <select required value={address.country} onChange={(e) => setAddress({...address, country: e.target.value})}>
            <option value="">Select Country</option>
            {countries.map((country) => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>
          {useNewAddress && (
            <label className="save-address-option">
              <input type="checkbox" checked={saveAddress} onChange={(e) => setSaveAddress(e.target.checked)} />
              Save this address for next time
            </label>
          )}
          <div className="checkout-summary">
            <h4>Total to Pay: ₹{totalPrice.toFixed(2)}</h4>
            <button type="submit" className="btn">Pay Now</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
