import { useState } from "react";
import { useNightMode } from "../contexts/NightModeContext";
import axios from "../helper/axios";
import Swal from "sweetalert2";

const UpdatePassword = ({ handleCancel }) => {
  const { isNightMode } = useNightMode();
  const [newPassword, setNewPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const token =localStorage.getItem('token');

const UpdatePassword = async () => {
    console.log(token);
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
  
      console.log(response);
      if (response) {
        Swal.fire({
          title: 'Password Updated Successfully',
          icon: 'success',
        });
      }
    } catch (e) {
    //   console.log(e.response.data);
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
      <div
        className={`rounded-lg shadow-lg p-6 w-96 ${
          isNightMode ? "bg-gray-900 text-white" : "bg-white text-gray-700"
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Update Password</h2>
          <button
            onClick={handleCancel}
            className={`p-2 rounded-full hover:bg-gray-200 ${
              isNightMode ? "hover:bg-gray-700" : "hover:bg-gray-200"
            }`}
          >
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">New Password</label>
            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={`w-full p-2 rounded-lg ${
                isNightMode
                  ? "bg-gray-800 text-white"
                  : "bg-gray-100 text-gray-800"
              }`}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmedPassword}
              onChange={(e) => setConfirmedPassword(e.target.value)}
              className={`w-full p-2 rounded-lg ${
                isNightMode
                  ? "bg-gray-800 text-white"
                  : "bg-gray-100 text-gray-800"
              }`}
              required
            />
          </div>
          <button
          onClick={handleSubmit}
            type="submit"
            className={`w-full py-2 px-4 rounded-lg transition duration-200 ${
              isNightMode
                ? "bg-blue-600 hover:bg-blue-500"
                : "bg-pink-500 hover:bg-pink-600"
            } text-white`}
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdatePassword;