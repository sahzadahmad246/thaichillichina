import React, { useState, useEffect } from "react";
import "./AddNewItem.css";
import AdminNav from "./AdminNav";
import DashboardTop from "./DashboardTop";
import MetaData from "../components/Home/MetaData";
import { useNavigate } from "react-router-dom";
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
import { addNewProduct, clearErrors } from "../actions/adminAction";
import { toast } from "react-toastify";
import { IoPricetag } from "react-icons/io5";
import { ADD_NEW_PRODUCT_RESET } from "../constants/adminConstant";
import "react-toastify/dist/ReactToastify.css";

const AddNewItem = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { error, success, loading } = useSelector((state) => state.newProduct);
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [foodType, setFoodType] = useState("");
  const [images, setImages] = useState([]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    if (success) {
      toast.success("Product added successfully");
      dispatch({ type: ADD_NEW_PRODUCT_RESET });
    }
  }, [dispatch, error, success, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case "productName":
        setProductName(value);
        break;
      case "description":
        setDescription(value);
        break;
      case "price":
        setPrice(value);
        break;
      case "category":
        setCategory(value);
        break;
      case "subCategory":
        setSubCategory(value);
        break;
      case "foodType":
        setFoodType(value);
        break;
      default:
        break;
    }
  };

  const removeImage = (index) => {
    const updatedImages = [...images];
    updatedImages.splice(index, 1);
    setImages(updatedImages);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length > 3) {
      alert("You can only select a maximum of 3 images");
      return;
    }

    setImages(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", productName);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("description", description);
    formData.append("subCategory", subCategory);
    formData.append("foodType", foodType);

    images.forEach((image) => {
      formData.append("images", image);
    });

    dispatch(addNewProduct(formData));
    setTimeout(() => {
      toast.success("Product updated successfully");
      navigate("/admin/menu");
    }, 6000);
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
      <MetaData title="Add a new item - Admin" />
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
            <span>Add a new Item</span>
            <span></span>
          </div>
          <div className="select-item-images">
            <div className="preview-item-images">
              {images.map((image, index) => (
                <div
                  key={index}
                  className="image-preview d-flex flex-col items-center"
                >
                  <img
                    src={URL.createObjectURL(image)}
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
              name="productName"
              label="Product Name"
              variant="outlined"
              fullWidth
              margin="normal"
              value={productName}
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
              {loading ? <CircularProgress size={24} /> : "Add Product"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddNewItem;
