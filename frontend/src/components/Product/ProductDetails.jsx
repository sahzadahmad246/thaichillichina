import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { format } from "date-fns";
import { motion } from "framer-motion";
import vegIcon from '../../images/veg-icon.png'
import nonvegIcon from '../../images/non-veg-icon.png'
import { Star, ShoppingCart, Heart, Minus, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  getProductDetails,
  newReview,
  clearErrors,
} from "../../actions/productAction";
import { addItemsToCart } from "../../actions/cartAction";
import Loader from "../Layout/Loader";
import ReviewCard from "./ReviewCard";
import MetaData from "../Home/MetaData";
import ProductDetailsError from "./ProductDetailsError";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Rating from "@mui/material/Rating";

const ProductDetails = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [orderedProduct, setOrderedProduct] = useState(null);
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [editReview, setEditReview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { products, loading, error } = useSelector(
    (state) => state.productDetails
  );
  const { orders } = useSelector((state) => state.myOrders);
  const { success, error: reviewError } = useSelector((state) => state.review);

  const handleAddToCart = (e) => {
    e.preventDefault();
    dispatch(addItemsToCart(id, quantity));
    toast.success("Item added to cart");
  };

  useEffect(() => {
    if (reviewError) {
      toast.error(reviewError);
      dispatch(clearErrors());
    }
    dispatch(getProductDetails(id));
  }, [dispatch, id, reviewError, success]);

  const submitReviewToggle = () => {
    setOpen(!open);
  };

  const submitReview = () => {
    const reviewData = {
      productId: id,
      comment,
      rating,
    };
    setIsSubmitting(true);
    dispatch(newReview(reviewData));
  };

  useEffect(() => {
    if (reviewError) {
      toast.error("Failed to submit review");
      setIsSubmitting(false);
    } else if (success) {
      setComment("");
      setRating(0);
      setOpen(false);
      setIsSubmitting(false);
    }
  }, [reviewError, success]);

  const increaseQuantity = () => {
    if (quantity < 10) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const openEditReviewDialog = (review) => {
    setEditReview(review);
    setComment(review.comment);
    setRating(review.rating);
    setOpen(true);
  };

  useEffect(() => {
    if (orders) {
      const matchedOrder = orders.find((order) =>
        order.orderItems?.some((item) => item.product === id)
      );
      if (matchedOrder) {
        const matchedItem = matchedOrder.orderItems.find(
          (item) => item.product === id
        );
        setOrderedProduct({
          name: matchedItem.name,
          date: matchedOrder.createdAt,
        });
      }
    }
  }, [orders, id]);

  const formatDate = (dateString) => {
    return format(new Date(dateString), "hh:mm a  dd-MMMM-yyyy");
  };

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % (products?.images?.length || 1));
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + (products?.images?.length || 1)) % (products?.images?.length || 1));
  };

  return (
    <div className="bg-gray-100">
      <MetaData title={`${products && products.name} - Thai Chilli China`} />
      {loading ? (
        <Loader />
      ) : error ? (
        <ProductDetailsError error={error} />
      ) : (
        <div className="flex flex-col lg:flex-row">
          {/* Image Carousel */}
          <motion.div 
            className="w-full lg:w-1/2 h-[50vh] lg:h-[70vh] lg:sticky lg:top-0"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {products && products.images && (
              <div className="relative h-full">
                <img 
                  src={products.images[currentImageIndex].url} 
                  alt={products.name} 
                  className="w-full h-full object-cover lg:object-contain"
                />
                <button 
                  onClick={prevImage} 
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75 rounded-full p-1 lg:p-2 transition-all duration-300"
                >
                  <ChevronLeft className="w-4 h-4 lg:w-6 lg:h-6" />
                </button>
                <button 
                  onClick={nextImage} 
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75 rounded-full p-1 lg:p-2 transition-all duration-300"
                >
                  <ChevronRight className="w-4 h-4 lg:w-6 lg:h-6" />
                </button>
              </div>
            )}
          </motion.div>

          {/* Product Details and Reviews */}
          <motion.div 
            className="w-full lg:w-1/2 bg-white p-4 lg:p-12 overflow-y-auto"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h1 className="text-2xl lg:text-4xl font-bold mb-2 lg:mb-4">
              {products && products.name}
              {products && products.foodType && (
                <span className="ml-2">
                  <img 
                    src={products.foodType === "Veg" ? vegIcon : nonvegIcon} 
                    alt={products.foodType} 
                    className="inline-block w-4 h-4 lg:w-6 lg:h-6"
                  />
                </span>
              )}
            </h1>
            <p className="text-sm lg:text-xl text-gray-600 mb-3 lg:mb-6">{products && products.description}</p>
            <div className="flex items-center mb-3 lg:mb-6">
              <span className="text-xl lg:text-3xl font-bold mr-2 lg:mr-4">₹{products && products.price}</span>
              <span className={`px-2 py-1 rounded-full text-xs lg:text-sm font-semibold ${products && products.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {products && products.stock > 0 ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>
            <div className="flex items-center mb-3 lg:mb-6">
              <Rating
                name="read-only-rating"
                value={products && products.ratings}
                readOnly
                precision={0.5}
                size="small"
              />
              <span className="ml-2 text-xs lg:text-sm text-gray-600">({products && products.numOfReviews} reviews)</span>
            </div>
            <div className="flex items-center mb-3 lg:mb-6">
              <button 
                onClick={decreaseQuantity} 
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-1 px-2 lg:py-2 lg:px-4 rounded-l transition-colors duration-300"
              >
                <Minus className="w-3 h-3 lg:w-4 lg:h-4" />
              </button>
              <input 
                type="number" 
                value={quantity} 
                readOnly 
                className="w-10 lg:w-16 text-center   text-sm lg:text-base"
              />
              <button 
                onClick={increaseQuantity} 
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-1 px-2 lg:py-2 lg:px-4 rounded-r transition-colors duration-300"
              >
                <Plus className="w-3 h-3 lg:w-4 lg:h-4" />
              </button>
            </div>
            <div className="flex space-x-2 lg:space-x-4 mb-6 lg:mb-12">
              <motion.button 
                className={`flex-1 py-2 px-3 lg:py-3 lg:px-6 rounded-full text-sm lg:text-lg font-semibold transition duration-300 flex items-center justify-center ${
                  products && products.stock > 0
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-400 text-gray-200 cursor-not-allowed"
                }`}
                onClick={handleAddToCart}
                disabled={products && products.stock <= 0}
                whileHover={{ scale: products && products.stock > 0 ? 1.05 : 1 }}
                whileTap={{ scale: products && products.stock > 0 ? 0.95 : 1 }}
              >
                <ShoppingCart className="w-4 h-4 lg:w-5 lg:h-5 mr-1 lg:mr-2" />
                {products && products.stock > 0 ? "Add to Cart" : "Out of Stock"}
              </motion.button>
              <motion.button 
                className="flex-1 border-2 border-blue-600 text-blue-600 py-2 px-3 lg:py-3 lg:px-6 rounded-full text-sm lg:text-lg font-semibold hover:bg-blue-50 transition duration-300 flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Heart className="w-4 h-4 lg:w-5 lg:h-5 mr-1 lg:mr-2" />
                Favorite
              </motion.button>
            </div>

            {/* Reviews Section */}
            <div className="border-t pt-4 lg:pt-8">
              <h2 className="text-xl lg:text-3xl font-bold mb-3 lg:mb-6">Reviews</h2>
              {orderedProduct && (
                <div className="mb-3 lg:mb-6 p-2 lg:p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm lg:text-lg">
                    You ordered <strong>{orderedProduct.name}</strong> on{" "}
                    <strong>{formatDate(orderedProduct.date)}</strong>.
                  </p>
                  <Button 
                    onClick={submitReviewToggle} 
                    variant="contained" 
                    color="primary" 
                    size="small"
                    className="mt-2"
                  >
                    Rate your experience
                  </Button>
                </div>
              )}
              <Dialog
                open={open}
                onClose={submitReviewToggle}
                aria-labelledby="review-dialog-title"
                maxWidth="sm"
                fullWidth
              >
                <DialogTitle id="review-dialog-title">Submit Review</DialogTitle>
                <DialogContent>
                  <div className="flex flex-col items-center">
                    <Rating
                      name="product-rating"
                      value={rating}
                      onChange={(event, newValue) => {
                        setRating(newValue);
                      }}
                      size="large"
                      className="mb-4"
                    />
                    <textarea
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows="5"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Write your review here..."
                    ></textarea>
                  </div>
                </DialogContent>
                <DialogActions>
                  <Button onClick={submitReviewToggle} color="secondary">
                    Cancel
                  </Button>
                  <Button onClick={submitReview} color="primary" disabled={isSubmitting}>
                    {isSubmitting ? <CircularProgress size={24} /> : "Submit"}
                  </Button>
                </DialogActions>
              </Dialog>
              {products && products.reviews && products.reviews.length > 0 ? (
                <div className="space-y-3 lg:space-y-6">
                  {products.reviews.map((review) => (
                    <ReviewCard
                      key={review._id}
                      review={review}
                      openEditReviewDialog={openEditReviewDialog}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-sm lg:text-xl text-gray-600">No Reviews Yet</p>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;

