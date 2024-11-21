import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../HeaderCSS/Search.css";
import { getProducts } from "../../actions/productAction";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../Layout/Loader";
import SearchResult from "./SearchResult";
import SearchSuggetion from "./SearchSuggetion";
import MetaData from "../Home/MetaData";

const Search = () => {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, products } = useSelector((state) => state.products);
  const [searchedProducts, setSearchedProducts] = useState([]);
  const [showSuggestion, setShowSuggestion] = useState(true);

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  useEffect(() => {
    if (keyword.trim()) {
      const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(keyword.toLowerCase())
      );
      setSearchedProducts(filteredProducts);
      setShowSuggestion(false);
    } else {
      setSearchedProducts([]);
      setShowSuggestion(true);
    }
  }, [keyword, products]);

  const getRandomProducts = (array, num) => {
    const shuffledArray = [...array];

    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [
        shuffledArray[j],
        shuffledArray[i],
      ];
    }

    return shuffledArray.slice(0, num);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/search?keyword=${keyword}`);
    } else {
      alert("Please enter a keyword to search.");
    }
  };

  return (
    <>
    <MetaData title="Search - Thai Chilli China"/>
      <div className="main-search">
        <form className="search-box" onSubmit={handleSearch}>
          <span className="material-symbols-outlined fs-2">search</span>
          <input
            type="text"
            placeholder="search here"
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
              setShowSuggestion(true); // Reset suggestion visibility on input change
            }}
          />
        </form>
        <div>
          {loading ? (
            <div className="loader-container">
              <Loader />
            </div>
          ) : (
            <div>
              {showSuggestion && (
                <>
                  {" "}
                  <p className="mt-3">Suggested product for</p>
                  {getRandomProducts(products, 5).map((product) => (
                    <SearchSuggetion key={product._id} product={product} />
                  ))}
                </>
              )}
              {searchedProducts.length > 0 ? (
                <>
                  {searchedProducts.map((product) => (
                    <SearchResult key={product._id} product={product} />
                  ))}
                </>
              ) : (
                <p className="mt-4 text-center">No product found</p>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Search;
