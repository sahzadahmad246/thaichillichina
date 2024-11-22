import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { format } from "date-fns";
import { motion } from "framer-motion";
import vegIcon from "../../images/veg-icon.png";
import nonvegIcon from "../../images/non-veg-icon.png";
import {
  Star,
  ShoppingCart,
  Heart,
  Minus,
  Plus,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
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

const ProductDetails = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [orderedProduct, setOrderedProduct] = useState(null);
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
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

  const submitReview = (reviewData) => {
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
    setCurrentImageIndex(
      (prevIndex) => (prevIndex + 1) % (products?.images?.length || 1)
    );
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prevIndex) =>
        (prevIndex - 1 + (products?.images?.length || 1)) %
        (products?.images?.length || 1)
    );
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
            <p className="text-sm lg:text-xl text-gray-600 mb-3 lg:mb-6">
              {products && products.description}
            </p>
            <div className="flex items-center mb-3 lg:mb-6">
              <span className="text-xl lg:text-3xl font-bold mr-2 lg:mr-4">
                ₹{products && products.price}
              </span>
              <span
                className={`px-2 py-1 rounded-full text-xs lg:text-sm font-semibold ${
                  products && products.stock > 0
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {products && products.stock > 0 ? "In Stock" : "Out of Stock"}
              </span>
            </div>
            <div className="flex items-center mb-3 lg:mb-6">
              <div className="flex">
                {[...Array(5)].map((_, index) => (
                  <Star
                    key={index}
                    size={20}
                    className={`${
                      index < (products && products.ratings)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="ml-2 text-xs lg:text-sm text-gray-600">
                ({products && products.numOfReviews} reviews)
              </span>
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
                className="w-10 lg:w-16 text-center border-t border-b border-gray-200 text-sm lg:text-base"
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
                whileHover={{
                  scale: products && products.stock > 0 ? 1.05 : 1,
                }}
                whileTap={{ scale: products && products.stock > 0 ? 0.95 : 1 }}
              >
                <ShoppingCart className="w-4 h-4 lg:w-5 lg:h-5 mr-1 lg:mr-2" />
                {products && products.stock > 0
                  ? "Add to Cart"
                  : "Out of Stock"}
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
              <h2 className="text-xl lg:text-3xl font-bold mb-3 lg:mb-6">
                Reviews
              </h2>
              {orderedProduct && (
                <div className="mb-3 lg:mb-6 p-2 lg:p-4 bg-blue-50 rounded-lg flex flex-row items-center justify-between border">
                  <div className="text-xs sm:text-sm lg:text-base">
                    <p className="text-sm ">
                      You ordered{" "}
                      <span className="text-gray ">
                        {orderedProduct.name}
                      </span>{" "}
                      on{" "}
                      <span className="">
                        {formatDate(orderedProduct.date)}
                      </span>
                    </p>
                  </div>
                  <button
                    onClick={submitReviewToggle}
                    className="ml-2 px-2 py-1 lg:px-4 lg:py-2 bg-blue-500 text-white text-xs sm:text-sm lg:text-base font-medium rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  >
                    Rate
                  </button>
                </div>
              )}

              {open && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                >
                  <div className="bg-white rounded-lg p-6 w-full max-w-md">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-semibold">Submit Review</h2>
                      <button
                        onClick={submitReviewToggle}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X size={24} />
                      </button>
                    </div>
                    <div className="mb-4">
                      <div className="flex mb-2">
                        {[...Array(5)].map((_, index) => (
                          <Star
                            key={index}
                            size={24}
                            className={`cursor-pointer ${
                              index < rating
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-300"
                            }`}
                            onClick={() => setRating(index + 1)}
                          />
                        ))}
                      </div>
                      <textarea
                        className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows="4"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Write your review here..."
                      ></textarea>
                    </div>
                    <div className="flex justify-end">
                      <button
                        onClick={submitReviewToggle}
                        className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors mr-2"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() =>
                          submitReview({ productId: id, comment, rating })
                        }
                        disabled={isSubmitting}
                        className={`px-4 py-2 text-sm font-medium bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors ${
                          isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        {isSubmitting ? "Submitting..." : "Submit"}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {products && products.reviews && products.reviews.length > 0 ? (
                <div className="space-y-3 lg:space-y-6 ">
                  {products.reviews.map((review) => (
                    <ReviewCard
                      key={review._id}
                      review={review}
                      onEditReview={submitReview}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-sm lg:text-xl text-gray-600 border flex justify-center bg-blue-50 rounded-lg p-3">
                  No Reviews Yet
                </p>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
