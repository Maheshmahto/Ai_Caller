import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useNightMode } from "../contexts/NightModeContext";
import axios from "../helper/axios";
import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";
import ProfileSettings from "./Profile";
import Swal from "sweetalert2";

const Dashboard = () => {
  const [activeButton, setActiveButton] = useState(null);
  const [dropdownState, setDropdownState] = useState({
    CallVolume: false,
    SuccessRate: false,
  });
  const [dashboard, setDashboard] = useState([]);
  const { isNightMode, toggleNightMode } = useNightMode();
  const token = localStorage.getItem("token");
  // console.log(token)
  const [load, setLoad] = useState(true);
  const navigate = useNavigate();
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
      console.log(response.data);
    } catch (e) {
      console.log(e);
    }
  };

  const [profileData, setProfileData] = useState({});
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
        title: `${e.data.message}`,
        icon: "error",
      });
    }
  };

  const agentDashboard = async () => {
    // console.log(token);

    try {
      const response = await axios.get("/api/api/agent/dashboard_data/", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setDashboard(response.data);
      setLoad(false);
    } catch (e) {
      console.log(e);
      console.error(
        "Error fetching dashboard data:",
        e.response?.data || e.message
      );
    }
  };
  useEffect(() => {
    agentDashboard();
    // getBalance();
    getUserBalance();
    getMyProfile();
  }, []);

  const options = ["Hours", "Minutes", "Seconds"];
  const buttons = ["Day", "Week", "Month", "Year"];

  const handleClick = (button) => {
    setActiveButton(button);
  };

  const toggleDropdown = (dropdown) => {
    setDropdownState((prevState) => ({
      ...prevState,
      [dropdown]: !prevState[dropdown],
    }));
  };
  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    return `${minutes}m ${remainingSeconds}s`;
  };

  const [showProfile, setShowProfile] = useState(false);
  const handleCancel = () => {
    setShowProfile(!showProfile); // Toggle profile visibility
  };

  const ProfileRef = useRef(null);
  const profileToggleRef = useRef(null);
  // const handleClickOutside = (event) => {
  //   if (ProfileRef.current && !ProfileRef.current.contains(event.target)) {
  //     setShowProfile(false);
  //   }
  // };
  // const handleClickOutside = (event) => {
  //   // Don't close the profile if clicking on the profile toggle button
  //   if (
  //     profileToggleRef.current &&
  //     profileToggleRef.current.contains(event.target)
  //   ) {
  //     return;
  //   }

  //   // Close the profile if clicking outside the profile settings and not on the toggle button
  //   if (ProfileRef.current && !ProfileRef.current.contains(event.target)) {
  //     setShowProfile(false);
  //   }
  // };
  const handleClickOutside = (event) => {
    // Don't close the profile if clicking on the profile toggle button
    if (
      profileToggleRef.current &&
      profileToggleRef.current.contains(event.target)
    ) {
      return;
    }

    // Close the profile if clicking outside the profile settings and not on the toggle button
    if (ProfileRef.current && !ProfileRef.current.contains(event.target)) {
      setShowProfile(false);
    }
  };
  useEffect(() => {
    // Add event listener when the component mounts
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []); // Empty dependency array ensures this runs only once

  return (
    <div
      className={`${
        isNightMode ? "bg-black text-white" : "bg-gray-50 text-gray-700"
      } p-4 md:p-6 lg:p-9`}
    >
      <div className="flex flex-col md:flex-row justify-between">
        <div className="font-bold text-2xl md:text-3xl">
          Dashboard Overview
          <p className="text-lg md:text-xl font-semibold text-gray-400">
            Monitor your AI calling performance
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center mt-4 md:mt-0 space-y-4 md:space-y-0 md:space-x-4">
          <button
            className="flex items-center bg-gray-100 rounded-md p-2 text-lg font-semibold text-gray-600"
            onClick={toggleNightMode}
          >
            {isNightMode ? (
              <>
                Light mode{" "}
                <img src="./images/Light mode.png" alt="" className="ml-2" />
              </>
            ) : (
              <>
                Night mode
                <img src="./images/material-symbols-light_dark-mode-rounded.png" alt="" className="ml-2" />
              </>
            )}
          </button>

          <div
            className={`${
              isNightMode ? "bg-gray-600 text-white" : "bg-white text-gray-700"
            } border rounded-lg flex items-center w-full md:w-auto`}
          >
            <img
              src="./images/Frame.png"
              alt=""
              className="w-5 h-5 ml-3"
            />
            <input
              type="text"
              placeholder="Search..."
              className="ml-4 p-2 mr-16 outline-none bg-transparent w-full md:w-48"
            />
          </div>
          <div
            ref={profileToggleRef}
            className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center text-white text-3xl font-bold cursor-pointer"
            onClick={handleCancel}
          >
            {profileData?.username?.slice(0, 1)}
          </div>
          {/* <img src="./images/Rectangle.webp" alt="" className="w-10 h-10 cursor-pointer" onClick={handleCancel} /> */}
        </div>
      </div>
      {showProfile && (
        <div ref={ProfileRef}>
          <ProfileSettings handleCancel={handleCancel}></ProfileSettings>
        </div>
      )}

      <div
        className={`${
          isNightMode ? "bg-black text-white" : "bg-white text-gray-700"
        } shadow-sm rounded-md mt-6 text-lg p-4 flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4`}
      >
        {/* {buttons.map((button) => (
          <button
            key={button}
            className={`w-full md:w-20 p-2 rounded-md ${
              activeButton === button ? "bg-pink-600 text-white" : ""
            }`}
            onClick={() => handleClick(button)}
          >
            {button}
          </button>
        ))} */}
        <div className="flex items-center justify-end w-full mt-4 md:mt-0">
          <h2 className="text-pink-500 bg-white p-2 rounded-lg font-medium">
            Available Balance : {balance}
          </h2>
          <Link to={"/recharge"}>
            <button className="ml-4">Recharge Now</button>
          </Link>
        </div>
      </div>
      {load && (
        // <div className="w-[80%] fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md z-50">
        //   <Loader />
        // </div>
        <div className="w-[82%] fixed inset-y-0 right-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md z-50">
          <Loader />
        </div>
      )}

      <div className="w-full mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          className={`${
            isNightMode
              ? "bg-customDarkGray text-white"
              : "bg-white text-gray-800"
          } shadow-sm text-end text-lg p-6 rounded-lg `}
        >
          <img src="./images/div.png" alt="" className="absolute" />
          <h1 className="text-3xl font-bold mt-12 flex">
            {dashboard.total_calls}
          </h1>
          <h2 className="text-gray-500 flex">Total Calls</h2>
        </div>

        <div
          className={`${
            isNightMode
              ? "bg-customDarkGray text-white"
              : "bg-white text-gray-800"
          } shadow-sm text-end text-lg p-6 rounded-lg  `}
        >
          <img src="./images/div (1).png" alt="" className="absolute" />
          <h1 className="text-3xl font-bold mt-12 flex">
            {dashboard.successful_calls}
          </h1>
          <h2 className="text-gray-500 flex">Successful Calls</h2>
        </div>

        <div
          className={`${
            isNightMode
              ? "bg-customDarkGray text-white"
              : "bg-white text-gray-800"
          } shadow-sm text-end text-lg p-6 rounded-lg `}
        >
          <img src="./images/div (2).png" alt="" className="absolute" />
          <h1 className="text-3xl font-bold mt-12 flex">
            {dashboard.total_duration_minutes} Min
          </h1>
          <h2 className="text-gray-500 flex">Avg. Call Duration</h2>
        </div>

        <div
          className={`${
            isNightMode
              ? "bg-customDarkGray text-white"
              : "bg-white text-gray-800"
          } shadow-sm text-end text-lg p-6 rounded-lg`}
        >
          <img src="./images/div (3).png" alt="" className="absolute" />
          <h1 className="text-3xl font-bold mt-12 flex">
            {dashboard.total_call_cost_with_extra_charge}
          </h1>
          <h2 className="text-gray-500 flex">Total Cost</h2>
        </div>
      </div>
      {/* col images */}
      {/* <div className="flex flex-col md:flex-row mt-6 gap-6">
        <div
          className={`${
            isNightMode
              ? "bg-customDarkGray text-white"
              : "bg-white text-gray-800"
          } p-4 w-full font-bold text-lg rounded-lg`}
        >
          Call Volume Trends
          <div className="relative flex justify-end -mt-4 text-sm">
            <button onClick={() => toggleDropdown("CallVolume")}>
              <img src="./images/Frame (1).webp" alt="" />
            </button>
            {dropdownState.CallVolume && (
              <div className="absolute text-end left-[85%] mt-2 w-30 bg-white border rounded-lg shadow-md">
                {options.map((option) => (
                  <button
                    key={option}
                    className="block w-full text-left px-2 py-1 text-gray-700 hover:bg-blue-100 transition"
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div
            className={`${
              isNightMode ? "bg-black text-white" : "bg-gray-50 text-gray-800"
            } rounded-lg p-6 m-6`}
          >
            <img
              src="./images/call-volume-trends 2.webp"
              alt=""
              className="w-full mt-5 p-4"
            />
          </div>
        </div>

        <div
          className={`${
            isNightMode
              ? "bg-customDarkGray text-white"
              : "bg-white text-gray-800"
          } p-4 w-full font-bold text-lg rounded-lg`}
        >
          Success Rate Analysis
          <div className="relative flex justify-end -mt-4 text-sm">
            <button onClick={() => toggleDropdown("SuccessRate")}>
              <img src="./images/Frame (1).webp" alt="" />
            </button>
            {dropdownState.SuccessRate && (
              <div className="absolute text-end left-[85%] mt-2 w-30 bg-white border rounded-lg shadow-md">
                {options.map((option) => (
                  <button
                    key={option}
                    className="block w-full text-left px-2 py-1 text-gray-700 hover:bg-blue-100 transition"
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div
            className={`${
              isNightMode ? "bg-black text-white" : "bg-gray-50 text-gray-800"
            } rounded-lg p-6 m-6`}
          >
            <img
              src={isNightMode ? "./images/image 23.webp" : "/CALL 2.webp"}
              alt="Success Rate"
              className="w-full mt-5 p-4"
            />
          </div>
        </div>
      </div> */}

      {/* Recent Calls Section */}
      <div
        className={`${
          isNightMode
            ? "bg-customDarkGray text-white"
            : "bg-white text-gray-800"
        } my-6 mt-6 rounded-lg w-full`}
      >
        <div className="flex justify-between items-center border-b p-6">
          <h2 className="text-lg font-semibold">Recent Calls</h2>
          <button
            onClick={() => navigate("/call-logs")}
            className="text-blue-500 font-medium hover:underline"
          >
            View All
          </button>
        </div>

        <div
          className={`${
            isNightMode ? "bg-gray-700 text-white" : "bg-white text-gray-500"
          } p-4 overflow-x-auto`}
        >
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="pb-2">Phone Number</th>
                <th className="pb-2">Campaign</th>
                <th className="pb-2">Duration</th>
                <th className="pb-2">Status</th>
                <th className="pb-2">Date</th>
              </tr>
            </thead>

            <tbody>
              {dashboard.executions?.slice(0, 10).map((execution) => (
                <tr key={execution.id} className="text-sm border-t">
                  <td className="py-3">
                    {execution.telephony_data?.to_number || "N/A"}
                  </td>
                  <td>
                    {execution.batch_id
                      ? `Batch ${execution.batch_id.slice(0, 8)}`
                      : "Single Call"}
                  </td>
                  <td>
                    {execution.conversation_duration
                      ? formatDuration(execution.conversation_duration)
                      : "0s"}
                  </td>
                  <td>
                    <span
                      className={`px-2 py-1 rounded-md text-xs font-medium ${
                        execution.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : execution.status === "busy" ||
                            execution.status === "no-answer"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {execution.status}
                    </span>
                  </td>
                  <td>{new Date(execution.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
