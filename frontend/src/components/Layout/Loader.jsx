import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import "./Loader.css"; // Remove this if no additional styling is needed

const Loader = () => {
  return (
    <div
     className="main-loader"
    >
      <CircularProgress sx={{ color: "red" }} size={50} thickness={3} />
    </div>
  );
};

export default Loader;
