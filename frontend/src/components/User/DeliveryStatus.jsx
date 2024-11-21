import React from "react";
import { CiLocationArrow1 } from "react-icons/ci";

// function to calculate the distance between two coordinates
const haversineDistance = (coords1, coords2) => {
  const R = 6371; // Radius of the Earth in kilometers
  const lat1 = coords1.lat * (Math.PI / 180);
  const lon1 = coords1.lng * (Math.PI / 180);
  const lat2 = coords2.lat * (Math.PI / 180);
  const lon2 = coords2.lng * (Math.PI / 180);

  const dlat = lat2 - lat1;
  const dlon = lon2 - lon1;

  const a =
    Math.sin(dlat / 2) * Math.sin(dlat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dlon / 2) * Math.sin(dlon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in kilometers
};

const DeliveryStatus = ({ outlet, location, address }) => {
  if (!outlet || !location) {
    return null;
  }

  const outletCoords = {
    lat: outlet.location?.coordinates[1],
    lng: outlet.location?.coordinates[0],
  };
  const userCoords = { lat: location.lat, lng: location.lng };
  const distance = haversineDistance(outletCoords, userCoords);

  return distance > 6 ? (
    <div className="quick-location">
      <span className="p-2 m-2 bg-gray-200 rounded-full">
        <CiLocationArrow1 />
      </span>
      <span>Not delivering to your location</span>
    </div>
  ) : (
    <div className="quick-location">
      <span className="p-2 m-2 bg-gray-200 rounded-full">
        <CiLocationArrow1 />
      </span>
      <span>
        <span>
          {address.neighbourhood || address.city || "Unknown locality"}{" "}
          {address.city || "Unknown city"}
        </span>
        <span>Delivery available</span>
      </span>
    </div>
  );
};

export default DeliveryStatus;
