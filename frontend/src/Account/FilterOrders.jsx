import React from "react";
import { CiFilter } from "react-icons/ci";
const FilterOrders = ({ filter, handleFilterChange }) => {
  return (
    <div className="filter-ordr-main">
      <h1>
        <span>Filters </span> <CiFilter size={25} />
      </h1>
      <div className="last-30-day">
        <label>
          <input
            type="checkbox"
            name="last30Days"
            checked={filter.last30Days}
            onChange={handleFilterChange}
          />
          <span className="p-2">Last 30 days</span>
        </label>
      </div>
      <div className="last-30-day">
        <select
          name="status"
          value={filter.status}
          onChange={handleFilterChange}
        >
          <option value="">Order Status</option>
          <option value="delivered">Delivered</option>
          <option value="preparing">Preparing</option>
        </select>
      </div>
      <div className="last-30-day">
        <select name="month" value={filter.month} onChange={handleFilterChange}>
          <option value="">By Months</option>
          <option value="1">January</option>
          <option value="2">February</option>
          <option value="3">March</option>
          <option value="4">April</option>
          <option value="5">May</option>
          <option value="6">June</option>
          <option value="7">July</option>
          <option value="8">August</option>
          <option value="9">September</option>
          <option value="10">October</option>
          <option value="11">November</option>
          <option value="12">December</option>
        </select>
      </div>
      <div className="last-30-day">
        <select name="year" value={filter.year} onChange={handleFilterChange}>
          <option value="">By Year</option>
          {[...Array(10)].map((_, i) => (
            <option key={i} value={new Date().getFullYear() - i}>
              {new Date().getFullYear() - i}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
export default FilterOrders;