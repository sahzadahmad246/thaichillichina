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
          <AccountNav/>
        </div>
        <div className="profile-right">
          <div className="account-top">
            <span className="material-symbols-outlined" onClick={handleBack}>
              arrow_back
            </span>
            <p>Profile</p>
            <img src={profileImage} alt="Profile" />
          </div>
          {isEditing && <UpdateProfile />}
          <div className="profile-main">
            <div className="profile-cover"></div>
            <div className="pic-edit">
              <img src={profileImage} className="preview" alt="Avatar" />
              {isEditing ? (
                <></>
              ) : (
                <>
                  <button onClick={handleEditClick}>Edit profile</button>
                </>
              )}
            </div>

            <div className="profile-info">
              <p>
                <i className="px-2 fa-solid fa-user"></i>
                {user && user.name}
              </p>
              <p>
                <i className="px-2 fa-solid fa-calendar"></i> Joined on
                {" a"}
                {createdAt}
              </p>
              <p>
                <i className="px-2 fa-solid fa-phone"></i>
                {user && user.phone}
              </p>
              <p>
                <i className="px-2 fa-solid fa-envelope"></i>
                {user && user.email}
              </p>
              <p>
                <i className="px-2 fa-solid fa-home"></i>
                {(user && user.deliveryInfo && user.deliveryInfo.address) ||
                  "No address found"}
              </p>
              <p>
                <i className="px-2 fa-solid fa-city"></i>
                {(user && user.deliveryInfo && user.deliveryInfo.city) ||
                  "No city found"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
