import React from "react";
import { format, isValid } from "date-fns";
import "./OrderStatusStepper.css";
import { IoMdCheckmark, IoMdClose } from "react-icons/io"; // Import IoMdClose

const OrderStatusStepper = ({ statusHistory, createdAt }) => {
  const steps = [
    { label: "Placed", status: "Placed" },
    { label: "Accepted", status: "Accepted" },
    { label: "Ready", status: "Ready" },
    { label: "On the way", status: "On the way" },
    { label: "Delivered", status: "Delivered" },
    { label: "Rejected", status: "Rejected" },
    { label: "cancelled", status: "cancelled" }, // Keep this in lowercase
  ];

  let filteredSteps = [];

  const statusLabels = statusHistory?.map((status) => status.status);

  // Check for "Rejected"
  if (statusLabels?.includes("Rejected")) {
    // Filter to show only "Placed" and "Rejected"
    filteredSteps = steps.filter(
      (step) => step.status === "Placed" || step.status === "Rejected"
    );
  }
  // Check for "cancelled"
  else if (statusLabels?.includes("cancelled")) {
    const cancelledIndex = statusLabels.indexOf("cancelled");
    filteredSteps = steps.filter(
      (step) =>
        statusLabels.indexOf(step.status) !== -1 &&
        statusLabels.indexOf(step.status) <= cancelledIndex
    );
  }
  // If there are no "Rejected" or "cancelled", display all steps
  else {
    filteredSteps = steps.filter((step) => statusLabels?.includes(step.status));
  }

  // Ensure 'Placed' step is always completed
  const completedSteps = ["Placed"];

  return (
    <div className="status-stepper">
      {filteredSteps?.map((step, index) => {
        const stepStatus = statusHistory?.find(
          (status) => status.status === step.status
        );
        const isActive =
          completedSteps?.includes(step.status) ||
          (stepStatus && stepStatus.status === step.status);

        const createdAtDate = new Date(createdAt);
        const stepStatusDate = stepStatus
          ? new Date(stepStatus.timestamp)
          : null;

        return (
          <div key={index} className={`step ${isActive ? "active" : ""}`}>
            <div className="step-completion">
              {isActive ? (
                <div
                  className={`icon-container ${
                    step.status === "Rejected" || step.status === "cancelled"
                      ? "red-background" // Red background for cross mark
                      : "green-background" // Green background for check mark
                  }`}
                >
                  {step.status === "Rejected" || step.status === "cancelled" ? (
                    <IoMdClose size={20} color="white" /> // Display cross mark for rejected or cancelled
                  ) : (
                    <IoMdCheckmark size={20} color="white" /> // Display check mark for completed steps
                  )}
                </div>
              ) : (
                index + 1
              )}
            </div>
            <div className="step-details">
              <div className="step-title">
                <span>{step.label}</span>
              </div>
              {step.label === "Placed" && isValid(createdAtDate) && (
                <div className="step-timestamp">
                  {format(createdAtDate, "hh:mm a")}
                </div>
              )}
              {stepStatus &&
                step.label !== "Placed" &&
                isValid(stepStatusDate) && (
                  <div className="step-timestamp">
                    {format(stepStatusDate, "hh:mm a")}
                  </div>
                )}
            </div>
            {index < filteredSteps.length - 1 && <div className="step-line" />}
          </div>
        );
      })}
    </div>
  );
};

export default OrderStatusStepper;
