import React, { useState, useEffect } from "react";
import "./AdminMenu.css";
import AdminNav from "./AdminNav";
import DashboardTop from "./DashboardTop";
import { useSelector, useDispatch } from "react-redux";
import { getAdminProducts, clearErrors } from "../actions/productAction";
import { deleteProduct, updateStock } from "../actions/adminAction";
import { VscDiffAdded } from "react-icons/vsc";
import Loader from "../components/Layout/Loader";
import { IoMdMore } from "react-icons/io";
import { alpha, styled } from "@mui/material/styles";
import { pink } from "@mui/material/colors";
import Switch from "@mui/material/Switch";
import { Link } from "react-router-dom";
import MetaData from "../components/Home/MetaData";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { MdDelete } from "react-icons/md";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PinkSwitch = styled(Switch)(({ theme }) => ({
  "& .MuiSwitch-switchBase.Mui-checked": {
    color: pink[600],
    "&:hover": {
      backgroundColor: alpha(pink[600], theme.palette.action.hoverOpacity),
    },
  },
  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
    backgroundColor: pink[600],
  },
}));

const label = { inputProps: { "aria-label": "Color switch demo" } };

const AdminMenu = () => {
  const dispatch = useDispatch();
  const { products, productsCount, error, loading } = useSelector(
    (state) => state.adminProducts
  );
  const {
    loading: deleteLoading,
    isDeleted,
    error: deleteError,
  } = useSelector((state) => state.deleteProduct);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [subCategoryFilter, setSubCategoryFilter] = useState("");
  const [foodTypeFilter, setFoodTypeFilter] = useState("");
  const [open, setOpen] = useState(false);
  const [productIdToUpdate, setProductIdToUpdate] = useState(null);
  const [newStockStatus, setNewStockStatus] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [productIdToDelete, setProductIdToDelete] = useState(null);

  useEffect(() => {
    dispatch(getAdminProducts());

    if (error) {
      dispatch(clearErrors());
    }
    if (deleteError) {
      toast.error(deleteError);
      dispatch(clearErrors());
    }
    if (isDeleted) {
      toast.success("Product deleted successfully");
      dispatch(getAdminProducts());
    }
  }, [dispatch, error, deleteError, isDeleted]);

  const handleStockToggle = (productId, currentStockStatus) => {
    setProductIdToUpdate(productId);
    setNewStockStatus(!currentStockStatus);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setDeleteOpen(false);
  };

  const handleConfirm = () => {
    dispatch(updateStock(productIdToUpdate, newStockStatus))
      .then(() => {
        dispatch(getAdminProducts());
        toast.success("Stock status updated successfully");
      })
      .catch((err) => toast.error(err));
    setOpen(false);
  };

  const handleDeleteClick = (productId) => {
    setProductIdToDelete(productId);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = () => {
    dispatch(deleteProduct(productIdToDelete))
      .then(() => {
        dispatch(getAdminProducts());
        toast.success("Product deleted successfully");
      })
      .catch((err) => toast.error(err));
    setDeleteOpen(false);
  };

  const outOfStockCount = products?.filter(
    (product) => product.stock === false
  ).length;
  

  const filteredProducts = products?.filter((product) => {
    return (
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (categoryFilter === "" || product.category === categoryFilter) &&
      (subCategoryFilter === "" || product.subCategory === subCategoryFilter) &&
      (foodTypeFilter === "" || product.foodType === foodTypeFilter)
    );
  });

  const subCategoriesOptions = [
    ...new Set(products?.map((product) => product.subCategory)),
  ];

  return (
    <div className="dashboard-main">
      <MetaData title="Menu -Admin" />
      <DashboardTop />
      <div className="dashboard">
        <div className="dashboard-left">
          <AdminNav />
        </div>
        <div className="dashboard-right">
          {loading ? (
            <Loader />
          ) : (
            <div className="product-list-main">
              <div className="product-list-top">
                <div>
                  <p className="fs-3 fw-bold">{productsCount}</p>
                  <h5 className="text-slate-500">Items in your Menu</h5>
                </div>
                <div>
                  <p className="fs-3 fw-bold">{outOfStockCount}</p>
                  <h5 className="text-slate-500">Out of stock items</h5>
                </div>
                <Link
                  to="/admin/add/new-item"
                  className="add-new-link cursor-pointer"
                >
                  <p>
                    <VscDiffAdded size={35} />
                  </p>
                  <h5 className="text-slate-500">Add a new item</h5>
                </Link>
              </div>
              <div className="search-filter">
                <div className="filter ">
                  <div className="filter-by-category ">
                    <select
                      id="category-filter"
                      value={categoryFilter}
                      onChange={(e) => {
                        setCategoryFilter(e.target.value);
                        setSubCategoryFilter("");
                      }}
                    >
                      <option value="">Cuisine</option>
                      <option value="indian">Indian</option>
                      <option value="chinese">Chinese</option>
                      <option value="thai">Thai</option>
                    </select>
                  </div>

                  <div className="filter-by-subcategory">
                    <select
                      id="sub-category-filter"
                      value={subCategoryFilter}
                      onChange={(e) => setSubCategoryFilter(e.target.value)}
                    >
                      <option value="">Category</option>
                      {subCategoriesOptions.map((subCategory) => (
                        <option key={subCategory} value={subCategory}>
                          {subCategory}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="filter-by-food-type">
                    <select
                      id="food-type-filter"
                      value={foodTypeFilter}
                      onChange={(e) => setFoodTypeFilter(e.target.value)}
                    >
                      <option value="">All - Veg, Non-Veg</option>
                      <option value="Veg">Vegetarian</option>
                      <option value="Nonveg">Non-Vegetarian</option>
                    </select>
                  </div>
                </div>
                <div className="search">
                  <input
                    type="text"
                    placeholder="Search for an item"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              {filteredProducts?.length === 0 ? (
                <div className="no-items-found">
                  <span className="fs-1"> 😞</span>
                  <p className="fs-3">No items found.</p>
                </div>
              ) : (
                <ul className="product-list">
                  <li className="product-item-header">
                    <span className="w-1/12 text-center">Image</span>
                    <span className="w-3/4 text-center">Item name</span>
                    <span className="w-2/12 text-center">Price</span>
                    <span
                      className="w-2/12 text-center"
                      title="Switch off the toggle if item is not in stock"
                    >
                      Out of stock?
                    </span>
                    <span className="w-2/12 text-center">Action</span>
                  </li>
                  {filteredProducts?.map((product) => (
                    <li key={product._id} className="product-item">
                      <Link
                        to={`/admin/product-details/${product._id}`}
                        className="w-1/12 d-flex justify-center"
                      >
                        <img
                          src={product.images[0] && product.images[0].url}
                          alt={product.name}
                          className="product-image"
                        />
                      </Link>
                      <Link
                        to={`/admin/product-details/${product._id}`}
                        className="w-3/4 text-center"
                      >
                        {product.name}
                      </Link>
                      <Link
                        to={`/admin/product-details/${product._id}`}
                        className="w-2/12 text-center"
                      >
                        ₹{product.price}
                      </Link>
                      <span className="w-2/12 text-center ">
                        <PinkSwitch
                          {...label}
                          checked={product.stock}
                          onChange={() =>
                            handleStockToggle(product._id, product.stock)
                          }
                        />
                      </span>
                      <span
                        className="w-2/12 d-flex justify-center cursor-pointer"
                        title="Delete"
                        onClick={() => handleDeleteClick(product._id)}
                      >
                        <MdDelete />
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{"Confirm Stock Status Change"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to change the stock status of this product?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirm} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={deleteOpen} onClose={handleClose}>
        <DialogTitle>{"Confirm Product Deletion"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this product?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AdminMenu;
