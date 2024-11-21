import React, { useEffect } from 'react';
import './QuickCart.css';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loadCartItems } from '../../actions/cartAction';
import { IoIosClose } from "react-icons/io";

const QuickCart = () => {
    const { cartItems } = useSelector((state) => state.cart);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Load cart items from localStorage on component mount
    useEffect(() => {
        dispatch(loadCartItems());
    }, [dispatch]);

    // Handle view cart
    const handleViewCart = () => {
        navigate('/cart');
    };

    // Handle remove all items
    const handleRemoveAllItems = () => {
        // Clear localStorage
        localStorage.removeItem('cartItems');

        // Dispatch action to update Redux store
        dispatch(loadCartItems());
    };

    // Return early if no items
    if (cartItems.length === 0) {
        return <div className='main-q-cart'>No items in the cart</div>;
    }

    // Get the first item
    const firstItem = cartItems[0];

    return (
        <div className='main-q-cart rounded-lg'>
            <div className='d-flex items-center'>
                <img className='px-2' src={firstItem.image.url} alt={firstItem.name} />
                <span>{firstItem.name} {cartItems.length > 1 ? "& more" : null}</span>
            </div>
            <div className='d-flex'>
                <button className='bg-red-600 text-white px-2 mx-2 rounded-lg' onClick={handleViewCart}>
                    View Cart
                </button>
                <button className="bg-gray-100 rounded-full p-1 mx-1" onClick={handleRemoveAllItems}>
                    <IoIosClose size={20} />
                </button>
            </div>
        </div>
    );
};

export default QuickCart;
