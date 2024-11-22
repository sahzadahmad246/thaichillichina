import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { Star, Edit2, X, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from "react-hot-toast";
import {
  newReview,
  getProductDetails,
  clearErrors,
} from "../../actions/productAction";

const ReviewCard = ({ review, onEditReview }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(review.rating);
  const [comment, setComment] = useState(review.comment);
  const [reviewAlreadySubmitted, setReviewAlreadySubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const { user } = useSelector((state) => state.user);
  const { success, error: reviewError } = useSelector((state) => state.review);

  const CHAR_LIMIT = 75; // Reduced character limit as requested

  useEffect(() => {
    if (user && user._id === review.user) {
      setReviewAlreadySubmitted(true);
    }
  }, [review, user]);

  useEffect(() => {
    if (reviewError) {
      toast.error("Failed to submit review");
      setIsSubmitting(false);
    } else if (success) {
      setOpen(false);
      setIsExpanded(false);
      setIsSubmitting(false);
      dispatch(getProductDetails(id));
    }
  }, [reviewError, success, dispatch, id]);

  const handleEditReview = () => {
    setOpen(true);
  };

  const submitReview = () => {
    const reviewData = {
      productId: id,
      comment,
      rating,
    };
    setIsSubmitting(true);
    onEditReview(reviewData);
  };

  const formatDate = (dateString) => {
    return format(new Date(dateString), "MMMM d, yyyy");
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const renderComment = () => {
    if (review.comment.length <= CHAR_LIMIT) {
      return <p className="text-gray-700 text-sm sm:text-base p-0">{review.comment}</p>;
    }

    return (
      <>
        <p className="text-gray-700 text-sm sm:text-base p-0">
          {isExpanded ? review.comment : `${review.comment.slice(0, CHAR_LIMIT)}...`}
        </p>
        <button
          onClick={toggleExpand}
          className="text-blue-500 hover:text-blue-600 transition-colors text-sm mt-2 flex items-center"
        >
          {isExpanded ? (
            <>
              See Less <ChevronUp size={16} className="ml-1" />
            </>
          ) : (
            <>
              See More <ChevronDown size={16} className="ml-1" />
            </>
          )}
        </button>
      </>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg border p-3 sm:p-6 mb-4 sm:mb-6"
    >
      <div className="flex items-center mb-4">
        <img
          src={(review.avatar && review.avatar.url) || "/placeholder.svg"}
          alt={review.name}
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full mr-3 sm:mr-4"
        />
        <div>
          <div className="flex items-center">
            <h3 className="font-semibold text-base sm:text-lg mr-2">{review.name}</h3>
            {reviewAlreadySubmitted && (
              <span className="text-xs text-gray-500">(You)</span>
            )}
          </div>
          <p className="text-gray-500 text-xs sm:text-sm p-0">
            {formatDate(review.reviewDate)}
          </p>
        </div>
        {reviewAlreadySubmitted && (
          <button
            onClick={handleEditReview}
            className="ml-auto text-blue-500 hover:text-blue-600 transition-colors"
          >
            <Edit2 size={16} />
          </button>
        )}
      </div>
      <div className="flex mb-2">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            size={16}
            className={`${
              index < review.rating
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
      {renderComment()}

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
              <h2 className="text-xl font-semibold">Edit Review</h2>
              <button
                onClick={() => setOpen(false)}
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
                onClick={() => setOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors mr-2"
              >
                Cancel
              </button>
              <button
                onClick={submitReview}
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
    </motion.div>
  );
};

export default ReviewCard;

