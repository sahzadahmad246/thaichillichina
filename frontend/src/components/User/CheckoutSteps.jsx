import {
  Typography,
  Step,
  StepLabel,
  Stepper,
  StepConnector,
} from "@mui/material";
import "./CheckoutSteps.css";
import React from "react";
import {
  MdLocalShipping,
  MdLibraryAddCheck,
  MdAccountBalance,
} from "react-icons/md";

const CheckoutSteps = ({ activeStep }) => {
  const fontSize = window.innerWidth <= 768 ? "25px" : "30px";
  const labelFontSize = window.innerWidth <= 768 ? "17px" : "22px";
  const steps = [
    {
      label: (
        <Typography>{window.innerWidth <= 768 ? "" : "Delivery"}</Typography>
      ),
      icon: <MdLocalShipping />,
    },
    {
      label: (
        <Typography>{window.innerWidth <= 768 ? "" : "Review"} </Typography>
      ),
      icon: <MdLibraryAddCheck />,
    },
    {
      label: (
        <Typography>{window.innerWidth <= 768 ? "" : "Payment"}</Typography>
      ),
      icon: <MdAccountBalance />,
    },
  ];

  const stepsStyle = {
    boxSizing: "border-box",
  };

  return (
    <>
      <Stepper
        alternativeLabel
        activeStep={activeStep}
        style={stepsStyle}
        connector={<StepConnector />}
      >
        {steps.map((item, index) => (
          <Step
            key={index}
            active={activeStep === index}
            completed={activeStep >= index}
          >
            <StepLabel
              style={{
                color: activeStep >= index ? "#ff004d" : "rgba(0, 0, 0, 0.649)",
                fontSize,
              }}
              icon={item.icon}
            >
              <span className="step-label">{item.label}</span>
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </>
  );
};

export default CheckoutSteps;
