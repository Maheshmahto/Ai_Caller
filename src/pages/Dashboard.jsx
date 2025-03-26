import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useNightMode } from "../contexts/NightModeContext";
import axios from "../helper/axios";
import Loader from "../components/Loader";
import { useNavigate } from 'react-router-dom';
import ProfileSettings from "./Profile";
import Swal from "sweetalert2";

const Dashboard = () => {
  const [activeButton, setActiveButton] = useState(null);
  const [dropdownState, setDropdownState] = useState({
    CallVolume: false,
    SuccessRate: false,
  });
  const [dashboard, setDashboard] = useState({ executions: [] }); // ✅ Fix: Default state to prevent errors
  const [balance, setBalance] = useState(null);
  const [load, setLoad] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [profileData, setProfileData] = useState({});
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();
  const { isNightMode, toggleNightMode } = useNightMode();
  const token = localStorage.getItem("token");

  const ProfileRef = useRef(null);
  const profileToggleRef = useRef(null);

  /** ✅ Function to get user balance */
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
      console.error("Error fetching balance:", e.response?.data || e.message);
    }
  };

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

  /** ✅ Function to get dashboard data */
  const agentDashboard = async () => {
    // console.log(token);
    try {
      const response = await axios.get("/api/api/agent/dashboard_data/", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setDashboard(response.data || { executions: [] }); // ✅ Fix: Ensure executions is always an array
      setLoad(false);
    } catch (e) {
      console.log(e);
      console.error("Error fetching dashboard data:", e.response?.data || e.message);
      setLoad(false);
    }
  };

  /** ✅ Fetch data on component mount */
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

  /** ✅ Handle search input */
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  /** ✅ Filter calls based on search */
  const filteredExecutions = dashboard.executions?.filter((execution) => {
    const phoneNumber = execution.telephony_data?.to_number || "";
    return phoneNumber.includes(searchTerm);
  }) || [];

  /** ✅ Close profile popup on outside click */
  const handleClickOutside = (event) => {
    if (
      profileToggleRef.current &&
      profileToggleRef.current.contains(event.target)
    ) {
      return;
    }
    if (ProfileRef.current && !ProfileRef.current.contains(event.target)) {
      setShowProfile(false);
    }
  };

  useEffect(() => {
    // Add event listener when the component mounts
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`${isNightMode ? "bg-black text-white" : "bg-gray-50 text-gray-700"} p-4 md:p-6 lg:p-9`}>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between">
        <div className="font-bold text-2xl md:text-3xl">
          Dashboard Overview
          <p className="text-lg md:text-xl font-semibold text-gray-400">
            Monitor your AI calling performance
          </p>
        </div>

        {/* Search & Night Mode */}
        <div className="flex flex-col md:flex-row items-center mt-4 md:mt-0 space-y-4 md:space-y-0 md:space-x-4">
          <button className="flex items-center bg-gray-100 rounded-md p-2 text-lg font-semibold text-gray-600" onClick={toggleNightMode}>
            {isNightMode ? (
              <>
              Light mode{" "} 
              <img src="./images/Light mode.png" alt="" className="ml-2"/>
              </>
            ) : (
              <>
            Night mode
              <img src="./images/material-symbols-light_dark-mode-rounded.png" alt="" className="ml-2"/>
              </>
            )}
          </button>
          <div
             className={`${
               isNightMode ? "bg-gray-600 text-white" : "bg-white text-gray-700"
             } border rounded-lg flex items-center w-full md:w-auto`}
           >
             <img src="./images/Frame.png" alt="" className="w-5 h-5 ml-3" />
             <input
               type="text"
               placeholder="Search..."
               className="ml-4 p-2 mr-16 outline-none bg-transparent w-full md:w-48"
               value={searchTerm}
               onChange={handleSearchChange} 
             />
         </div>

          {/* Profile Icon */}
          <div
            ref={profileToggleRef} 
            className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center text-white text-3xl font-bold cursor-pointer" onClick={() => setShowProfile(!showProfile)}>
            {profileData?.username?.charAt(0)}
          </div>
        </div>
      </div>

      {showProfile && (
       <div ref={ProfileRef}><ProfileSettings handleCancel={() => setShowProfile(false)} /></div>
      )}

      {/* Balance Section */}
      <div 
        className={`${isNightMode ? "bg-black text-white" : "bg-white text-gray-700"} shadow-sm rounded-md mt-6 text-lg p-4 flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4`}>
        <div className="flex items-center justify-end w-full mt-4 md:mt-0">
          <h2 className="text-pink-500 bg-white p-2 rounded-lg font-medium">Available Balance : {balance}</h2>
          <Link to="/recharge"><button className="ml-4">Recharge Now</button></Link>
        </div>
      </div>

      {/* Loader */}
      {load && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md z-50"><Loader /></div>
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

      {/* Recent Calls Section */}
      <div
        className={`${isNightMode ? "bg-customDarkGray text-white" : "bg-white text-gray-800"} my-6 mt-6 rounded-lg w-full`}>
        <div className="flex justify-between items-center border-b p-6">
          <h2 className="text-lg font-semibold">Recent Calls</h2>
          <button onClick={() => navigate("/call-logs")} className="text-blue-500 font-medium hover:underline">View All</button>
        </div>

        <div className="p-2 overflow-x-auto">
          {filteredExecutions.length > 0 ? (
            <table className="w-full text-left">
              <thead><tr className="border-b "><th className="p-3 pb-4">Phone Number</th><th className="p-3 pb-4">Campaign</th><th className="p-3 pb-4">Duration</th><th className="p-3 pb-4">Status</th><th className="p-3 pb-4">Date & Time</th></tr></thead>
              <tbody>
                {filteredExecutions.slice(0, 10).map((execution) => (
                  <tr key={execution.id} className="text-sm border-t">
                    <td className="p-4">{execution.telephony_data?.to_number || "N/A"}</td>
                    <td className="p-4">{execution.batch_id ? `Batch ${execution.batch_id.slice(0, 8)}` : "Single Call"}</td>
                    <td className="p-4">{execution.conversation_duration ? `${Math.floor(execution.conversation_duration / 60)}m ${execution.conversation_duration % 60}s` : "0s"}</td>
                    <td className="p-4">{execution.status}</td>
                    <td className="p-4">{new Date(execution.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : <p className="text-center text-gray-500">No recent calls found.</p>}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
