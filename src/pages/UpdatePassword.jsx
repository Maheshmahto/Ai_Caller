import { useState } from "react";
import { useNightMode } from "../contexts/NightModeContext";
import axios from "../helper/axios";
import Swal from "sweetalert2";
import { PiEyeLight, PiEyeSlash } from "react-icons/pi";


const UpdatePassword = ({ handleCancel }) => {
  const { isNightMode } = useNightMode();
  const [newPassword, setNewPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const token = localStorage.getItem('token');

  const UpdatePassword = async () => {
    try {
      const response = await axios.put(
        `/api/update_password/?new_password=${newPassword}&confirm_password=${confirmedPassword}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response) {
        Swal.fire({
          title: 'Password Updated Successfully',
          icon: 'success',
        });
      }
    } catch (e) {
      Swal.fire({
        title: `${e.response.data.detail}`,
        icon: 'error',
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    UpdatePassword();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`rounded-lg shadow-lg p-6 w-96 ${isNightMode ? "bg-gray-900 text-white" : "bg-white text-gray-700"}`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Update Password</h2>
          <button
            onClick={handleCancel}
            className={`p-2 rounded-full ${isNightMode ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}
          >
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* New Password */}
          <div>
            <label className="block text-sm font-medium mb-1">New Password</label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={`w-full p-2 pr-10 rounded-lg ${isNightMode ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-800"}`}
                required
              />
              <button
                type="button"
                onClick={() => setShowNewPassword((prev) => !prev)}
                className="absolute inset-y-0 right-2 flex items-center"
              >
                {showNewPassword ? (
                  <PiEyeSlash className="h-5 w-5 text-gray-500" />
                ) : (
                  <PiEyeLight  className="h-5 w-5 text-gray-500" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium mb-1">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm new password"
                value={confirmedPassword}
                onChange={(e) => setConfirmedPassword(e.target.value)}
                className={`w-full p-2 pr-10 rounded-lg ${isNightMode ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-800"}`}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute inset-y-0 right-2 flex items-center"
              >
                {showConfirmPassword ? (
                  <PiEyeSlash className="h-5 w-5 text-gray-500" />
                ) : (
                  <PiEyeLight className="h-5 w-5 text-gray-500" />
                )}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className={`w-full py-2 px-4 rounded-lg transition duration-200 ${isNightMode ? "bg-blue-600 hover:bg-blue-500" : "bg-pink-500 hover:bg-pink-600"} text-white`}
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdatePassword;
