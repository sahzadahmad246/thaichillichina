import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TextField, Button, CircularProgress } from "@mui/material";
import MetaData from "../components/Home/MetaData";
import {
  getOutletInfo,
  updateOutletInfo,
  clearErrors,
} from "../actions/adminAction";
import { toast } from "react-toastify";
import LocationPicker from "../components/User/LocationPicker";

export default function Component({ handleBack }) {
  const dispatch = useDispatch();
  const { error, loading, isUpdated } = useSelector(
    (state) => state.updateOutletInfo
  );
  const { outlet: outletInfo } = useSelector((state) => state.getOutletInfo);
  const { location, address: reduxAddress } = useSelector((state) => state.location);

  const [outletName, setOutletName] = useState("");
  const [altPhone, setAltPhone] = useState("");
  const [gst, setGst] = useState("");
  const [taxPercent, setTaxPercent] = useState("");
  const [termsAndConditions, setTermsAndConditions] = useState("");
  const [cancellationPolicy, setCancellationPolicy] = useState("");
  const [outletLogo, setOutletLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [outletStatus, setOutletStatus] = useState("");
  const [openTime, setOpenTime] = useState("");
  const [closeTime, setCloseTime] = useState("");
  const [closeReason, setCloseReason] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [locationPickerKey, setLocationPickerKey] = useState(0);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    if (isUpdated) {
      dispatch({ type: "UPDATE_OUTLET_INFO_RESET" });
    }
    dispatch(getOutletInfo());
  }, [dispatch, error, isUpdated]);

  useEffect(() => {
    if (outletInfo) {
      setLogoPreview(outletInfo.outletLogo?.url || "");
      setOutletName(outletInfo.outletName || "");
      setAltPhone(outletInfo.altPhone || "");
      setGst(outletInfo.gst || "");
      setTaxPercent(outletInfo.taxPercent || "");
      setTermsAndConditions(outletInfo.termsAndConditions || "");
      setCancellationPolicy(outletInfo.cancellationPolicy || "");
      setOutletStatus(outletInfo.outletStatus || "");
      setOpenTime(outletInfo.openTime || "");
      setCloseTime(outletInfo.closeTime || "");
      setCloseReason(outletInfo.closeReason || "");
      setAddress(outletInfo.address || "");
      setCity(outletInfo.city || "");
      setPincode(outletInfo.pincode || "");
      setLatitude(outletInfo.location?.coordinates[1] || "");
      setLongitude(outletInfo.location?.coordinates[0] || "");
    }
  }, [outletInfo]);

  useEffect(() => {
    if (location) {
      setLatitude(location.lat || latitude);
      setLongitude(location.lng || longitude);
    }
    if (reduxAddress) {
      setAddress(reduxAddress.address || address);
      setCity(reduxAddress.city || city);
      setPincode(reduxAddress.pincode || pincode);
    }
  }, [location, reduxAddress]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("outletName", outletName);
    formData.append("altPhone", altPhone);
    formData.append("address", address);
    formData.append("city", city);
    formData.append("pincode", pincode);
    formData.append("latitude", latitude);
    formData.append("longitude", longitude);
    formData.append("gst", gst);
    formData.append("taxPercent", taxPercent);
    formData.append("termsAndConditions", termsAndConditions);
    formData.append("cancellationPolicy", cancellationPolicy);
    formData.append("outletStatus", outletStatus);
    formData.append("openTime", openTime);
    formData.append("closeTime", closeTime);
    formData.append("closeReason", closeReason);
    if (outletLogo) {
      formData.append("outletLogo", outletLogo);
    }

    await dispatch(updateOutletInfo(outletInfo._id, formData));
    handleBack();
    toast.success("Outlet information updated successfully!");
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    setOutletLogo(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDetectLocation = () => {
    setLocationPickerKey((prevKey) => prevKey + 1);
    setShowLocationPicker(true);
  };

  return (
    <div className="update-outlet-info p-3 w-full">
      <MetaData title="Update Outlet Information" />
      <div className="update-profile-image">
        <img src={logoPreview} alt="logo" />
        <div className="file-input-wrapper">
          <input
            type="file"
            name="outletLogo"
            accept="image/*"
            id="file-input"
            onChange={handleLogoChange}
          />
          <label htmlFor="file-input">
            <i className="bi bi-cloud-plus"></i>
          </label>
          <p>Choose Outlet Logo</p>
        </div>
      </div>
      <form
        onSubmit={handleSubmit}
        className="update-profile-form"
        encType="multipart/form-data"
      >
        <TextField
          id="outlet-name"
          name="outlet-name"
          label="Outlet Name"
          variant="outlined"
          required
          fullWidth
          margin="normal"
          placeholder="Enter outlet name"
          value={outletName}
          onChange={(e) => setOutletName(e.target.value)}
        />
        <TextField
          id="alt-phone-id"
          name="alt-phone-id"
          label="Outlet Id"
          type="tel"
          variant="outlined"
          required
          fullWidth
          margin="normal"
          placeholder="Outlet ID"
          value={outletInfo._id}
          readOnly
        />
        <TextField
          id="alt-phone"
          name="alt-phone"
          label="Alternate Phone"
          type="tel"
          variant="outlined"
          required
          fullWidth
          margin="normal"
          placeholder="Enter alternate phone number"
          value={altPhone}
          onChange={(e) => setAltPhone(e.target.value)}
        />
        <TextField
          id="gst"
          name="gst"
          label="GST Number"
          variant="outlined"
          required
          fullWidth
          margin="normal"
          placeholder="Enter GST number"
          value={gst}
          onChange={(e) => setGst(e.target.value)}
        />
        <TextField
          id="tax-percent"
          name="tax-percent"
          label="Tax Percentage"
          type="number"
          variant="outlined"
          required
          fullWidth
          margin="normal"
          placeholder="Enter tax percentage"
          value={taxPercent}
          onChange={(e) => setTaxPercent(e.target.value)}
        />
        <TextField
          id="open-time"
          name="open-time"
          label="Open Time"
          type="time"
          variant="outlined"
          required
          fullWidth
          margin="normal"
          value={openTime}
          onChange={(e) => setOpenTime(e.target.value)}
        />
        <TextField
          id="close-time"
          name="close-time"
          label="Close Time"
          type="time"
          variant="outlined"
          required
          fullWidth
          margin="normal"
          value={closeTime}
          onChange={(e) => setCloseTime(e.target.value)}
        />
        <TextField
          id="address"
          name="address"
          label="Address"
          variant="outlined"
          fullWidth
          required
          margin="normal"
          placeholder="Enter address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <TextField
          id="city"
          name="city"
          label="City"
          variant="outlined"
          fullWidth
          required
          margin="normal"
          placeholder="Enter city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <TextField
          id="pincode"
          name="pincode"
          label="Pincode"
          variant="outlined"
          fullWidth
          required
          margin="normal"
          placeholder="Enter pincode"
          value={pincode}
          onChange={(e) => setPincode(e.target.value)}
        />
        <TextField
          id="latitude"
          name="latitude"
          label="Latitude"
          variant="outlined"
          fullWidth
          required
          margin="normal"
          placeholder="Enter latitude"
          value={latitude}
          onChange={(e) => setLatitude(e.target.value)}
        />
        <TextField
          id="longitude"
          name="longitude"
          label="Longitude"
          variant="outlined"
          fullWidth
          required
          margin="normal"
          placeholder="Enter longitude"
          value={longitude}
          onChange={(e) => setLongitude(e.target.value)}
        />
        
        {showLocationPicker && <LocationPicker key={locationPickerKey} />}
        <TextField
          id="terms-and-conditions"
          name="terms-and-conditions"
          label="Terms and Conditions"
          variant="outlined"
          multiline
          rows={4}
          fullWidth
          margin="normal"
          placeholder="Enter terms and conditions"
          value={termsAndConditions}
          onChange={(e) => setTermsAndConditions(e.target.value)}
        />
        <TextField
          id="cancellation-policy"
          name="cancellation-policy"
          label="Cancellation Policy"
          variant="outlined"
          multiline
          rows={4}
          fullWidth
          margin="normal"
          placeholder="Enter cancellation policy"
          value={cancellationPolicy}
          onChange={(e) => setCancellationPolicy(e.target.value)}
        />
        <Button onClick={handleDetectLocation} variant="contained">
          Detect Location
        </Button>
        <Button
          type="submit"
          variant="contained"
          className="update-profile-btn"
          disableElevation
          disabled={loading}
          endIcon={loading && <CircularProgress size={20} color="inherit" />}
        >
          {loading ? "Updating..." : "Update Outlet"}
        </Button>
      </form>
    </div>
  );
}