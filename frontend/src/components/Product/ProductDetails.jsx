import React, { useEffect, useState } from "react";
import "./ProductDetails.css";
import { Carousel } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import {
  getProductDetails,
  newReview,
  clearErrors,
} from "../../actions/productAction";
import { useParams } from "react-router-dom";
import Loader from "../Layout/Loader";
import ReviewCard from "./ReviewCard";
import MetaData from "../Home/MetaData";
import vegIcon from "../../images/veg-icon.png";
import nonVegIcon from "../../images/non-veg-icon.png";
import { addItemsToCart } from "../../actions/cartAction";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { format } from "date-fns";
import { DialogTitle, Rating } from "@mui/material";
import ProductDetailsError from "./ProductDetailsError";

const ProductDetails = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const [foodTypeIcon, setFoodTypeIcon] = useState();
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

  useEffect(() => {
    if (products && products.foodType === "Non Veg") {
      setFoodTypeIcon(nonVegIcon);
    } else if (products && products.foodType === "Veg") {
      setFoodTypeIcon(vegIcon);
    } else {
      setFoodTypeIcon(null);
    }
  }, [products]);

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

  return (
    <div className="product-details">
      <MetaData title={`${products && products.name} - Thai Chilli China`} />
      {loading ? (
        <Loader />
      ) : error ? (
        <ProductDetailsError error={error} /> // Render the error component if there's an error
      ) : (
        <>
          <div className="product-details-left">
            <Carousel>
              {products &&
                products.images &&
                products.images.map((image, index) => (
                  <Carousel.Item key={index}>
                    <img
                      className="slider-images"
                      src={image.url}
                      alt={`Slide ${index + 1}`}
                    />
                  </Carousel.Item>
                ))}
            </Carousel>
          </div>
          <div className="product-details-right">
            <div className="details-block-2">
              <h1>
                {products && products.name}
                <span className="food-type-icon">
                  <img src={foodTypeIcon} alt="Food Type" />
                </span>
              </h1>
              <span>{products && products.description}</span> <br />
              <span
                className={
                  products && products.stock < 1
                    ? "text-danger"
                    : "text-success"
                }
              >
                {products && products.stock < 1 ? "Out of Stock" : "In Stock"}
              </span>
            </div>
            <div className="details-block-1">
              <h1>{products && `₹ ${products.price}`}</h1>
              <div className="product-rating">
                <Rating
                  name="read-only-rating"
                  value={products && products.ratings}
                  readOnly
                  precision={0.5}
                  size="small"
                />{" "}
                <span>{products && products.numOfReviews} Reviews</span>
              </div>
            </div>

            <div className="details-block-3">
              <div className="details-block-3-1">
                <button onClick={decreaseQuantity}>-</button>
                <input
                  readOnly
                  className="text-center"
                  value={quantity}
                  type="number"
                />
                <button onClick={increaseQuantity}>+</button>
              </div>

              {products && products.stock > 0 ? (
                <button
                  className="bg-danger text-light"
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </button>
              ) : (
                <button className=" bg-danger text-light" disabled>
                  Out of Stock
                </button>
              )}
              <button className="border border-danger text-danger">
                Favorite
              </button>
            </div>
            <div className="details-block-4">
              <h2>Reviews</h2>
              {orderedProduct && (
                <div>
                  You ordered <strong>{orderedProduct.name}</strong> on{" "}
                  <strong>{formatDate(orderedProduct.date)}</strong>.{" "}
                  <Button onClick={submitReviewToggle}>Rate</Button> your
                  experience!
                </div>
              )}
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
              {products && products.reviews[0] ? (
                <div className="reviews">
                  {products.reviews.map((review) => (
                    <ReviewCard
                      key={review._id}
                      review={review}
                      openEditReviewDialog={openEditReviewDialog}
                    />
                  ))}
                </div>
              ) : (
                <p className="no-reviews">No Reviews Yet</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductDetails;
