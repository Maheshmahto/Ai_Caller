import { useEffect, useState } from "react";
import { useNightMode } from "../contexts/NightModeContext";
import Loader from "../components/Loader";
import axios from "../helper/axios";
import { Link, useNavigate } from "react-router-dom";
import ProfileSettings from "./Profile";

const Billing = () => {
  const [activeButton, setActiveButton] = useState("billing");
  const usedMinutes = 0;
  const totalMinutes = 30;
  const progressPercentage = (usedMinutes / totalMinutes) * 100;
  const [showForm, setShowForm] = useState(false);
  const { isNightMode, toggleNightMode } = useNightMode();
  const [load, setLoad] = useState(true);
  const [plan, setPlans] = useState([]);
  const token = localStorage.getItem("token");
  const [profileData, setProfileData] = useState({});
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");

  const ProfileRef = (null);
  const profileToggleRef = (null);

  /** ✅ Function to get user profile */
  const getMyProfile = async () => {
    try {
      const response = await axios.get("/api/get_my_profile", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      // console.log(response.data.data);
      setProfileData(response.data.data);
    } catch (e) {
      Swal.fire({
        title: e.response?.data?.message || "Error fetching profile",
        icon: "error",
      });
    }
  };

  const subPlans = async () => {
    try {
      const response = await axios.get(
        "/api/subscription-plans"
      );
      console.log(response.data);
      setPlans(response.data);
    } catch (e) {
      console.log(e);
      
    }
  };

  const [balance, setBalance] = useState(null);

  const getUserBalance = async () => {
    try {
      const response = await axios.get("/api/user/user_balance/", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setBalance(response.data.balance);
      setLoad(false);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    subPlans();
    getUserBalance();
    getMyProfile();
  }, []);

  const handleClick = () => {
    if (amount > 0) {
      localStorage.setItem("rechargePrice", amount);
      navigate("/recharge", { state: { price: amount } });
    } else {
      return
    }
  };

  const handleCancel = () => {
    setShowProfile(!showProfile); // Toggle profile visibility
  };

  return (
    <div
      className={`${isNightMode ? "bg-black text-white" : "bg-gray-50 text-gray-700"
        } p-4 md:p-6 lg:p-9 md:ml-64 `}
    >
      <div className="flex flex-col md:flex-row justify-between">
        {/* Show logo on mobile and text on larger screens */}
        <div className="flex items-center">
          <img
            src="./images/MAITRIAILOGO4.png"
            alt="Company Logo"
            className="w-40 sm:hidden -mt-1 ml-10"
          />
          {/* Dashboard text - hidden on mobile */}
          <div className="hidden sm:block font-bold text-2xl md:text-3xl">
            Dashboard Overview
            <p className="text-lg md:text-xl font-semibold text-gray-400">
              Monitor your AI calling performance
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center mt-4 md:mt-0 space-y-4 md:space-y-0 md:space-x-4">
          <button
            className="flex items-center bg-gray-100 rounded-full sm:rounded-md p-2 text-lg font-semibold text-gray-600 absolute sm:static top-4 right-14 gap-2"
            onClick={toggleNightMode}
          >
            {isNightMode ? (
              <>
                <h2 className="hidden sm:inline"> Light mode{" "}</h2>
                <img src="./images/Light mode.png" alt="" className="" />
              </>
            ) : (
              <>
                <h2 className="hidden sm:inline">Night mode</h2>
                <img src="./images/material-symbols-light_dark-mode-rounded.png" alt="" className="" />
              </>
            )}
          </button>

          <div
            ref={profileToggleRef}
            className="w-9 h-9 sm:w-12 sm:h-12 mr-6 bg-pink-500 rounded-full flex items-center justify-center text-white text-xl sm:text-3xl font-bold cursor-pointer absolute sm:static top-0 -right-3 "
            onClick={handleCancel}
          >
            {/* {profileData?.username?.slice(0, 1)} */}
            <svg xmlns="http://www.w3.org/2000/svg" width={512} height={512} viewBox="0 0 512 512"><path fill="white" fillRule="evenodd" d="M256 42.667A213.333 213.333 0 0 1 469.334 256c0 117.821-95.513 213.334-213.334 213.334c-117.82 0-213.333-95.513-213.333-213.334C42.667 138.18 138.18 42.667 256 42.667m21.334 234.667h-42.667c-52.815 0-98.158 31.987-117.715 77.648c30.944 43.391 81.692 71.685 139.048 71.685s108.104-28.294 139.049-71.688c-19.557-45.658-64.9-77.645-117.715-77.645M256 106.667c-35.346 0-64 28.654-64 64s28.654 64 64 64s64-28.654 64-64s-28.653-64-64-64"></path></svg>

          </div>
          {/* <img src="./images/Rectangle.webp" alt="" className="w-10 h-10 cursor-pointer" onClick={handleCancel} /> */}
        </div>
      </div>
      {showProfile && (
        <div ref={ProfileRef}><ProfileSettings handleCancel={() => setShowProfile(false)} /></div>
      )}
      <div
        className={`${isNightMode ? "bg-black text-white" : "bg-white text-gray-700"
          } flex shadow rounded-lg mt-10 p-4 gap-5`}
      >

        <button
          className={`sm:p-3 p-2 ml-5 rounded-lg text-lg ${activeButton === "billing" ? "bg-customPink text-white" : ""
            }`}
          onClick={() => setActiveButton("billing")}
        >
          Billing Summary
        </button>

        <button
          className={`sm:p-3 p-2  rounded-lg text-lg ${activeButton === "voice" ? "bg-customPink text-white" : ""
            }`}
          onClick={() => setActiveButton("voice")}
        >
          Voice Usage Revenue
        </button>
      </div>

      {activeButton === "billing" && (
        <>
          <div className="mt-6 gap-6 justify-between relative sm:flex ">
            <div
              className={`${isNightMode
                ? "bg-customDarkGray text-white"
                : "bg-white text-gray-700"
                } w-full shadow rounded-lg h-40 p-5 my-4 sm:my-0`}
            >
              <div className="text-lg ">Your Agency Balance</div>
              <div className="flex justify-between">
                <p className="text-4xl font-bold  mt-2">₹ {balance}</p>
                <button
                  onClick={() => {
                    setShowForm(true);
                    document.body.style.overflow = "hidden";
                  }}
                  className="items-center justify-center border rounded-lg bg-customPink p-3 text-white"
                >
                  Add Funds
                </button>
                
                {load && (
                  // <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md z-50">
                  //   <Loader />
                  // </div>
                  <div className="fixed inset-0 right-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md z-30">
                    <Loader />
                  </div>
                )}

                {showForm && (
                  <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50 z-[9999]">
                    <div
                      className={`${isNightMode
                        ? "bg-customDarkGray text-white"
                        : "bg-gray-50 text-gray-700"
                        } border w-[90%] sm:w-[30%] py-8 shadow-lg rounded-xl p-6 mt-6 `}
                    >
                      <h2 className="text-2xl flex justify-between font-bold mb-7">
                        Your Agency Balance
                        <button
                          onClick={() => {
                            setShowForm(false);
                            document.body.style.overflow = "auto";
                          }}
                        >
                          <img src="public/images/button.png" alt="" />
                        </button>
                      </h2>

                      <form>
                        <div className="mb-4">
                          <label className="block font-medium mb-2">
                            Select Amount
                          </label>
                          <input
                            type="number"
                            value={amount}
                            required
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Amount"
                            className="w-full border rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                          />
                        </div>


                        <div className="flex gap-4 justify-end">
                          <button
                            type="button"
                            onClick={() => {
                              setShowForm(false);
                              document.body.style.overflow = "auto";
                            }}
                            className="bg-gray-200 text-black px-5 py-2 rounded-lg hover:bg-gray-300 transition"
                          >
                            Cancel
                          </button>


                          <button
                            type="submit"
                            className="bg-customPink text-white px-5 py-2 rounded-lg hover:bg-customDarkPink transition"
                            onClick={handleClick}
                          >
                            Add to my Balance
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div
              className={`${isNightMode
                ? "bg-customDarkGray text-white"
                : "bg-white text-gray-700"
                } w-full shadow rounded-lg text-lg  p-5 my-4 sm:my-0 ${showForm ? "static" : "relative"}`}
            >
              Monthly Plan Name
              <p className="text-2xl font-bold mt-2">Starter</p>
              <p className={`text-green-700 bg-green-100 text-sm w-fit rounded-3xl p-2 mt-3 pl-4 pr-4 ${showForm ? "static" : "absolute"} top-2 right-5`}>
                Active
              </p>
            </div>
            <div
              className={`${isNightMode
                ? "bg-customDarkGray text-white"
                : "bg-white text-gray-700"
                } rounded-lg w-full shadow text-lg p-5`}
            >
              Plan Expiry Date
              <p className="text-2xl font-bold  mt-2">March 6, 2025</p>
            </div>
          </div>

          <div
            className={`${isNightMode
              ? "bg-customDarkGray text-white"
              : "bg-white text-gray-700"
              } shadow rounded-lg p-5 mt-6`}
          >
            <p className=" font-medium mb-4">Minute Usage</p>
            <div className="w-full h-3 bg-gray-200 rounded-full">
              <div
                className="absolute top-0 left-0 h-3 bg-pink-500 rounded-full"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <p className=" text-sm mt-2">
              {usedMinutes}/{totalMinutes} minutes used
            </p>
          </div>

          <div
            className={`${isNightMode
              ? "bg-customDarkGray text-white"
              : "bg-white text-gray-700"
              } rounded-xl shadow gap-6 p-4 mt-8`}
          >
            <div
              className={`${isNightMode
                ? "bg-customDarkGray text-white"
                : "bg-gray-50 text-gray-700"
                } sm:flex p-4 rounded-2xl`}
            >
              <div className="w-full space-y-2">
                <h1 className="text-2xl font-bold">Development Cost</h1>
                <h2 className="text-lg text-gray-600">
                  One-time setup and integration fee
                </h2>
              </div>
              <h3 className="sm:flex my-3 items-center justify-end text-3xl font-bold text-blue-600">
                ₹25,000
              </h3>
            </div>

            <div className=" flex flex-col my-3 text-center justify-center ">
              <h1 className="text-3xl  font-bold mb-4">
                Choose The Perfect Plan For Your Business
              </h1>
              <h2 className=" text-xl mb-4">
                Scale your AI calling capabilities with our flexible pricing
                options
              </h2>
            </div>

            <div className="sm:flex justify-around w-full sm:p-6 p-6">
              {plan.map((plan, index) => (
                <div
                  key={index}
                  className={`w-80 p-6 rounded-xl my-5  shadow-xl bg-white text-center ${plan.is_recommended ? "border-blue-500 border-2" : ""
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-gray-800">
                      {plan.name}
                    </span>
                    {plan.is_popular && (
                      <span className="px-3 py-1 text-xs font-bold rounded-full bg-blue-200 text-blue-800">
                        Popular
                      </span>
                    )}
                  </div>

                  <p className="text-4xl font-bold text-left text-gray-700 mt-3">
                    ₹{plan.price}
                    <span className="text-lg text-gray-500">/ month</span>
                  </p>

                  <ul className="mt-6 text-left space-y-3">
                    <li className="text-gray-900 text-lg flex items-center gap-2">
                      <img
                        src="./images/Frame (2).png"
                        alt="check icon"
                        className="w-5 h-5"
                      />
                      Languages: {plan.languages}
                    </li>
                    <li className="text-gray-900 text-lg flex items-center gap-2">
                      <img
                        src="./images/Frame (2).png"
                        alt="check icon"
                        className="w-5 h-5"
                      />
                      Calling Seconds: {plan.calling_seconds}
                    </li>
                  </ul>

                  <Link
                    to={{
                      pathname: "/recharge",
                      state: { price: plan.price }, // Ensure this is correct
                    }}
                    onClick={() =>
                      localStorage.setItem("rechargePrice", plan.price)
                    }
                  >
                    <button className="mt-6 w-full bg-customPink text-white font-medium py-2 rounded-lg hover:bg-customDarkPink">
                      {plan.is_recommended ? "Get Recommended" : "Get Started"}
                    </button>
                  </Link>

                </div>
              ))}
            </div>

            <div className="flex items-center justify-center">
              <div className="bg-white rounded-xl shadow-xl p-6 w-80">
                <div className="flex justify-between items-start">
                  <h3 className="text-2xl font-bold text-gray-800">Enterprise</h3>
                  <span className="text-xs font-bold bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
                    Custom
                  </span>
                </div>
                <h2 className="text-2xl font-bold mt-3">Contact us</h2>
                <ul className="mt-4 space-y-3 text-gray-900 text-lg">
                  <li className="flex items-start gap-2">
                    <img src="./images/Frame (2).png" alt="check" className="h-5 w-5 mt-1" />
                    For enterprise's that need volume based discounts and custom terms.
                  </li>
                  <li className="flex items-start gap-2">
                    <img src="./images/Frame (2).png" alt="check" className="h-5 w-5 mt-1" />
                    Custom Assistants
                  </li>
                  <li className="flex items-start gap-2">
                    <img src="./images/Frame (2).png" alt="check" className="h-5 w-5 mt-1" />
                    Social media configuration
                  </li>
                </ul>
                <button className="mt-6 w-full bg-customPink text-white font-medium py-2 rounded-lg hover:bg-customDarkPink">
                  Let’s Talk
                </button>
              </div>
            </div>


          </div>
        </>
      )}

      {activeButton === "voice" && (
        <div className="mt-4 border  rounded-xl p-7 h-screen ">
          <div className="sm:flex p-4 justify-between">
            <div>
              <h1 className="text-2xl font-bold ">Voice Usage Revenue</h1>
              <h1 className="text-xl mt-2 ">
                Track your voice usage and revenue
              </h1>
            </div>
            <div className="flex gap-6 py-2">
              <button
                className={`${isNightMode
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-700"
                  } flex border justify-center items-center px-4 gap-2  text-lg  rounded-lg`}
              >
                <img src="./images/i (1).png" alt="" className="" />
                Filter
              </button>
              <button
                className={`${isNightMode
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-700"
                  } flex border justify-center items-center px-4 gap-2  text-lg  rounded-lg`}
              >
                <img src="./images/i (3).png" alt="" className="" />
                Last 30 days
              </button>
            </div>
          </div>

          <div
            className={`${isNightMode
              ? "bg-customDarkGray text-white"
              : "bg-gray-100 text-gray-700"
              } border-2 border-dotted flex items-center justify-center rounded-lg`}
          >
            <div className="text-center flex flex-col justify-center items-center my-20">
              <img src="./images/Frame (3).png" alt="" className="  " />
              <h1 className="text-2xl font-bold">
                No Voice Usage Records Found
              </h1>
              <h2 className="text-xl mt-2 ">
                Start making calls to see your usage statistics
              </h2>
              <button className="border flex text-white text-lg bg-customPink  hover:bg-customDarkPink rounded-lg px-5 p-3 items-center gap-2 mt-6">
                <img src="./images/svg.png" alt="" />
                Make Your First Call
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Billing;
