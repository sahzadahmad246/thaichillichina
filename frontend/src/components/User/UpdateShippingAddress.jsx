import React, { useState, useEffect } from "react";
import { TextField, Button, CircularProgress } from "@mui/material";
import "./UpdateShippingAddress.css";
import { updateProfile } from "../../actions/userAction";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import MetaData from "../Home/MetaData";

const UpdateShippingAddress = ({ user, onEditComplete }) => {
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone);
  const [email, setEmail] = useState(user.email);
  const [address, setAddress] = useState(user.deliveryInfo?.address || "");
  const [city, setCity] = useState(user.deliveryInfo?.city || "");
  const [pincode, setPincode] = useState(user.deliveryInfo?.pincode || "");
  const [latitude, setLatitude] = useState(
    user.deliveryInfo?.location?.coordinates[1] || ""
  );
  const [longitude, setLongitude] = useState(
    user.deliveryInfo?.location?.coordinates[0] || ""
  );
  const [locationLoading, setLocationLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const handleLocationDetection = () => {
      if ("geolocation" in navigator) {
        setLocationLoading(true);
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            fetch(
              `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=1b83cd97373249e09d149faa357a366b`
            )
              .then((response) => response.json())
              .then((data) => {
                if (data.results && data.results.length > 0) {
                  const { postcode, city } = data.results[0].components;
                  setCity(city || "");
                  setPincode(postcode || "");
                  setLatitude(latitude);
                  setLongitude(longitude);
                } else {
                  toast.error("Location details not found.");
                }
              })
              .catch((error) => {
                toast.error("Error fetching location.");
              })
              .finally(() => {
                setLocationLoading(false);
              });
          },
          (error) => {
            toast.error("Error getting user location.");
            setLocationLoading(false);
          }
        );
      } else {
        toast.error("Geolocation is not supported by your browser.");
      }
    };

    handleLocationDetection();
  }, []);

  const handleSave = () => {
    if (!address || !city || !pincode) {
      toast.error("Please fill out all required fields.");
      return;
    }

    const updatedInfo = {
      name,
      phone,
      email,
      address,
      city,
      pincode,
      longitude,
      latitude,
    };

    dispatch(updateProfile(updatedInfo))
      .then(() => {
        toast.success("Address updated successfully!");
        onEditComplete();
      })
      .catch(() => {
        toast.error("Error updating Address.");
      });
  };
  const handleBack = () => {
    onEditComplete();
  };
  return (
    <div className="update-shipping-address">
      <MetaData title="Update Address" />
      <div className="update-password-top">
        <span
          className="material-symbols-outlined cursor-pointer"
          onClick={handleBack}
        >
          arrow_back
        </span>
        <p>Update Address</p>
        <img src={user.avatar && user.avatar.url} alt="Profile" />
      </div>
      <form>
        <div className="form-group">
          <TextField
            type="text"
            label="Complete address"
            variant="outlined"
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            fullWidth
            required
          />
        </div>
        <div className="form-group">
          <TextField
            type="text"
            label="City"
            variant="outlined"
            id="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            fullWidth
            required
          />
        </div>
        <div className="form-group">
          <TextField
            type="text"
            required
            label="Pincode"
            variant="outlined"
            id="pincode"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            fullWidth
          />
        </div>

        <Button
          variant="contained"
          onClick={handleSave}
          disableElevation
          disabled={locationLoading}
          endIcon={
            locationLoading && <CircularProgress size={20} color="inherit" />
          }
        >
          {locationLoading ? "Detecting location..." : "Save"}
        </Button>
      </form>
    </div>
  );
};

export default UpdateShippingAddress;
