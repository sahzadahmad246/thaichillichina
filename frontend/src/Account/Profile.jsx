import React, { useState, useEffect } from "react";
import "./Profile.css";
import profilePic from "../images/china.png";
import { useDispatch, useSelector } from "react-redux";
import UpdateProfile from "../components/User/UpdateProfile";
import { toast } from "react-hot-toast";
import { updateAvatar, clearErrors } from "../actions/userAction";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Layout/Loader";
import AccountNav from "./AccountNav";
import {
  ArrowLeft,
  User,
  Calendar,
  Phone,
  Mail,
  Home,
  Building2,
} from "lucide-react";

const Profile = () => {
  const { error, loading, isAuthenticated, user, isUpdated } = useSelector(
    (state) => state.user
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  const handleBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
  }, [dispatch, error, isUpdated]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  if (loading) {
    return <Loader />;
  }

  const profileImage = user && user.avatar ? user.avatar.url : profilePic;
  const createdAt =
    user && user.createdAt
      ? String(user.createdAt).substr(0, 10)
      : "No date found";

  return (
    <>
      <div className="profile-container ">
        <div className="profile-left">
          <AccountNav />
        </div>
        <div className="profile-right ">
          <div className="w-full  mx-auto bg-white  rounded-lg overflow-hidden">
            <div className="flex items-center justify-between p-2 sm:p-3 border-b">
              <ArrowLeft
                className="w-6 h-6 cursor-pointer text-gray-600 hover:text-gray-900"
                onClick={handleBack}
              />
              <h1 className="text-2xl font-semibold text-gray-800">Profile</h1>
              <img
                src={profileImage}
                alt="Avatar"
                className="w-10 h-10 rounded-full   border"
              />
            </div>

            {isEditing && <UpdateProfile />}

            <div className="relative border-b">
              <img
                src={profileImage}
                alt="Cover"
                className="w-full h-48 object-cover"
              />
              <div className="absolute bottom-0 left-6 transform translate-y-1/2">
                <img
                  src={profileImage}
                  alt="Avatar"
                  className="w-24 h-24 rounded-full   border"
                />
              </div>
            </div>

            <div className="mt-16  p-6 ">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  {user && user.name}
                </h2>
                {!isEditing && (
                  <button
                    onClick={handleEditClick}
                    className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition duration-300"
                  >
                    Edit profile
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoBox
                  icon={<Calendar className="w-5 h-5 text-gray-500" />}
                  label="Joined on"
                  value={createdAt}
                />
                <InfoBox
                  icon={<Phone className="w-5 h-5 text-gray-500" />}
                  label="Phone"
                  value={user && user.phone}
                />
                <InfoBox
                  icon={<Mail className="w-5 h-5 text-gray-500" />}
                  label="Email"
                  value={user && user.email}
                />
                <InfoBox
                  icon={<Home className="w-5 h-5 text-gray-500" />}
                  label="Address"
                  value={
                    (user && user.deliveryInfo && user.deliveryInfo.address) ||
                    "No address found"
                  }
                />
                <InfoBox
                  icon={<Building2 className="w-5 h-5 text-gray-500" />}
                  label="City"
                  value={
                    (user && user.deliveryInfo && user.deliveryInfo.city) ||
                    "No city found"
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const InfoBox = ({ icon, label, value }) => (
  <div className="bg-gray-50 rounded-lg p-2 sm:p-3 border flex items-center">
    <div className="flex items-center  h-full border-r pr-2">{icon}</div>
    <div>
      <span className="ml-2 text-sm font-medium text-gray-500">{label}</span>
      <p className="text-gray-800  text-sm p-0 ml-2">{value}</p>
    </div>
  </div>
);
export default Profile;
