import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import homeBanner from "../../images/homeBanner.png";
import vegIcon from "../../images/veg-icon.png";
import nonVegIcon from "../../images/non-veg-icon.png";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../Layout/Loader";
import { toast } from "react-hot-toast";
import { clearErrors, getProducts } from "../../actions/productAction";
import { getOutletInfo } from "../../actions/adminAction";
import { addItemsToCart } from "../../actions/cartAction";
import QuickCart from "./QuickCart";
import MetaData from "../Home/MetaData";
import LocationPicker from "../User/LocationPicker";
import { CiLocationArrow1, CiUnlock, CiLock } from "react-icons/ci";
import { haversineDistance } from "../User/haversineDistance";
import LastOrderProducts from "../Home/LastOrderProducts";
import LiveOrder from "./../../Account/Liveorder";
import Footer from "./Footer";
const Home = () => {
  const dispatch = useDispatch();
  const isMobile = window.matchMedia("(max-width: 768px)").matches;

  const { outlet } = useSelector((state) => state.getOutletInfo);
  const { cartItems } = useSelector((state) => state.cart);
  const { products, loading, error } = useSelector((state) => state.products);
  const { orders } = useSelector((state) => state.myOrders);
  const { isAuthenticated } = useSelector((state) => state.user);
  const { location, address } = useSelector((state) => state.location);
  const [timeLeft, setTimeLeft] = useState(null);
  const [isOvertime, setIsOvertime] = useState(false);
  const [subCategories, setSubCategories] = useState([]);
  const [randomProducts, setRandomProducts] = useState([]);
  const [deliveryAvailable, setDeliveryAvailable] = useState(true);
  const [showLiveOrder, setShowLiveOrder] = useState(false);
  const [groupedProducts, setGroupedProducts] = useState({});
  console.log(outlet);
  const liveOrders = orders
    ? orders.filter(
        (order) =>
          order.orderStatus !== "Delivered" &&
          order.orderStatus !== "cancelled" &&
          order.orderStatus !== "Rejected"
      )
    : [];

  useEffect(() => {
    dispatch(getOutletInfo(outlet._id));
    dispatch(getProducts());
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
  }, [dispatch, outlet._id, error]);
console.log(outlet)
  useEffect(() => {
    if (products) {
      const subCategoryMap = {};
      products.forEach((product) => {
        if (!subCategoryMap[product.subCategory]) {
          subCategoryMap[product.subCategory] = product;
        }
      });

      const uniqueSubCategories = Object.keys(subCategoryMap).map(
        (subCategory) => ({
          name: subCategory,
          imageUrl: subCategoryMap[subCategory].images[0]?.url || homeBanner,
        })
      );

      const shuffledSubCategories = uniqueSubCategories.sort(
        () => 0.5 - Math.random()
      );
      setSubCategories(shuffledSubCategories.slice(0, 5));

      const shuffledProducts = [...products].sort(() => 0.5 - Math.random());
      setRandomProducts(shuffledProducts.slice(0, 15));

      const grouped = products.reduce((acc, product) => {
        if (!acc[product.subCategory]) {
          acc[product.subCategory] = [];
        }
        acc[product.subCategory].push(product);
        return acc;
      }, {});
      setGroupedProducts(grouped);
    }
  }, [products]);

  useEffect(() => {
    if (location && outlet) {
      const userLocation = {
        lat: location.lat,
        lng: location.lng,
      };

      const outletLocation = {
        lat: outlet.location?.coordinates[1],
        lng: outlet.location?.coordinates[0],
      };

      const distance = haversineDistance(userLocation, outletLocation);
      setDeliveryAvailable(distance <= 6);
    }
  }, [location, outlet]);

  useEffect(() => {
    setShowLiveOrder(true);
  }, []);

  const handleAddToCart = (productId) => {
    dispatch(addItemsToCart(productId, 1));
    toast.success("Item added to cart");
  };

  const handleNavigate = () => {
    if (outlet.location && outlet.location.coordinates) {
      const [lng, lat] = outlet.location.coordinates;
      const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
      window.open(googleMapsUrl, "_blank");
    } else {
      toast.error("Outlet location not available.");
    }
  };

  useEffect(() => {
    const calculateTimeLeft = () => {
      if (outlet && outlet.outletStatus !== "Closed") {
        const now = new Date();
        const closeTime = new Date(now.toDateString() + " " + outlet.closeTime);
        const difference = closeTime - now;

        if (difference > 0 && difference <= 30 * 60 * 1000) {
          // 30 minutes in milliseconds
          const minutes = Math.floor((difference / 1000 / 60) % 60);
          setTimeLeft(minutes);
          setIsOvertime(false);
        } else if (difference <= 0) {
          setTimeLeft(null);
          setIsOvertime(true);
        } else {
          setTimeLeft(null);
          setIsOvertime(false);
        }
      }
    };

    const timer = setInterval(calculateTimeLeft, 60000); // Update every minute

    calculateTimeLeft(); // Initial calculation

    return () => clearInterval(timer);
  }, [outlet]);

  if (loading) {
    return (
      <div className="loader-container">
        <Loader />
      </div>
    );
  }

  return (
    <div className="pb-20">
      <MetaData title="Thai Chilli China" />

      <div className="mobile-top">
        {address && (
          <div className="location-status">
            <div className="quick-location">
              <span className="p-2 m-2 bg-gray-200 rounded-full">
                <CiLocationArrow1 />
              </span>
              <span>
                {address.neighborhood || "Unknown locality"},{" "}
                {address.city || "Unknown city"}
              </span>
            </div>
            <div
              className={`outlet-status p-2 m-2 ${
                outlet.outletStatus === "Closed"
                  ? "text-danger"
                  : "text-success"
              }`}
            >
              {outlet.outletStatus === "Closed" ? (
                <span className="d-flex items-center">
                  <CiLock size={25} /> Closed
                </span>
              ) : (
                <span className="d-flex items-center">
                  <CiUnlock size={25} /> Open
                </span>
              )}
            </div>
          </div>
        )}
        <div className="mobile-search">
          {isMobile && (
            <Link to="/search" className="search-box w-full">
              <span className="material-symbols-outlined fs-2">search</span>
              <input type="text" placeholder="search here" />
            </Link>
          )}
        </div>
      </div>

      <div className="quick-cart">
        {!deliveryAvailable && (
          <div className="delivery-status rounded-lg">
            <span className="text-danger">
              Delivery not available for your location.
            </span>
            <button
              className="bg-success text-white px-2 py-1 rounded-lg"
              onClick={handleNavigate}
            >
              Navigate us
            </button>
          </div>
        )}
        {cartItems.length > 0 && <QuickCart />}
      </div>

      <div className="bg-gray-100 p-4 mb-4 rounded-lg shadow-sm">
        {outlet.outletStatus === "Closed" ? (
          <div className="flex items-center justify-center text-red-600">
            <CiLock className="mr-2 text-2xl" />
            <span className="font-semibold">
              Restaurant is currently closed
            </span>
          </div>
        ) : isOvertime ? (
          <div className="flex items-center justify-center text-purple-600">
            <CiUnlock className="mr-2 text-2xl" />
            <span className="font-semibold">We're serving overtime!</span>
          </div>
        ) : timeLeft ? (
          <div className="flex items-center justify-center text-yellow-600">
            <CiUnlock className="mr-2 text-2xl" />
            <span className="font-semibold">
              Restaurant is closing in {timeLeft} minutes
            </span>
          </div>
        ) : (
          <div className="flex items-center justify-center text-green-600">
            <CiUnlock className="mr-2 text-2xl" />
            <span className="font-semibold">Restaurant is open</span>
          </div>
        )}
        <div className="text-center text-sm mt-2">
          <span className="font-medium">Open: {outlet.openTime}</span>
          <span className="mx-2">|</span>
          <span className="font-medium">Close: {outlet.closeTime}</span>
        </div>
      </div>
      <div className="categories-box">
        {subCategories.map((subCategory) => (
          <Link
            key={subCategory.name}
            to={`/menu?subCategory=${encodeURIComponent(subCategory.name)}`}
            className="category-item"
          >
            <span className="category-image">
              <img src={subCategory.imageUrl} alt={subCategory.name} />
            </span>
            <span className="category-name text-center fw-bold fs-6">
              {subCategory.name}
            </span>
          </Link>
        ))}
      </div>

      <h2 className="fw-bold text-center p-3">Suggested for you</h2>
      <div className="random-products">
        <div className="product-grid">
          {randomProducts.map((product) => (
            <div key={product._id} className="product-card">
              <img
                src={product.images[0]?.url || homeBanner}
                alt={product.name}
              />
              <Link to={`/product/${product._id}`}>
                <span className="d-flex align-items-center">
                  <h3 className="me-2 truncate">{product.name}</h3>
                  {product.foodType === "Veg" ? (
                    <img
                      src={vegIcon}
                      alt="Veg Icon"
                      style={{ width: "20px", height: "20px" }}
                    />
                  ) : product.foodType === "Non Veg" ? (
                    <img
                      src={nonVegIcon}
                      alt="Non Veg Icon"
                      style={{ width: "20px", height: "20px" }}
                    />
                  ) : null}
                </span>
              </Link>
              <span className="d-flex justify-between items-center w-full">
                <p className="fw-bold text-dark">₹{product.price}</p>
                {product.stock > 0 ? (
                  <button
                    className="random-add-btn bg-danger rounded-lg"
                    onClick={() => handleAddToCart(product._id)}
                  >
                    Add
                  </button>
                ) : (
                  <button
                    className="random-add-btn bg-secondary rounded-lg"
                    disabled
                  >
                    Out of Stock
                  </button>
                )}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="subcategory-products px-4 py-8">
        {Object.entries(groupedProducts).map(
          ([subCategory, subCategoryProducts]) => (
            <div key={subCategory} className="mb-12">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-base font-bold">{subCategory}</h2>
                {subCategoryProducts.length > 5 && (
                  <Link
                    to={`/menu?subCategory=${encodeURIComponent(subCategory)}`}
                    className="text-blue-600 hover:underline text-sm font-medium"
                  >
                    See all
                  </Link>
                )}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-1 sm:gap-2 md:gap-4 p-1 sm:p-1 md:p-2">
                {subCategoryProducts.slice(0, 5).map((product) => (
                  <div
                    key={product._id}
                    className="flex flex-col bg-white rounded-lg shadow-sm sm:shadow-md overflow-hidden m-2"
                  >
                    <div className="relative h-24 sm:h-32 md:h-40 w-full">
                      <img
                        src={product.images[0]?.url || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-3 pt-2 sm:p-2 md:p-4 flex-grow flex flex-col justify-between">
                      <Link to={`/product/${product._id}`} className="block">
                        <div className="flex items-center mb-0.5 sm:mb-1 md:mb-2">
                          <h3 className="text-xs sm:text-sm md:text-base font-semibold text-gray-800 mr-1 sm:mr-2 truncate">
                            {product.name}
                          </h3>
                          {product.foodType === "Veg" ? (
                            <img
                              src={vegIcon}
                              alt="Veg Icon"
                              style={{ width: "20px", height: "20px" }}
                            />
                          ) : product.foodType === "Non Veg" ? (
                            <img
                              src={nonVegIcon}
                              alt="Non Veg Icon"
                              style={{ width: "20px", height: "20px" }}
                            />
                          ) : null}
                        </div>
                      </Link>
                      <div className="flex justify-between items-center mt-0.5 sm:mt-1 md:mt-2">
                        <p className="text-xs sm:text-sm md:text-base font-bold text-gray-900">
                          ₹{product.price}
                        </p>
                        {product.stock > 0 ? (
                          <button
                            className="px-1 py-0.5 sm:px-2 sm:py-1 md:px-3 md:py-1 bg-red-600 text-white text-2xs sm:text-xs md:text-sm font-medium rounded hover:bg-red-700 transition-colors"
                            onClick={() => handleAddToCart(product._id)}
                          >
                            Add
                          </button>
                        ) : (
                          <button
                            className="px-1 py-0.5 sm:px-2 sm:py-1 md:px-3 md:py-1 bg-gray-300 text-gray-600 text-2xs sm:text-xs md:text-sm font-medium rounded cursor-not-allowed"
                            disabled
                          >
                            Out
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        )}
      </div>

      {isAuthenticated && <LastOrderProducts />}
      <LocationPicker />
      <LiveOrder liveOrders={liveOrders} showLiveOrder={showLiveOrder} />
      <Footer outlet={outlet}/>
    </div>
  );
};

export default Home;
