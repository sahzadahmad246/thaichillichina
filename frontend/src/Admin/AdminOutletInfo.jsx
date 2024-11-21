import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getOutletInfo, clearErrors } from "../actions/adminAction";
import { toast } from "react-toastify";
import AdminNav from "./AdminNav";
import DashboardTop from "./DashboardTop";
import UpdateOutletInfo from "./UpdateOutletInfo";
import { IoMdTime } from "react-icons/io";
import Loader from "../components/Layout/Loader";
import { MdLocalPhone } from "react-icons/md";
import { AiOutlineMail } from "react-icons/ai";
import { CiShop, CiMail, CiPercent } from "react-icons/ci";
import { BsHouse } from "react-icons/bs";
import { IoBanOutline } from "react-icons/io5";
import { SlNotebook } from "react-icons/sl";

const AdminOutletInfo = () => {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);

  const { error, outlet, loading } = useSelector(
    (state) => state.getOutletInfo
  );
  const { success } = useSelector((state) => state.updateOutletInfo);
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(getOutletInfo());

    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (success) {
      setIsEditing(false);
      toast.success("Outlet info updated successfully!");
      dispatch({ type: "UPDATE_OUTLET_INFO_RESET" });
      dispatch(getOutletInfo());
    }
  }, [dispatch, error, success]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleBack = () => {
    setIsEditing(false);
  };

  return (
    <div className="dashboard-main">
      <DashboardTop />
      <div className="dashboard">
        <div className="dashboard-left">
          <AdminNav />
        </div>
        <div className="dashboard-right">
          {isEditing ? (
            <UpdateOutletInfo handleBack={handleBack} />
          ) : (
            <div className="profile-right w-full">
              <>
                <div className="account-top">
                  <span
                    className="material-symbols-outlined"
                    onClick={handleBack}
                  >
                    arrow_back
                  </span>
                  <p>Profile</p>
                  <img src={outlet.outletLogo?.url} alt="outlet logo" />
                </div>
                <div className="profile-main">
                  <div className="profile-cover"></div>
                  <div className="pic-edit">
                    <img
                      src={outlet.outletLogo?.url}
                      className="preview"
                      alt="Outlet logo"
                    />
                    <button onClick={handleEditClick}>Edit profile</button>
                  </div>
                  <div className="profile-info">
                    <p className="d-flex items-center">
                      <span className="bg-blue-50 border rounded-lg m-1 p-1">
                        <CiShop size={30} />
                      </span>
                      <strong className="px-2">Outlet Name:</strong>{" "}
                      {outlet.outletName}
                    </p>
                    <p className="d-flex items-center">
                      <span className="bg-blue-50 border rounded-lg m-1 p-1">
                        <MdLocalPhone size={30} />
                      </span>
                      <strong className="px-2">Phone:</strong> {user.phone}
                    </p>
                    <p className="d-flex items-center">
                      <span className="bg-blue-50 border rounded-lg m-1 p-1">
                        <MdLocalPhone size={30} />
                      </span>
                      <strong className="px-2">Alt Phone:</strong>{" "}
                      {outlet.altPhone}
                    </p>
                    <p className="d-flex items-center">
                      <span className="bg-blue-50 border rounded-lg m-1 p-1">
                        <CiMail size={30} />
                      </span>
                      <strong className="px-2">Email:</strong> {user.email}
                    </p>
                    <p className="d-flex items-center">
                      <span className="bg-blue-50 border rounded-lg m-1 p-1">
                        <CiPercent size={30} />
                      </span>
                      <strong className="px-2">GST:</strong> {outlet.gst}
                    </p>
                    <p className="d-flex items-center">
                      <span className="bg-blue-50 border rounded-lg m-1 p-1">
                        <CiPercent size={30} />
                      </span>
                      <strong className="px-2">Tax:</strong> {outlet.taxPercent}
                      %
                    </p>
                    <p className="d-flex items-center">
                      <span className="bg-blue-50 border rounded-lg m-1 p-1">
                        <IoMdTime size={30} />
                      </span>
                      <strong className="px-2">Open Time:</strong>{" "}
                      {outlet.openTime}
                    </p>
                    <p className="d-flex items-center">
                      <span className="bg-blue-50 border rounded-lg m-1 p-1">
                        <IoMdTime size={30} />
                      </span>
                      <strong className="px-2">Close Time:</strong>{" "}
                      {outlet.closeTime}
                    </p>
                  </div>
                  <div className="border-indigo-600 m-4 p-3 bg-blue-50">
                    <p className="d-flex items-center">
                      <BsHouse size={25} className="icon" />
                      <strong className="px-2">Address:</strong>{" "}
                      {outlet.address}
                    </p>
                    <p className="d-flex items-center">
                      <IoBanOutline size={25} className="icon" />
                      <strong className="px-2">
                        Cancellation Policy:
                      </strong>{" "}
                      {outlet.cancellationPolicy}
                    </p>
                    <p className="d-flex items-center">
                      <SlNotebook size={25} />
                      <strong className="px-2">
                        Terms and Conditions:
                      </strong>{" "}
                      {outlet.termsAndConditions}
                    </p>
                  </div>
                </div>
              </>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOutletInfo;
