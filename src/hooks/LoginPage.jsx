import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../helper/axios";
import Swal from "sweetalert2";
import { useLogin } from "../contexts/AuthContext";

const LoginPage = () => {
  const { dispatch } = useLogin();
  const [loginData, setLoginData] = useState({
    email: "",
    user_password: "",
  });

  const navigate = useNavigate();

  const loginUser = async (e) => {
    e.preventDefault();
    // console.log("login data", loginData);

    try {
      const response = await axios.post("/api/ai_calling/login/", loginData, {
        headers: {
          "Content-type": "application/json",
        },
      });
      const user_data = response.data;
      const { token: newToken } = response.data;

      if (!newToken) {
        // If no token is present, show an error and return
        throw new Error("Token missing. Login failed.");
      }

      localStorage.setItem("user", JSON.stringify(user_data));
      localStorage.setItem("token", newToken);

      // Call the login function from AuthContext to update isAuthenticated
      // login(loginData.email, loginData.user_password);
      dispatch({ type: "LOGIN", payload: { token: newToken } });

      if (newToken) {
        localStorage.setItem("token", newToken);
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
      }
    } catch (e) {
      console.log(e);
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
    <div className="flex h-screen p-16">
      <div className="w-[60%] flex justify-center items-center">
        <img className="h-[80%]" src="./SignIn.png" alt="Login" />
      </div>
      <div className="shadow-lg flex-1 rounded-xl px-10">
        <div className="">
          <img className="m-auto" src="./logo.png" alt="Logo" />
        </div>
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-4xl font-semibold">Sign In</h1>
          <h1 className="text-gray-600">
            Welcome back! Please enter your details
          </h1>
        </div>
        <form onSubmit={loginUser} className="mt-10 flex flex-col gap-3">
          <h1 className="text-gray-600 font-semibold">Email</h1>
          <input
            name="email"
            value={loginData.email}
            type="email"
            placeholder="Enter your email"
            className="w-full border px-5 py-2 rounded-md"
            onChange={(e) => handleChange("email", e.target.value)}
            required
          />
          <h1 className="text-gray-600 font-semibold">Password</h1>
          <input
            name="password"
            value={loginData.user_password}
            type="password"
            placeholder="Enter your password"
            className="w-full border px-5 py-2 rounded-md"
            onChange={(e) => handleChange("user_password", e.target.value)}
            required
          />
          <div className="flex justify-end">
            {/* <h1 className="text-pink-600 font-semibold hover:cursor-pointer">
              Forgot Password?
            </h1> */}
          </div>
          <button
            type="submit"
            className="bg-pink-600 text-center py-3 rounded-xl text-white font-semibold"
          >
            Sign in
          </button>
        </form>
        {/* <div className="flex justify-center items-center gap-3 mt-4">
          <img src="./line.png" alt="Line" />
          <h1>OR</h1>
          <img src="./line.png" alt="Line" />
        </div> */}
        {/* <div className="flex justify-center items-center gap-2">
          <h1 className="text-gray-600">Didn't have an Account?</h1>
          <Link to={"/signup"}>
            <button className="text-pink-600 font-semibold hover:cursor-pointer">
              Sign-up
            </button>
          </Link>
        </div> */}
      </div>
    </div>
  );
};

export default LoginPage;
