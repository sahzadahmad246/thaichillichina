import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setLocation, setAddress } from "../../actions/otherAction";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const LocationPicker = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const handleLocationDetection = () => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            const coords = { lat: latitude, lng: longitude };
            dispatch(setLocation(coords)); 

            fetch(
              `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=1b83cd97373249e09d149faa357a366b`
            )
              .then((response) => response.json())
              .then((data) => {
                if (data.results && data.results.length > 0) {
                  const addressComponents = data.results[0].components;
                  const structuredAddress = {
                    neighborhood: addressComponents.neighbourhood || "",
                    city: addressComponents.city || addressComponents.town || addressComponents.village || "",
                    state: addressComponents.state || "",
                    country: addressComponents.country || "",
                    postalCode: addressComponents.postcode || "",
                  };
                  dispatch(setAddress(structuredAddress)); // Dispatch structured address
                }
              })
              .catch((error) => {
                console.error("Error fetching location:", error);
              });
          },
          (error) => {
            console.error("Error getting user location:", error.message);
          }
        );
      } else {
        console.log("Geolocation is not supported by your browser.");
      }
    };

    handleLocationDetection();
  }, [dispatch]);

  return null;
};

export default LocationPicker;
