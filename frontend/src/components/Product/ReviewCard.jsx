import React, { useEffect, useState } from "react";
import "./ReviewCard.css";
import profilePic from "../../images/lollipop.jpg";
import { useSelector, useDispatch } from "react-redux";
import Dialog from "@mui/material/Dialog";
import { useNavigate } from "react-router-dom";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { format } from "date-fns";
import { DialogTitle, Rating } from "@mui/material";
import {
  newReview,
  getProductDetails,
  clearErrors,
} from "../../actions/productAction";
import { useParams } from "react-router-dom";
import { toast } from "react-hot-toast";

const ReviewCard = ({ review, openEditReviewDialog }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviewAlreadySubmitted, setReviewAlreadySubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // New state for loading
  const { user } = useSelector((state) => state.user);
  const { success, error: reviewError } = useSelector((state) => state.review);
  const { product } = useSelector((state) => state.productDetails); // updated state key

  useEffect(() => {
    if (user && user._id === review.user) {
      setReviewAlreadySubmitted(true);
    }
  }, [review, user]);

  useEffect(() => {
    if (success) {
      dispatch(getProductDetails(id));
    }
  }, [dispatch, id, success]);

  useEffect(() => {
    if (reviewError) {
      toast.error("Failed to submit review");
      setIsSubmitting(false);
    } else if (success) {
      // toast.success("Review submitted");
      setComment("");
      setRating(0);
      setOpen(false);
      setIsSubmitting(false);
    }
  }, [reviewError, success]);

  const submitReviewToggle = () => {
    setOpen(!open);
  };

  const submitReview = () => {
    const reviewData = {
      productId: id,
      comment,
      rating,
    };
    setIsSubmitting(true); // Start loading
    dispatch(newReview(reviewData));
  };

  const handleEditReviewDialog = (review) => {
    openEditReviewDialog(review);
    setComment(review.comment);
    setRating(review.rating);
    setOpen(true);
  };

  const formatDate = (dateString) => {
    return format(new Date(dateString), "hh:mm a  dd-MMMM-yyyy");
  };

  return (
    <>
      <div className="reviewBlock-1">
        <img
          src={(review.avatar && review.avatar.url) || profilePic}
          alt="Profile"
        />
        <p>{review.name}</p>

        {reviewAlreadySubmitted ? (
          <>
            (You)
            <Button onClick={() => handleEditReviewDialog(review)}>Edit</Button>
            <Dialog
              aria-labelledby="simple-dialog-title"
              open={open}
              onClose={submitReviewToggle}
            >
              <DialogTitle>Submit Review</DialogTitle>
              <DialogContent className="submitDialog">
                <Rating
                  name="product-rating"
                  value={rating}
                  onChange={(event, newValue) => {
                    setRating(newValue);
                  }}
                />
                <textarea
                  className="submitDialogTextarea"
                  cols="50"
                  rows="10"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                ></textarea>
              </DialogContent>
              <DialogActions>
                <Button onClick={submitReviewToggle} color="secondary">
                  Cancel
                </Button>
                <Button onClick={submitReview} disabled={isSubmitting}>
                  {isSubmitting ? <CircularProgress size={24} /> : "Submit"}
                </Button>
              </DialogActions>
            </Dialog>
          </>
        ) : null}
        <br />
      </div>
      <div className="reviewBlock-2">
        <span>{formatDate(review?.reviewDate)}</span> <br />
        <Rating
          name="read-only-rating"
          value={review.rating}
          readOnly
          precision={0.5}
          size="small"
        />{" "}
        <br />
        <span className="comment">{review.comment}</span>
      </div>
    </>
  );
};

export default ReviewCard;
