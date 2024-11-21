import React from "react";
import "../HeaderCSS/Search.css";

const Search = () => {
  return (
    <>
      <div className="main-search">
        <div className="mobile-search-box ">
          <span class="material-symbols-outlined fs-1">search</span>
          <input type="text" placeholder="search here" />
        </div>
      </div>
    </>
  );
};

export default Search;
