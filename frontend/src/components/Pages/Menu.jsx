import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProducts, clearErrors } from "../../actions/productAction";
import Product from "../../components/Product/Product";
import Loader from "../../components/Layout/Loader";
import MetaData from "../../components/Home/MetaData";
import { CiFilter } from "react-icons/ci";
import { IconButton } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { useLocation } from "react-router-dom";
import "./Menu.css";

const Menu = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { products, loading, error } = useSelector((state) => state.products);

  const [filters, setFilters] = useState({
    category: "",
    subCategory: "",
    foodType: "",
    priceRange: "",
  });

  useEffect(() => {
    // Extract subCategory from the URL query parameters
    const queryParams = new URLSearchParams(location.search);
    const subCategoryFromQuery = queryParams.get("subCategory");

    if (subCategoryFromQuery) {
      setFilters((prevFilters) => ({
        ...prevFilters,
        subCategory: decodeURIComponent(subCategoryFromQuery),
      }));
    }

    dispatch(getProducts());
    if (error) {
      dispatch(clearErrors());
    }
  }, [dispatch, error, location.search]);

  const clearAllFilters = () => {
    setFilters({
      category: "",
      subCategory: "",
      foodType: "",
      priceRange: "",
    });
  };

  const applyFilter = (filterName, value) => {
    setFilters({
      ...filters,
      [filterName]: value,
    });
  };

  const getUniqueValues = (products, key) => {
    return [...new Set(products.map((product) => product[key]))];
  };

  const priceRanges = [
    { label: "100-500", value: [100, 500] },
    { label: "500-1000", value: [500, 1000] },
    { label: "1000-2000", value: [1000, 2000] },
    { label: "2000+", value: [2000, Infinity] },
  ];

  const filteredProducts = products.filter((product) => {
    if (filters.category && product.category !== filters.category) return false;
    if (filters.subCategory && product.subCategory !== filters.subCategory)
      return false;
    if (filters.foodType && product.foodType !== filters.foodType) return false;
    if (filters.priceRange) {
      const [min, max] = filters.priceRange;
      if (product.price < min || product.price > max) return false;
    }
    return true;
  });

  const categories = getUniqueValues(products, "category");
  const subCategories = getUniqueValues(products, "subCategory");
  const foodTypes = getUniqueValues(products, "foodType");

  return (
    <>
      <MetaData title="Menu - Thai Chilli China" />
      <div className="menu-main">
        <div className="menu-left">
          <div className="filter-section">
            <h3>
              <span>Filter Options</span>
              {Object.keys(filters).some((key) => filters[key]) && (
                <IconButton
                  onClick={clearAllFilters}
                  className="text-danger"
                  title="Clear filter"
                >
                  <ClearIcon />
                </IconButton>
              )}
            </h3>
            <div className="filter-options">
              <div className="filter-type">
                <select
                  value={filters.category}
                  onChange={(e) => applyFilter("category", e.target.value)}
                >
                  <option value="" className="bg-white">
                    Cuisine
                  </option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-type">
                <select
                  value={filters.foodType}
                  onChange={(e) => applyFilter("foodType", e.target.value)}
                >
                  <option value="" className="bg-white">
                    Food Type
                  </option>
                  {foodTypes.map((foodType) => (
                    <option key={foodType} value={foodType}>
                      {foodType}
                    </option>
                  ))}
                </select>
              </div>
              <div className="filter-type">
                <select
                  value={filters.priceRange}
                  onChange={(e) =>
                    applyFilter("priceRange", JSON.parse(e.target.value))
                  }
                >
                  <option value="" className="bg-white">
                    Price range
                  </option>
                  {priceRanges.map((range) => (
                    <option
                      key={range.label}
                      value={JSON.stringify(range.value)}
                    >
                      {range.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="filter-type">
                <select
                  className=""
                  value={filters.subCategory}
                  onChange={(e) => applyFilter("subCategory", e.target.value)}
                >
                  <option value="">Category</option>
                  {subCategories.map((subCategory) => (
                    <option key={subCategory} value={subCategory}>
                      {subCategory}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
        {loading ? (
          <Loader />
        ) : (
          <div className="menu-right">
            <div className="menu-item">
              {filteredProducts.map((product) => (
                <Product key={product._id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Menu;
