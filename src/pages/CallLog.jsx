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
      Swal.fire({
        title: "Error",
        text: "Please enter a valid phone number.",
        icon: "error",
      });
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



  return (
    <div
      className={`${isNightMode ? "bg-black text-white" : "bg-gray-50 text-gray-700"
        } p-9 min-h-screen`}
    >
      {/* <div className="flex justify-between">
        <div className="font-bold text-3xl">
          CallLogs Overview
          <p className="text-xl font-semibold text-gray-400">
            Monitor your AI calling performance
          </p>
        </div>
        <div className="flex">
          <div
            className={`${
              isNightMode ? "bg-gray-600 text-white" : "bg-white text-gray-700"
            } ml-3 mt-2 mb-3 border rounded-lg flex`}
          >
            <img src="./Vector (5).webp" alt="" className="w-5 h-5 mt-3 ml-3" />
            <input
              type="text"
              placeholder="Search..."
              className="mr-16 ml-4 outline-none bg-transparent"
            />
          </div>
          <img src="./Rectangle.webp" alt="" className="w-10 h-10 mt-2 ml-8" />
        </div>
      </div> */}
      <div className="flex flex-col md:flex-row justify-between">
        <div className="font-bold text-2xl md:text-3xl">
          Dashboard Overview
          <p className="text-lg md:text-xl font-semibold text-gray-400">
            Monitor your AI calling performance
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center mt-4 md:mt-0 space-y-4 md:space-y-0 md:space-x-10">
          <button
            className="flex items-center bg-gray-100 rounded-md p-2 text-lg font-semibold text-gray-600"
            onClick={toggleNightMode}
          >
            {isNightMode ? (
              <>
                Light mode <img src="./images/Light mode.png" alt="" className="ml-2" />
              </>
            ) : (
              <>
                Night mode
                <img src="./images/material-symbols-light_dark-mode-rounded.png" alt="" className="ml-2" />
              </>
            )}
          </button>

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

      <div
        className={`${isNightMode ? "bg-black text-white" : "bg-white text-gray-700"
          } flex justify-between rounded-lg shadow-sm p-4 text-2xl font-bold mt-10`}
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
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div
            className={`${isNightMode ? "bg-black text-white" : "bg-gray-50 text-gray-700"
              } border w-[35%] py-8 shadow-lg rounded-xl p-6 mt-6`}
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
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md z-50">
          <Loader />
        </div>
      )}

      <div className="flex justify-between mt-10">
        <div className="w-[30%]">
          <div
            className={`${isNightMode ? "bg-gray-600 text-white" : "bg-white text-gray-700"
              } mt-3 p-2 mb-3 border rounded-lg flex`}
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
