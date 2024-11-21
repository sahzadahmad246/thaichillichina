import React, { useState } from "react";
import Slider from "@mui/material/Slider";

const CustomAccordion = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="filter-accordion">
      <div className="filter-accordion-header" onClick={toggleAccordion}>
        <h3>{title}</h3>
        <span>{isOpen ? "▲" : "▼"}</span>
      </div>
      {isOpen && <div className="filter-accordion-content">{children}</div>}
    </div>
  );
};

const ProductFilters = ({
  foodTypeFilter,
  handleFoodTypeFilter,
  priceRange,
  handlePriceRangeChange,
  selectedSubCategory,
  handleSubCategoryFilterChange,
  subCategoryOptions,
  handleClearFilters,
}) => {
  return (
    <div>
      <CustomAccordion title="Filter Options">
        <div className="food-type-filter">
          <div className="filter-box">
            <button 
              onClick={() => handleFoodTypeFilter(null)}
              className={foodTypeFilter === null ? "active-type-all" : "food-type-btn"}
            >
              All
            </button>
            <button
              onClick={() => handleFoodTypeFilter("veg")}
              className={foodTypeFilter === "veg" ? "active-type-veg" : "food-type-btn"}
            >
              Veg
            </button>
            <button
              onClick={() => handleFoodTypeFilter("non-veg")}
              className={foodTypeFilter === "non-veg" ? "active-type" : "food-type-btn"}
            >
              Non-Veg
            </button>
          </div>
          <div className="price-filter filter-box">
            <p>Filter by price</p>
            <Slider
              value={priceRange}
              onChange={handlePriceRangeChange}
              valueLabelDisplay="auto"
              min={0}
              max={500}
              className="price-slider"
            />
          </div>
          <div className=" filter-box-3">
            <div className="subcategory-filter">
              <p>Categories</p>
              <select
                value={selectedSubCategory}
                onChange={handleSubCategoryFilterChange}
              >
                {subCategoryOptions.map((subCategory, index) => (
                  <option key={index} value={subCategory}>
                    {subCategory}
                  </option>
                ))}
              </select>
            </div>
            <button onClick={handleClearFilters} className="clear-filter">
              Clear Filters
            </button>
          </div>
        </div>
      </CustomAccordion>
    </div>
  );
};

export default ProductFilters;
