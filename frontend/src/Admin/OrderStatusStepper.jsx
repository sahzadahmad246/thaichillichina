import React from "react";
import { format, isValid } from "date-fns";
import { CheckCircle2, XCircle } from "lucide-react";

const OrderStatusStepper = ({ statusHistory, createdAt }) => {
  

  const steps = [
    { label: "Accepted", status: "Accepted" },
    { label: "Ready", status: "Ready" },
    { label: "On the way", status: "On the way" },
    { label: "Delivered", status: "Delivered" },
  ];

  const getStepStatus = (step) => {
    const stepStatus = statusHistory?.find(
      (status) => status.status === step.status
    );
    if (stepStatus) {
      return {
        isCompleted: true,
        timestamp: new Date(stepStatus.timestamp),
      };
    }
    return { isCompleted: false, timestamp: null };
  };

  const isOrderCancelledOrRejected = statusHistory?.some(
    (status) => status.status === "cancelled" || status.status === "Rejected"
  );

  const filteredSteps = statusHistory?.reduce((acc, status, index) => {
    if (status.status === "cancelled" || status.status === "Rejected") {
      return statusHistory.slice(0, index + 1).map((s) => ({
        label: s.status,
        status: s.status,
        timestamp: s.timestamp,
      }));
    }
    return acc;
  }, steps);

  const finalSteps = isOrderCancelledOrRejected ? filteredSteps : steps;

  return (
    <div className="py-2">

      {/* Mobile View */}
      <div className="sm:hidden">
        <div className="relative">
          {finalSteps.map((step, index) => {
            const { isCompleted, timestamp } = getStepStatus(step);
            const isLastStep = index === finalSteps.length - 1;
            const isCancelOrReject =
              step.status === "cancelled" || step.status === "Rejected";

            return (
              <div key={step.status} className="flex items-start mb-6 last:mb-0">
                <div className="relative flex flex-col items-center">
                  <div className="w-6 h-6 flex items-center justify-center z-10 bg-white">
                    {isCompleted ? (
                      isCancelOrReject ? (
                        <XCircle className="w-6 h-6 text-red-500" />
                      ) : (
                        <CheckCircle2 className="w-6 h-6 text-green-500" />
                      )
                    ) : (
                      <div className="w-3 h-3 rounded-full bg-gray-300" />
                    )}
                  </div>
                  {!isLastStep && (
                    <div 
                      className="absolute left-1/2 top-6 w-0.5 h-[calc(100%+1.5rem)] -translate-x-1/2"
                      style={{
                        background: isCompleted
                          ? isCancelOrReject
                            ? "#EF4444"
                            : "#10B981"
                          : "#D1D5DB"
                      }}
                    />
                  )}
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">
                    {step.label}
                  </p>
                  {timestamp && (
                    <p className="text-xs text-gray-500">
                      {format(new Date(timestamp), "hh:mm a")}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden sm:block">
        <div className="flex justify-between items-center max-w-3xl mx-auto">
          {finalSteps.map((step, index) => {
            const { isCompleted, timestamp } = getStepStatus(step);
            const isLastStep = index === finalSteps.length - 1;
            const isCancelOrReject =
              step.status === "cancelled" || step.status === "Rejected";

            return (
              <div
                key={step.status}
                className="relative flex flex-col items-center flex-1"
              >
                <div className="w-6 h-6 flex items-center justify-center z-10 bg-white">
                  {isCompleted ? (
                    isCancelOrReject ? (
                      <XCircle className="w-6 h-6 text-red-500" />
                    ) : (
                      <CheckCircle2 className="w-6 h-6 text-green-500" />
                    )
                  ) : (
                    <div className="w-3 h-3 rounded-full bg-gray-300" />
                  )}
                </div>
                <div className="mt-1 text-center">
                  <p className="text-sm font-medium text-gray-900 p-0 m-0">
                    {step.label}
                  </p>
                  {timestamp && (
                    <span className="text-xs text-gray-500 m-0 p-0">
                      {format(new Date(timestamp), "hh:mm a")}
                    </span>
                  )}
                </div>
                {!isLastStep && (
                  <div
                    className={`
                    absolute top-3 left-1/2 w-full h-0.5
                    ${
                      isCompleted
                        ? isCancelOrReject
                          ? "bg-red-500"
                          : "bg-green-500"
                        : "bg-gray-300"
                    }
                  `}
                    style={{ width: 'calc(100% - 12px)', left: '56%' }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OrderStatusStepper;

