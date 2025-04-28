import { useState, useEffect } from "react";
import { useNightMode } from "../contexts/NightModeContext";
import axios from "../helper/axios";
import CallDetails from "./CallDetails";
import Swal from "sweetalert2";
import Loader from "../components/Loader";
import ProfileSettings from "./Profile";


const CallLog = () => {
  const [showForm, setShowForm] = useState(false);
  const { isNightMode, toggleNightMode } = useNightMode();
  const [dashboard, setDashboard] = useState({});
  const [show, setShow] = useState(false);
  const [selectedExecution, setSelectedExecution] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setloading] = useState(false);
  const [load, setLoad] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [profileData, setProfileData] = useState({});
  const [showProfile, setShowProfile] = useState(false);

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

  const token = localStorage.getItem("token");

  const payloadBase64 = token.split(".")[1];
  const payloadDecoded = JSON.parse(atob(payloadBase64));
  const user_id = payloadDecoded.user_id;

  const handleShowDetails = (execution) => {
    setSelectedExecution(execution);
    setShow(!show);
  };

  const agentDashboard = async () => {
    try {
      const response = await axios.get("/api/api/agent/dashboard_data/", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setDashboard(response.data);
      // console.log(response.data);
      setLoad(false);
    } catch (e) {
      console.error(
        "Error fetching dashboard data:",
        e.response?.data || e.message
      );
    }
  };

  const handleCall = async () => {
    if (!phoneNumber.trim()) {
     
      return;
    }
    setloading(true);

    try {
      await axios.post(
        `/api/make_call?recipient_phone_number=${phoneNumber}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      Swal.fire({
        title: "Call Created",
        text: "Call initiated successfully!",
        icon: "success",
       
      });
      setPhoneNumber("");
      setShowForm(false);
    } catch (err) {
      Swal.fire({
        title: "Error",
        text:
          err.response?.data?.detail ||
          "An error occurred while making the call.",
        icon: "error",
      });
    } finally {
      setloading(false);
    }
  };

  useEffect(() => {
    agentDashboard();
    getMyProfile();
  }, []);

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    return `${minutes}m ${remainingSeconds}s`;
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-700";
      case "failed":
        return "bg-red-100 text-red-700";
      case "busy":
      case "no-answer":
      case "stopped":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getCTA = (execution) => {
    const { status, transcript, summary } = execution;
    if (status === "completed" && transcript) {
      if (transcript.includes("schedule") || summary?.includes("schedule")) {
        return {
          text: "Meeting Scheduled",
          color: "bg-blue-100 text-blue-700",
        };
      }
      return {
        text: "Conversation Ended",
        color: "bg-green-100 text-green-700",
      };
    } else if (status === "busy" || status === "no-answer") {
      return { text: "No Response", color: "bg-gray-100 text-gray-700" };
    } else if (status === "failed" || status === "stopped") {
      return { text: "Call Failed", color: "bg-red-100 text-red-700" };
    }
    return { text: "Pending", color: "bg-gray-100 text-gray-700" };
  };

  const getName = (execution) => {
    const { context_details, transcript } = execution;
    if (context_details?.recipient_data) {
      const { first_name, last_name, variable1, variable2 } =
        context_details.recipient_data;
      return (
        `${first_name || variable1 || ""} ${last_name || variable2 || ""
          }`.trim() || "Unknown"
      );
    }
    if (transcript) {
      const userLines = transcript
        .split("\n")
        .filter((line) => line.startsWith("user:"));
      for (const line of userLines) {
        const match = line.match(/i am (\w+)/i);
        if (match) return match[1];
      }
    }
    return "Unknown";
  };

  // **Search Filter Implementation**
  const filteredExecutions = dashboard?.executions ? dashboard.executions.filter((execution) => {
    const id = execution.id.toLowerCase();
    const name = getName(execution).toLowerCase();
    const status = execution.status.toLowerCase();
    const phoneNumber = execution.telephony_data?.to_number || "";

    return (
      id.includes(searchQuery.toLowerCase()) ||
      name.includes(searchQuery.toLowerCase()) ||
      status.includes(searchQuery.toLowerCase()) ||
      phoneNumber.includes(searchQuery.toLowerCase())
    );
  }) : [];

  const handleCancel = () => {
    setShowProfile(!showProfile); // Toggle profile visibility
  };


  return (
    <div
      className={`${isNightMode ? "bg-black text-white" : "bg-gray-50 text-gray-700"
        } p-4 md:p-6 lg:p-9 h-screen md:ml-64`}
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
          } flex justify-between items-center rounded-lg shadow-sm p-4 text-2xl font-bold mt-10`}
      >
        Call Logs
        <button
          onClick={() => setShowForm(true)}
          className="flex text-lg text-white bg-customPink rounded-md p-2 mr-4 font-medium"
        >
          <img src="./images/i.png" alt="" className="mr-2 ml-2 mt-1" />
          Call Numbers
        </button>
      </div>

      {showForm && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50 z-[50]">
          <div
            className={`${isNightMode ? "bg-black text-white" : "bg-gray-50 text-gray-700"
              } border w-[100] sm:w-[35%] py-8 shadow-lg rounded-xl p-6 mt-6`}
          >
            <h2 className="text-2xl flex justify-between font-bold mb-7">
              Call Numbers
              <button onClick={() => setShowForm(false)}>
                <img src="./images/button.png" alt="" />
              </button>
            </h2>

            <form className="">
              <div className="mb-4 w-full">
                <label className="block font-medium mb-2">Number</label>
                <input
                  maxLength={10}
                  type="number"
                  placeholder="Enter a number"
                  inputMode="numeric"
                  value={phoneNumber}
                  required
                  onChange={(e) => {
                    if (e.target.value.length <= 10) {
                      setPhoneNumber(e.target.value);
                    }
                  }}
                  className="w-full border rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
              </div>


              <div className="flex gap-5 justify-end">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-200 text-black px-5 py-3 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className={`bg-customPink text-white px-20 py-3 rounded-lg ${loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : " hover:bg-customDarkPink"
                    }`}
                  onClick={handleCall}
                  disabled={loading}
                >
                  {loading ? "Calling..." : "Make Call"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {show && selectedExecution && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <CallDetails
            handleShowDetails={() => handleShowDetails(null)} // Pass null to reset
            execution={selectedExecution} // Pass the selected execution data
          />
        </div>
      )}
      {load && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md z-30">
          <Loader />
        </div>
      )}

      <div className="flex justify-between mt-10">
        <div className="w-full sm:w-[30%]">
          <div
            className={`${isNightMode ? "bg-gray-600 text-white" : "bg-white text-gray-700"
              } mt-3 p-2 mb-3 border rounded-lg flex `}
          >
            <img src="./images/Frame.png" alt="" className="w-5 h-5 mt-1" />
            <input
              type="text"
              placeholder="Search by ID, Name, Status, or Number..."
              className="ml-4 outline-none bg-transparent text-lg w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        {/* <div
          className={`${
            isNightMode ? "bg-black text-white" : "bg-gray-50 text-gray-700"
          } flex p-2 gap-5 items-center text-lg font-medium`}
        >
          <button className="flex border p-2 pr-4 rounded-lg">
            <img src="./svg.webp" alt="" className="p-2" />
            Filter
          </button>
          <button className="flex border p-2 pr-4 rounded-lg">
            <img src="./svg (1).webp" alt="" className="p-2" />
            Export
          </button>
        </div> */}
      </div>

      <div className="mt-6 rounded-lg w-full border">
        <div
          className={`${isNightMode ? "bg-gray-600 text-white" : "bg-white text-gray-700"
            } rounded-lg overflow-x-auto`}
        >
          <table className="w-full text-left">
            <thead>
              <tr
                className={`${isNightMode
                  ? "bg-customDarkGray text-white"
                  : "bg-gray-50 text-gray-700"
                  } border-b`}
              >
                <th className="p-4">ID</th>
                <th className="p-4">Name</th>
                <th className="p-4">Status</th>
                <th className="p-4">Number</th>
                <th className="p-4">Cost</th>
                <th className="p-4">Duration</th>
                <th className="p-4">CTA</th>
                <th className="p-4">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {filteredExecutions.map((execution) => {
                const cta = getCTA(execution);
                const costItem = dashboard.extra_charge_breakdown?.find(
                  (item) => item.execution_id === execution.id
                );
                const cost =
                  costItem?.total_cost_with_extra?.toFixed(2) ||
                  execution.total_cost.toFixed(2) ||
                  "N/A";

                return (
                  <tr key={execution.id} className="text-sm border-t">
                    <td className="p-4 cursor-pointer hover:underline" onClick={() => handleShowDetails(execution)}
                    >
                      {execution.id.slice(0, 8)}</td>

                    <td className="p-4">{getName(execution)}</td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded-md text-xs font-medium ${getStatusColor(
                          execution.status
                        )}`}
                      >
                        {execution.status}
                      </span>
                    </td>
                    <td className="p-4">{execution.telephony_data?.to_number}</td>
                    <td className="p-4">{execution.total_cost.toFixed(2)}</td>
                    <td className="p-4">
                      {formatDuration(execution.conversation_duration)}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded-md text-xs font-medium ${cta.color}`}
                      >
                        {cta.text}
                      </span>
                    </td>
                    <td className="p-4">
                      {new Date(execution.created_at).toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CallLog;
