import React, { useState, useEffect } from "react";
import "./UpdateProduct.css";
import AdminNav from "./AdminNav";
import DashboardTop from "./DashboardTop";
import MetaData from "../components/Home/MetaData";
import { useNavigate, useParams } from "react-router-dom";
import { IoMdArrowBack } from "react-icons/io";
import { MdClose } from "react-icons/md";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { updateProduct, clearErrors } from "../actions/adminAction";
import { toast } from "react-toastify";
import { getProductDetails } from "../actions/productAction";
import "react-toastify/dist/ReactToastify.css";

const UpdateProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const { error, isUpdated, loading } = useSelector(
    (state) => state.updateProduct
  );
  const {
    products: product,
   
  } = useSelector((state) => state.productDetails);

  // State variables for form fields
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    subCategory: "",
    foodType: "",
    images: [],
  });

  // Destructure formData for ease of use
  const { name, description, price, category, subCategory, foodType, images } =
    formData;

  useEffect(() => {
    dispatch(getProductDetails(id));
  }, [dispatch, id]);

  useEffect(() => {
    console.log("this is product", product);
    if (product) {
      setFormData({
        name: product.name,
        description: product.description || "",
        price: product.price || "",
        category: product.category || "",
        subCategory: product.subCategory || "",
        foodType: product.foodType || "",
        images: product.images || [],
      });
    }
  }, [product]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
  }, [dispatch, error, isUpdated]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const removeImage = (index) => {
    const updatedImages = [...formData.images];
    updatedImages.splice(index, 1);
    setFormData({
      ...formData,
      images: updatedImages,
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length > 3) {
      alert("You can only select a maximum of 3 images");
      return;
    }

    setFormData({
      ...formData,
      images: files,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedFormData = new FormData();
    updatedFormData.append("name", name);
    updatedFormData.append("price", price);
    updatedFormData.append("category", category);
    updatedFormData.append("description", description);
    updatedFormData.append("subCategory", subCategory);
    updatedFormData.append("foodType", foodType);

    images.forEach((image) => {
      updatedFormData.append("images", image);
    });

    dispatch(updateProduct(id, updatedFormData));

    setTimeout(() => {
      toast.success("Product updated successfully");
      navigate("/admin/menu");
    }, 2000);
  };

  const categories = ["Indian", "Chinese", "Thai"];
  const subCategories = [
    "Veg Soup (Chinese)",
    "Non Veg Soup (Chinese)",
    "Dumplings",
    "Salads",
    "Veg Starter (Chinese)",
    "Non Veg Starter (Chinese)",
    "Sea Food Starter (Chinese)",
    "Chinese Rice",
    "Noodles",
    "Chinese Main Course (Gravy)",
    "Indian Soup & Shorba",
    "Veg Starter (Indian)",
    "Veg Starter (Tandoori)",
    "Tandoori (Non Veg)",
    "Indian Bread",
    "Indian Main Course (Veg)",
    "Indian Main Course (Non Veg)",
    "Basmati Ki Bahar",
    "Special Biryani",
    "Deserts",
    "Beverages",
    "Mocktails",
  ];

  const foodTypes = ["Veg", "Non Veg"];

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="dashboard-main">
      <MetaData title="Update Product - Admin" />
      <DashboardTop />
      <div className="dashboard">
        <div className="dashboard-left">
          <AdminNav />
        </div>
        <div className="dashboard-right">
          <div className="admin-product-details-1 bg-slate-50">
            <span title="Navigate up" onClick={handleBack}>
              <IoMdArrowBack size={20} />
            </span>
            <span>Update Product</span>
          </div>
          <div className="select-item-images">
            <div className="preview-item-images">
              {images.map((image, index) => (
                <div
                  key={index}
                  className="image-preview d-flex flex-col items-center"
                >
                  <img
                    src={image.url || URL.createObjectURL(image)}
                    alt={`Preview ${index + 1}`}
                    className="border"
                  />
                  <button
                    type="button"
                    className="text-danger"
                    title="Remove image"
                    onClick={() => removeImage(index)}
                  >
                    <MdClose size={20} />
                  </button>
                </div>
              ))}
            </div>
            <div className="file-input-wrapper d-flex items-center">
              <input
                type="file"
                name="images"
                accept="image/*"
                id="file-input"
                multiple
                onChange={handleImageChange}
              />
              <label htmlFor="file-input">
                <i className="bi bi-cloud-plus"></i>
              </label>
              <p>Choose Images (Max 3)</p>
            </div>
          </div>
          <form className="admin-product-form" onSubmit={handleSubmit}>
            <TextField
              id="productName"
              name="name"
              label="Product Name"
              variant="outlined"
              fullWidth
              margin="normal"
              value={name}
              onChange={handleChange}
              required
              className="form-item"
            />
            <TextField
              id="description"
              name="description"
              label="Description"
              variant="outlined"
              fullWidth
              margin="normal"
              value={description}
              onChange={handleChange}
              required
              className="form-item"
            />
            <TextField
              id="price"
              name="price"
              label="Price"
              variant="outlined"
              fullWidth
              margin="normal"
              value={price}
              onChange={handleChange}
              type="number"
              required
              className="form-item"
            />
            <FormControl
              variant="outlined"
              fullWidth
              margin="normal"
              className="form-item"
            >
              <InputLabel id="category-label">Cuisine</InputLabel>
              <Select
                labelId="category-label"
                id="category"
                name="category"
                value={category}
                onChange={handleChange}
                label="Category"
                required
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl
              variant="outlined"
              fullWidth
              margin="normal"
              className="form-item"
            >
              <InputLabel id="subCategory-label">Subcategory</InputLabel>
              <Select
                labelId="subCategory-label"
                id="subCategory"
                name="subCategory"
                value={subCategory}
                onChange={handleChange}
                label="Subcategory"
                required
              >
                {subCategories.map((subCategory) => (
                  <MenuItem key={subCategory} value={subCategory}>
                    {subCategory}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl
              variant="outlined"
              fullWidth
              margin="normal"
              className="form-item"
            >
              <InputLabel id="foodType-label">Food Type</InputLabel>
              <Select
                labelId="foodType-label"
                id="foodType"
                name="foodType"
                value={foodType}
                onChange={handleChange}
                label="Food Type"
                required
              >
                {foodTypes.map((foodType) => (
                  <MenuItem key={foodType} value={foodType}>
                    {foodType}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className="form-item"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Update Product"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateProduct;
