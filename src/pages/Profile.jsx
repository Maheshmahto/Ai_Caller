import { MdOutlineCancel } from "react-icons/md";
import axios from "../helper/axios";
import { useEffect, useState } from "react";
import { useNightMode } from "../contexts/NightModeContext";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { useLogin } from "../contexts/AuthContext";
import UpdatePassword from "./UpdatePassword";

const ProfileSettings = ({ handleCancel }) => {
  const token = localStorage.getItem("token");
  const { isNightMode } = useNightMode();
  const [showUpdate, setShowUpdate] = useState(false); // State to control UpdatePassword visibility
  const [profileData, setProfileData] = useState({});

  // Fetch profile data
  const getMyProfile = async () => {
    try {
      const response = await axios.get("/api/get_my_profile", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setProfileData(response.data.data);
    } catch (e) {
      Swal.fire({
        title: `${e.data.message}`,
        icon: "error",
      });
    }
  };

  const { logout } = useLogin(); // Get logout function

  // Handle logout confirmation
  const handleLogout = async () => {
      logout();
  };

  // Fetch profile data on component mount
  useEffect(() => {
    getMyProfile();
  }, []);

  return (
    <>
      {/* Render UpdatePassword component if showUpdate is true */}
      {showUpdate && (
        <UpdatePassword
          handleCancel={() => setShowUpdate(false)} // Pass handleCancel to close the modal
        />
      )}

      {/* Profile Settings Modal */}
      <div className="absolute inset-0 flex justify-end items-start p-6 z-30 top-20">
        <div
          className={`max-w-md rounded-lg shadow-lg p-6 ${
            isNightMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-700"
          }`}
        >
          <div className="flex justify-between">
            <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>
            <MdOutlineCancel
              size={22}
              onClick={handleCancel}
              className="cursor-pointer"
            />
          </div>  

          <div className="space-y-4">
            {/* Admin Profile Section */}
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-pink-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {profileData?.username?.slice(0, 1)}
              </div>
              <div>
                <p className="text-lg font-semibold">{profileData.username}</p>
                <p className="text-sm text-gray-400">{profileData.user_type}</p>
              </div>
            </div>

            {/* Email Section */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Email :-</label>
              <div
                className={`p-3 rounded-lg ${
                  isNightMode
                    ? "bg-gray-800 text-white"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                <p>{profileData.email}</p>
              </div>
            </div>

            {/* Update Password Button */}
            <button
              onClick={() => setShowUpdate(true)} // Open UpdatePassword modal
              className={`w-full py-2 px-4 m-2 rounded-lg transition duration-200 ${
                isNightMode
                  ? "bg-blue-600 hover:bg-blue-500"
                  : "bg-pink-500 hover:bg-blue-600"
              } text-white`}
            >
              Update Password
            </button>

            {/* Logout Button */}
            <Link>
              <button
                onClick={handleLogout}
                className="w-full bg-red-500 m-2 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition duration-200"
              >
                Log out
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileSettings;