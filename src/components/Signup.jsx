// Signup.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { useNightMode } from "../contexts/NightModeContext";
// import { AuthContext } from '../contexts/AuthContext';
import axios from "../helper/axios";
// import qs from 'qs'
// import qs from 'qs'
import Swal from "sweetalert2";
const Signup = () => {
  const { isNightMode } = useNightMode();
  // const { register } = useContext(AuthContext);
  // const [name, setName] = useState('');
  // const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');
  const [register, setRegister] = useState({
    user_name: "",
    user_email: "",
    user_password: "",
    phone_no: "",
    api_key: "",
    agent_id: "",
  });
  const handleChange = (name, value) => {
    setRegister((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const registerUser = async (e) => {
    e.preventDefault();
    console.log("Sending Data:", register);
    try {
      const response = await axios.post(
        "/api/insert/ai_calling_register_user/",
        register,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded", // Ensure correct format
          },
        }
      );
      if (response) {
        Swal.fire({
          title: "Signup  successful!",
          icon: "success",
        });
      }
      console.log(response);
    } catch (e) {
      console.log(e);
      Swal.fire({
        icon: "error",
        title: `${e.response.data.detail}`,
      });
    }
  };
  return (
    <div className="flex p-11 border">
      <div className="w-[50%] flex justify-center items-center">
        <img src="/call ai.webp" alt="image" className="max-w-[60%]" />
      </div>
      <div className="w-[60%] p-5 rounded-2xl shadow-xl">
        <div className="flex justify-center items-center">
          <img src="/MAITRI AI LOGO 4.webp" alt="logo" />
        </div>
        <h1 className="flex justify-center items-center font-bold text-3xl">
          Create an account
        </h1>
        <p className="flex justify-center items-center mt-2">
          Welcome! Please enter your details
        </p>

        <form onSubmit={registerUser} className="mt-7 ml-14">
          <div className="flex w-[100%]">
            <span className="w-[50%]">
              <label className="mb-2 block text-lg font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={register.user_name}
                onChange={(e) => handleChange("user_name", e.target.value)}
                placeholder="Enter your name"
                className="w-[90%] p-3 border border-gray-300 rounded"
                required
              />
            </span>
            <span className="w-[50%]">
              <label className="mb-2 block text-lg font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={register.user_email}
                onChange={(e) => handleChange("user_email", e.target.value)}
                placeholder="admin@gmail.com"
                className="w-[90%] p-3 border border-gray-300 rounded"
                required
              />
            </span>
          </div>
          <div className="flex">
            <span className="w-[50%]">
              {/* <label className="mb-2 block text-lg font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={register.user_password}
                onChange={(e) => handleChange("user_password", e.target.value)}
                placeholder="Enter your password"
                className="w-[90%] p-3 border border-gray-300 rounded"
                required
                maxLength={8}
              /> */}
                            <label className="mb-2 block text-lg font-medium text-gray-700">
                Agent Id
              </label>
              <input
                type="text"
                id="agent_id"
                value={register.agent_id}
                onChange={(e) => handleChange("agent_id", e.target.value)}
                placeholder="Enter your password"
                className="w-[90%] p-3 border border-gray-300 rounded"
                required
              />
            </span>
            <span className="w-[50%]">
              <label className="mb-2 block text-lg font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone_no"
                value={register.phone_no}
                onChange={(e) => handleChange("phone_no", e.target.value)}
                placeholder="Enter your password"
                className="w-[90%] p-3 border border-gray-300 rounded"
                required
                maxLength={10}
              />
            </span>
          </div>
          <div className="flex">
            <span className="w-[50%]">
              <label className="mb-2 block text-lg font-medium text-gray-700">
                Api Key
              </label>
              <input
                type="text"
                id="api_key"
                value={register.api_key}
                onChange={(e) => handleChange("api_key", e.target.value)}
                placeholder="Enter your password"
                className="w-[90%] p-3 border border-gray-300 rounded"
                required
              />
            </span>
            <span className="w-[50%]">

                            <label className="mb-2 block text-lg font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={register.user_password}
                onChange={(e) => handleChange("user_password", e.target.value)}
                placeholder="Enter your password"
                className="w-[90%] p-3 border border-gray-300 rounded"
                required
                maxLength={8}
              />
            </span>
          </div>

          <button
            type="submit"
            className="mt-7 w-[90%] h-14 text-white text-lg border border-gray-400 rounded-2xl bg-customPink hover:bg-pink-500"
          >
            Create an account
          </button>
        </form>

        <div className="mt-3 flex items-center justify-center">
          <hr className="w-9 mr-5 border-t-2 border-gray-400" />
          <span className="mx-2 text-gray-500">OR</span>
          <hr className="w-9 ml-5 border-t-2 border-gray-400" />
        </div>
        <p className="mt-10 text-center text-lg text-gray-500">
          Already have an account?
          <Link
            to="/login"
            className="text-customPink hover:text-pink-500 font-bold ml-3"
          >
            Sign-in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
