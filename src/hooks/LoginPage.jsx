import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../helper/axios";
import Swal from "sweetalert2";
import { useLogin } from "../contexts/AuthContext";
import { PiEyeLight, PiEyeSlash } from "react-icons/pi";


const LoginPage = () => {
  const { dispatch } = useLogin();
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({
    email: "",
    user_password: "",
  });

  const navigate = useNavigate();

  const loginUser = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/ai_calling/login/", loginData, {
        headers: {
          "Content-type": "application/json",
        },
      });
      const user_data = response.data;
      const { token: newToken } = response.data;

      if (!newToken) {
        throw new Error("Token missing. Login failed.");
      }

      localStorage.setItem("user", JSON.stringify(user_data));
      localStorage.setItem("token", newToken);
      dispatch({ type: "LOGIN", payload: { token: newToken } });

      navigate("/dashboard");
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      });
      Toast.fire({
        icon: "success",
        title: "Logged in successfully",
      });
    } catch (e) {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: "Invalid email or password. Please try again.",
      });
    }
  };

  const handleChange = (name, value) => {
    setLoginData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="flex flex-col md:flex-row h-screen md:p-16 p-4 gap-6">
      <div className="md:w-[50%] w-full flex justify-center items-center">
        <img
          className="md:h-[90%] h-auto max-h-64 sm:max-h-96 md:max-h-[600px]"
          src="./images/SignIn.png"
          alt="Login"
        />
      </div>
      
      <div className="shadow-lg flex-1 rounded-xl px-6 py-4 md:px-10">
        <div className="">
          <img className="m-auto w-36 md:w-40" src="./images/logo.png" alt="Logo" />
        </div>
        <div className="flex flex-col items-center gap-2 mt-4">
          <h1 className="text-3xl md:text-4xl font-semibold">Sign In</h1>
          <p className="text-gray-600 text-sm md:text-base text-center">
            Welcome back! Please enter your details
          </p>
        </div>
        <form onSubmit={loginUser} className="mt-8 flex flex-col gap-4">
          <div>
            <label className="text-gray-600 font-semibold">Email</label>
            <input
              name="email"
              value={loginData.email}
              type="email"
              placeholder="Enter your email"
              className="w-full border px-5 py-2 rounded-md mt-1"
              onChange={(e) => handleChange("email", e.target.value)}
              required
            />
          </div>
          <div className="relative">
            <label className="text-gray-600 font-semibold">Password</label>
            <input
              name="password"
              value={loginData.user_password}
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="w-full border px-5 py-2 rounded-md mt-1"
              onChange={(e) => handleChange("user_password", e.target.value)}
              required
            />
            <button 
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute inset-y-0 top-7 right-2 flex items-center"
            >
            {showPassword ? (
                  <PiEyeSlash className="h-5 w-5 text-gray-500" />
                ) : (
                  <PiEyeLight  className="h-5 w-5 text-gray-500" />
                )}
            </button>
          </div>
          <button
            type="submit"
            className="bg-pink-600 text-center py-3 rounded-xl mt-4 text-white font-semibold"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
