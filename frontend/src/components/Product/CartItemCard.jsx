import React, { useEffect, useState } from "react";
import vegIcon from "../../images/veg-icon.png";
import nonVegIcon from "../../images/non-veg-icon.png";
import { useDispatch } from "react-redux";
import { addItemsToCart, removeItemFromCart } from "../../actions/cartAction";

const CartItemCard = ({ item }) => {
  const [foodTypeIcon, setFoodTypeIcon] = useState();
  const dispatch = useDispatch();

  useEffect(() => {
    if (item.foodType === "Non Veg") {
      setFoodTypeIcon(nonVegIcon);
    } else {
      setFoodTypeIcon(vegIcon);
    }
  }, [item.foodType]);

  const decreaseQuantity = (id, quantity) => {
    const newQty = quantity - 1;
    if (newQty < 1) {
      dispatch(removeItemFromCart(id));
    } else {
      dispatch(addItemsToCart(id, newQty));
    }
  };

  const increaseQuantity = (id, quantity, stock) => {
    const newQty = quantity + 1;
    if (10 <= quantity) {
      return;
    }
    dispatch(addItemsToCart(id, newQty));
  };

  const removeItem = (id) => {
    dispatch(removeItemFromCart(id));
  };

  return (
    <div className="item-card">
      <img src={item.image && item.image.url} alt={item.name} />
      <div className="item-info">
        <div>
          <h4>{item.name}</h4>
          <span
            className={
              item && item.stock < 1 ? "text-danger" : "text-success d-flex "
            }
          >
            {item && item.stock < 1 ? "Out of Stock" : "In Stock"}{" "}
            <div className="d-flex items-center px-2">
              <img src={foodTypeIcon} alt={item.foodType} />{" "}
              <span className="px-1">{item.foodType}</span>
            </div>
          </span>
        </div>
        <h1 className="text-dark fw-bold">{`₹ ${item.price}`}</h1>
      </div>

      <div className="item-card-block-2">
        <div className="item-card-block-2-1">
          <button onClick={() => decreaseQuantity(item.product, item.quantity)}>
            -
          </button>
          <input
            className="text-center "
            readOnly
            value={item.quantity}
            type="number"
          />
          <button
            className="text-center "
            onClick={() =>
              increaseQuantity(item.product, item.quantity, item.stock)
            }
          >
            +
          </button>
        </div>
        <button
          className="remove-btn "
          onClick={() => removeItem(item.product)}
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default CartItemCard;
