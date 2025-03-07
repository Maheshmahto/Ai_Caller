import { useEffect, useState } from "react";
import { useNightMode } from "../contexts/NightModeContext";
import Loader from "../components/Loader";
import axios from "../helper/axios";
import { Link } from "react-router-dom";

const Billing = () => {
  const [activeButton, setActiveButton] = useState("billing");
  const usedMinutes = 0;
  const totalMinutes = 30;
  const progressPercentage = (usedMinutes / totalMinutes) * 100;
  const [showForm, setShowForm] = useState(false);
  const { isNightMode ,toggleNightMode } = useNightMode();
  const [load, setLoad] = useState(true);
  const [plan, setPlans] = useState([]);
  const token = localStorage.getItem("authToken");

  const subPlans = async () => {
    try {
      const response = await axios.get(
        "http://192.168.29.83:8001/api/subscription-plans"
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
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    subPlans();
    getUserBalance();
  }, []);
  return (
    <div
      className={`${
        isNightMode ? "bg-black text-white" : "bg-gray-50 text-gray-700"
      } p-9 min-h-screen`}
    >
      <div className="flex justify-between  ">
        <div className=" font-bold text-3xl">
          Dashboard Overview
          <p className="text-xl font-semibold text-gray-400 ">
            Monitor your AI calling performance
          </p>
        </div>
        {/* <div className="flex">
          <div
            className={`${
              isNightMode ? "bg-gray-600 text-white" : "bg-white text-gray-700"
            } ml-3 mt-2 mb-3 border rounded-lg flex`}
          >
            <img src="/Vector (5).webp" alt="" className="w-5 h-5 mt-3 ml-3" />
            <input
              type="text"
              placeholder="Search..."
              className="mr-16 ml-4 outline-none bg-transparent"
            />
          </div>
          <img src="/Rectangle.webp" alt="" className="w-10 h-10 mt-2 ml-8 " />
        </div> */}
         <div className="flex flex-col md:flex-row items-center mt-4 md:mt-0 space-y-4 md:space-y-0 md:space-x-4">
          <button
            className="flex items-center bg-gray-100 rounded-md p-2 text-lg font-semibold text-gray-600"
            onClick={toggleNightMode}
          >
            {isNightMode ? (
              <>
                Light mode <img src="/Light mode.png" alt="" className="ml-2" />
              </>
            ) : (
              <>
                Night mode
                <img src="/Vector (4).webp" alt="" className="ml-2" />
              </>
            )}
          </button>

          <div
            className={`${
              isNightMode ? "bg-gray-600 text-white" : "bg-white text-gray-700"
            } border rounded-lg flex items-center w-full md:w-auto`}
          >
            <img src="/Vector (5).webp" alt="" className="w-5 h-5 ml-3" />
            <input
              type="text"
              placeholder="Search..."
              className="ml-4 p-2 mr-16 outline-none bg-transparent w-full md:w-48"
            />
          </div>
          <img src="/Rectangle.webp" alt="" className="w-10 h-10" />
        </div>
      </div>

      <div
        className={`${
          isNightMode ? "bg-black text-white" : "bg-white text-gray-700"
        } flex shadow rounded-lg mt-10 p-4  gap-5`}
      >
        
        <button
          className={`p-3 ml-5 rounded-lg text-lg ${
            activeButton === "billing" ? "bg-customPink text-white" : ""
          }`}
          onClick={() => setActiveButton("billing")}
        >
          Billing Summary
        </button>

        <button
          className={`p-3 rounded-lg text-lg ${
            activeButton === "voice" ? "bg-customPink text-white" : ""
          }`}
          onClick={() => setActiveButton("voice")}
        >
          Voice Usage Revenue
        </button>
      </div>

      {activeButton === "billing" && (
        <>
          <div className="mt-6 gap-6 flex justify-between relative">
            <div
              className={`${
                isNightMode
                  ? "bg-customDarkGray text-white"
                  : "bg-white text-gray-700"
              } w-full shadow rounded-lg h-40 p-5`}
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

                {showForm && (
                  <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50">
                    <div
                      className={`${
                        isNightMode
                          ? "bg-customDarkGray text-white"
                          : "bg-gray-50 text-gray-700"
                      } border w-[30%] py-8 shadow-lg rounded-xl p-6 mt-6`}
                    >
                      <h2 className="text-2xl flex justify-between font-bold mb-7">
                        Your Agency Balance
                        <button
                          onClick={() => {
                            setShowForm(false);
                            document.body.style.overflow = "auto";
                          }}
                        >
                          <img src="/Frame (4).webp" alt="" />
                        </button>
                      </h2>

                      <form>
                        <div className="mb-4">
                          <label className="block font-medium mb-2">
                            Select Amount
                          </label>
                          <input
                            type="number"
                            placeholder="Amount"
                            className="w-full border rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                          />
                        </div>
                      </form>

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
                        >
                          Add to my Balance
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div
              className={`${
                isNightMode
                  ? "bg-customDarkGray text-white"
                  : "bg-white text-gray-700"
              } w-full shadow rounded-lg text-lg  p-5`}
            >
              Monthly Plan Name
              <p className="text-2xl font-bold mt-2">Starter</p>
              <p className="text-green-700 bg-green-100 text-sm w-fit rounded-3xl p-2 mt-3 pl-4 pr-4">
                Active
              </p>
            </div>
            <div
              className={`${
                isNightMode
                  ? "bg-customDarkGray text-white"
                  : "bg-white text-gray-700"
              } rounded-lg w-full shadow text-lg p-5`}
            >
              Plan Expiry Date
              <p className="text-2xl font-bold  mt-2">March 6, 2025</p>
            </div>
          </div>

          <div
            className={`${
              isNightMode
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
            className={`${
              isNightMode
                ? "bg-customDarkGray text-white"
                : "bg-white text-gray-700"
            } rounded-xl shadow gap-6 p-4 mt-8`}
          >
            <div
              className={`${
                isNightMode
                  ? "bg-customDarkGray text-white"
                  : "bg-gray-50 text-gray-700"
              } flex p-4 rounded-2xl`}
            >
              <div className="w-full space-y-2">
                <h1 className="text-2xl font-bold">Development Cost</h1>
                <h2 className="text-lg text-gray-600">
                  One-time setup and integration fee
                </h2>
              </div>
              <h3 className="flex items-center justify-end text-3xl font-bold text-blue-600">
                ₹25,000
              </h3>
            </div>

            <div className=" flex flex-col items-center justify-center ">
              <h1 className="text-3xl  font-bold mb-4">
                Choose The Perfect Plan For Your Business
              </h1>
              <h2 className=" text-xl mb-4">
                Scale your AI calling capabilities with our flexible pricing
                options
              </h2>
            </div>

            <div className="flex justify-around w-full p-6">
              {plan.map((plan, index) => (
                <div
                  key={index}
                  className={`w-80 p-6 rounded-xl shadow-xl bg-white text-center ${
                    plan.is_recommended ? "border-blue-500 border-2" : ""
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
                        src="/Frame (2).webp"
                        alt="check icon"
                        className="w-5 h-5"
                      />
                      Languages: {plan.languages}
                    </li>
                    <li className="text-gray-900 text-lg flex items-center gap-2">
                      <img
                        src="/Frame (2).webp"
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

            <div className="rounded-lg mt-9 p-8 ">
              <div className="">
                <h1 className="text-3xl font-bold">Enterprise Plan</h1>
                <h2 className="text-xl mt-2 ">
                  Custom solutions for large organizations
                </h2>
                <div className="flex justify-between">
                  <ul className="text-lg  mt-4">
                    <li className="flex items-center gap-2">
                    
                      <img src="/Frame (2).webp" alt="" />
                      Unlimited Sub Accounts
                    </li>
                    <li className="flex items-center gap-2">
                  
                      <img src="/Frame (2).webp" alt="" />
                      Unlimited Assistants
                    </li>
                    <li className="flex items-center gap-2">
                      <img src="/Frame (2).webp" alt="" />
                      Unlimited Minutes
                    </li>
                  </ul>
                  <ul className="">
                    <li className="text-3xl font-bold">Custom Pricing</li>
                    <li className="text-center border mx-8 py-3 mt-4 rounded-lg">
                      Contact Sales
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {activeButton === "voice" && (
        <div className="mt-4 border rounded-xl p-7 h-screen ">
          <div className="flex p-4 justify-between">
            <div>
              <h1 className="text-2xl font-bold ">Voice Usage Revenue</h1>
              <h1 className="text-xl mt-2 ">
                Track your voice usage and revenue
              </h1>
            </div>
            <div className=" flex gap-6 py-2">
              <button
                className={`${
                  isNightMode
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-700"
                } flex border justify-center items-center px-4 gap-2  text-lg  rounded-lg`}
              >
                <img src="/svg.webp" alt="" className="" />
                Filter
              </button>
              <button
                className={`${
                  isNightMode
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-700"
                } flex border justify-center items-center px-4 gap-2  text-lg  rounded-lg`}
              >
                <img src="/svg (2).webp" alt="" className="" />
                Last 30 days
              </button>
            </div>
          </div>

          <div
            className={`${
              isNightMode
                ? "bg-customDarkGray text-white"
                : "bg-gray-100 text-gray-700"
            } border-2 border-dotted flex items-center justify-center rounded-lg`}
          >
            <div className="text-center flex flex-col justify-center items-center my-20">
              <img src="/Frame (3).webp" alt="" className="  " />
              <h1 className="text-2xl font-bold">
                No Voice Usage Records Found
              </h1>
              <h2 className="text-xl mt-2 ">
                Start making calls to see your usage statistics
              </h2>
              <button className="border flex text-white text-lg bg-customPink  hover:bg-customDarkPink rounded-lg px-5 p-3 items-center gap-2 mt-6">
                <img src="/svg (3).webp" alt="" />
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
