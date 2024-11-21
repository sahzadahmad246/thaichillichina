import React, { useState, useEffect } from "react";
import "./AdminProductDetails.css";
import AdminNav from "./AdminNav";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import DashboardTop from "./DashboardTop";
import { IoMdArrowBack } from "react-icons/io";
import { FiEdit } from "react-icons/fi";
import { getProductDetails, clearErrors } from "../actions/productAction";
import { Carousel } from "react-bootstrap";
import { FaBox, FaRegUser } from "react-icons/fa";
import { CiMoneyBill } from "react-icons/ci";
import { BiDish, BiCategory } from "react-icons/bi";
import {
  MdOutlineStarPurple500,
  MdOutlineDescription,
  MdOutlineFoodBank,
  MdNumbers,
} from "react-icons/md";
import Loader from "../components/Layout/Loader";
import { format } from "date-fns";
import { Rating } from "@mui/material";
import { toast } from "react-toastify";

const AdminProductDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const {
    products: product,
    loading,
    error,
  } = useSelector((state) => state.productDetails);
 
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    dispatch(getProductDetails(id));
  }, [dispatch, id, error]);

  const handleBack = () => {
    navigate(-1);
  };

  const formatDate = (dateString) => {
    try {
      if (!dateString) return "";
      const date = new Date(dateString);
      return format(date, " dd-MMMM-yyyy");
    } catch (error) {
      console.error("Error formatting date:", error);
      return "";
    }
  };

  return (
    <div className="dashboard-main">
      <DashboardTop />
      <div className="dashboard">
        <div className="dashboard-left">
          <AdminNav />
        </div>
        <div className="dashboard-right">
          {loading ? (
            <Loader />
          ) : (
            <>
              <div className="admin-product-details-1 bg-slate-50">
                <span title="Navigate up" onClick={handleBack}>
                  <IoMdArrowBack size={20} />
                </span>
                <span>{product?.name}</span>
                <Link title="Edit" to={`/admin/edit-item/${product?._id}`}>
                  <FiEdit size={20} />
                </Link>
              </div>
              <div className="admin-product-details-2">
                <div className="admin-product-details-2-left ">
                  <Carousel>
                    {product &&
                      product.images &&
                      product.images.map((image, index) => (
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
                <div className="admin-product-details-2-right">
                  <div className="product-detail-right-item">
                    <span className="bg-slate-200 p-2 rounded-full">
                      <FaBox size={25} />
                    </span>
                    <span className="d-flex flex-col ps-3  justify-center">
                      <span className="text-slate-500">Item id</span>
                      <span className=" fs-6">{product?._id}</span>
                    </span>
                  </div>
                  <div className="product-detail-right-item">
                    <span className="bg-slate-200 p-2 rounded-full">
                      <CiMoneyBill size={25} />
                    </span>
                    <span className="d-flex flex-col ps-3  justify-center">
                      <span className="text-slate-500">Price</span>
                      <span className=" fs-6">₹{product?.price}</span>
                    </span>
                  </div>
                  <div className="product-detail-right-item">
                    <span className="bg-slate-200 p-2 rounded-full">
                      <BiDish size={25} />
                    </span>
                    <span className="d-flex flex-col ps-3  justify-center">
                      <span className="text-slate-500">Cuisine</span>
                      <span className=" fs-6">{product?.category}</span>
                    </span>
                  </div>
                  <div className="product-detail-right-item">
                    <span className="bg-slate-200 p-2 rounded-full">
                      <BiCategory size={25} />
                    </span>
                    <span className="d-flex flex-col ps-3  justify-center">
                      <span className="text-slate-500">Category</span>
                      <span className=" fs-6">{product?.subCategory}</span>
                    </span>
                  </div>
                  <div className="product-detail-right-item">
                    <span className="bg-slate-200 p-2 rounded-full">
                      <FaRegUser size={25} />
                    </span>
                    <span className="d-flex flex-col ps-3  justify-center">
                      <span className="text-slate-500">Added by</span>
                      <span className=" fs-6">
                        {formatDate(product?.createdAt)}
                      </span>
                    </span>
                  </div>
                  <div className="product-detail-right-item">
                    <span className="bg-slate-200 p-2 rounded-full">
                      <MdOutlineStarPurple500 size={25} />
                    </span>
                    <span className="d-flex flex-col ps-3  justify-center">
                      <span className="text-slate-500">Ratings</span>
                      <span className=" fs-6 d-flex items-center">
                        <Rating
                          name="read-only-rating"
                          value={product && product.ratings}
                          readOnly
                          precision={0.5}
                          size="small"
                        />
                        ({product?.ratings} Star)
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="admin-product-details-3">
                <div className="admin-product-details-3-left">
                  <div className="d-flex items-center">
                    <span className="bg-slate-200 p-2 rounded-full">
                      <MdOutlineDescription size={25} />
                    </span>
                    <span className="d-flex flex-col ps-3  justify-center">
                      <span className="text-slate-500">Item Description</span>
                      <span className=" fs-6">{product?.description}</span>
                    </span>
                  </div>
                </div>
                <div className="admin-product-details-3-right  d-flex justify-around">
                  <div className="w-5/12  d-flex items-center  p-2">
                    <span className="bg-slate-200 p-2 rounded-full">
                      <MdOutlineFoodBank size={25} />
                    </span>
                    <span className="d-flex flex-col ps-3  justify-center">
                      <span className="text-slate-500">Food type</span>
                      <span className=" fs-6">{product?.foodType}</span>
                    </span>
                  </div>
                  <div className="w-5/12  d-flex items-center  p-2">
                    <span className="bg-slate-200 p-2 rounded-full">
                      <MdNumbers size={25} />
                    </span>
                    <span className="d-flex flex-col ps-3  justify-center">
                      <span className="text-slate-500">Number of reviews</span>
                      <span className=" fs-6">{product?.numOfReviews}</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="admin-product-details-4">
                {product && product.reviews && product.reviews.length > 0 ? (
                  product.reviews.map((review, index) => (
                    <div key={index} className="review-item">
                      <span className="d-flex items-center justify-start">
                        <img
                          className="w-10 h-10 object-cover rounded-full "
                          src={review.avatar && review.avatar.url}
                          alt="avatar"
                        />
                        <div className="d-flex flex-col">
                          <span className="review-author ps-2">
                            {review.name}
                          </span>
                          <span className="review-date ps-2">
                            {formatDate(review.reviewDate)}
                          </span>
                        </div>
                      </span>

                      <span className="d-flex items-center justify-center w-3/6 ms-4 mt-2 flex-col">
                        <span className="review-author ps-4">
                          <Rating
                            name="read-only-rating"
                            value={review.rating}
                            readOnly
                            precision={0.5}
                            size="small"
                          />
                        </span>
                      </span>
                      <span>{review.comment}</span>
                    </div>
                  ))
                ) : (
                  <p>No reviews available.</p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProductDetails;
