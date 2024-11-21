import { Button } from "@mui/material";
import { Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MetaData from "../Home/MetaData";
export default function ProductDetailsError() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <>
      <MetaData title="Error" />
      <div className="flex flex-col items-center justify-center min-h-[50vh] px-4 py-8 bg-background text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
          Oops! Something Went Wrong
        </h1>
        <p className="text-muted-foreground text-sm md:text-base mb-6 max-w-md">
          We encountered an error while fetching the product details. The
          product might not be available or there could be a temporary issue.
        </p>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Home className="w-4 h-4" />}
          className="normal-case"
          onClick={handleGoBack}
        >
          Return to Home
        </Button>
      </div>
    </>
  );
}
