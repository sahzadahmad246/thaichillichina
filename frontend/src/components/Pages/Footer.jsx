import React from "react";
import { Link } from "react-router-dom";
import { Clock, Phone, MapPin, CreditCard, AlertCircle, Navigation } from "lucide-react";

export default function Footer({ outlet }) {
  const handleNavigate = () => {
    if (outlet.location && outlet.location.coordinates) {
      const [longitude, latitude] = outlet.location.coordinates;
      const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
      window.open(url, '_blank');
    }
  };

  return (
    <footer className="bg-white text-gray-800 p-3">
      <div className="mb-4 text-center">
        <p className="font-semibold mb-2">That's it on home page</p>
        <Link
          to="/menu"
          className="bg-red-600 text-white px-4 py-2 rounded-full inline-block font-medium hover:bg-red-700 transition-colors"
        >
          Explore Menu
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
        <h3 className="font-bold text-2xl mb-4 text-gray-800 border-b pb-2">
          {outlet.outletName}
        </h3>
        <div className="space-y-3">
          <div className="flex items-start">
            <MapPin className="w-5 h-5 text-red-500 mr-3 mt-1 flex-shrink-0" />
            <div className="flex-grow flex items-center justify-between">
              <p className="text-sm text-gray-600 leading-snug">
                {outlet.address}
              </p>
              <button
                onClick={handleNavigate}
                className="ml-2 flex items-center text-blue-600 hover:text-blue-800 transition-colors"
              >
                <Navigation className="w-4 h-4 mr-1" />
                <span className="text-xs">Navigate</span>
              </button>
            </div>
          </div>
          <div className="flex items-center">
            <Clock className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0" />
            <p className="text-sm text-gray-600">
              <span className="font-medium">Open:</span> {outlet.openTime} -{" "}
              <span className="font-medium">Close:</span> {outlet.closeTime}
            </p>
          </div>
          <div className="flex items-center">
            <Phone className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
            <p className="text-sm text-gray-600">{outlet.altPhone}</p>
          </div>
          <div className="flex items-center">
            <CreditCard className="w-5 h-5 text-purple-500 mr-3 flex-shrink-0" />
            <p className="text-sm text-gray-600">
              <span className="font-medium">GST:</span> {outlet.gst}
            </p>
          </div>
          {outlet.outletStatus !== "Open" && (
            <div className="flex items-start mt-4 bg-red-100 p-3 rounded-md">
              <AlertCircle className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-red-600">
                  Status: {outlet.outletStatus}
                </p>
                <p className="text-xs text-red-500 mt-1">
                  {outlet.closeReason}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="text-center mt-4 text-xs text-gray-500">
        Designed with ❤️ by Shazad
      </div>
    </footer>
  );
}