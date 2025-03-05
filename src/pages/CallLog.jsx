import { useState, useEffect } from "react";
import { useNightMode } from "../contexts/NightModeContext";
import axios from "../helper/axios";
import CallDetails from "./CallDetails";
import Swal from "sweetalert2";
import Loader from "../components/Loader";
const CallLog = () => {
  const [showForm, setShowForm] = useState(false);
  const { isNightMode } = useNightMode();
  const [dashboard, setDashboard] = useState({});
  const [show, setShow] = useState(false);
  const [selectedExecution, setSelectedExecution] = useState(null); // Track the clicked execution
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setloading] = useState(false);
  const [load, setLoad] = useState(true);

  const token = localStorage.getItem("authToken");

  const payloadBase64 = token.split(".")[1]; // Get the payload part
  const payloadDecoded = JSON.parse(atob(payloadBase64)); // Decode Base64
  const user_id = payloadDecoded.user_id;

  const handleShowDetails = (execution) => {
    setSelectedExecution(execution); // Set the clicked execution
    setShow(!show); // Toggle the visibility of CallDetails
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
        `${first_name || variable1 || ""} ${
          last_name || variable2 || ""
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

  return (
    <div
      className={`${
        isNightMode ? "bg-black text-white" : "bg-gray-50 text-gray-700"
      } p-9 min-h-screen`}
    >
      <div className="flex justify-between">
        <div className="font-bold text-3xl">
          Dashboard Overview
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
            <img src="/Vector (5).webp" alt="" className="w-5 h-5 mt-3 ml-3" />
            <input
              type="text"
              placeholder="Search..."
              className="mr-16 ml-4 outline-none bg-transparent"
            />
          </div>
          <img src="/Rectangle.webp" alt="" className="w-10 h-10 mt-2 ml-8" />
        </div>
      </div>

      <div
        className={`${
          isNightMode ? "bg-black text-white" : "bg-white text-gray-700"
        } flex justify-between rounded-lg shadow-sm p-4 text-2xl font-bold mt-10`}
      >
        Call Logs
        <button
          onClick={() => setShowForm(true)}
          className="flex text-lg text-white bg-customPink rounded-md p-2 mr-4 font-medium"
        >
          <img src="/i (2).webp" alt="" className="mr-2 ml-2 mt-1" />
          Call Numbers
        </button>
      </div>

      {showForm && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div
            className={`${
              isNightMode ? "bg-black text-white" : "bg-gray-50 text-gray-700"
            } border w-[40%] py-8 shadow-lg rounded-xl p-6 mt-6`}
          >
            <h2 className="text-2xl flex justify-between font-bold mb-7">
              Call Numbers
              <button onClick={() => setShowForm(false)}>
                <img src="/Frame (4).webp" alt="" />
              </button>
            </h2>

            <form className="flex justify-between gap-5">
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
            </form>

            <div className="flex gap-4 justify-end">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-200 text-black px-5 py-2 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              {/* <button
                type="submit"
                className="bg-customPink text-white px-20 py-2 rounded-lg hover:bg-customDarkPink"
                onClick={handleCall}
              >
                Call
              </button> */}
              <button
                className={`bg-customPink text-white px-20 py-2 rounded-lg ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : " hover:bg-customDarkPink"
                }`}
                onClick={handleCall}
                disabled={loading}
              >
                {loading ? "Calling..." : "Make Call"}
              </button>
            </div>
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
            className={`${
              isNightMode ? "bg-gray-600 text-white" : "bg-white text-gray-700"
            } mt-3 p-2 mb-3 border rounded-lg flex`}
          >
            <img src="/Vector (5).webp" alt="" className="w-5 h-5 mt-1" />
            <input
              type="text"
              placeholder="Search calls..."
              className="ml-4 outline-none bg-transparent text-lg"
            />
          </div>
        </div>
        <div
          className={`${
            isNightMode ? "bg-black text-white" : "bg-gray-50 text-gray-700"
          } flex p-2 gap-5 items-center text-lg font-medium`}
        >
          <button className="flex border p-2 pr-4 rounded-lg">
            <img src="/svg.webp" alt="" className="p-2" />
            Filter
          </button>
          <button className="flex border p-2 pr-4 rounded-lg">
            <img src="/svg (1).webp" alt="" className="p-2" />
            Export
          </button>
        </div>
      </div>

      <div className="mt-6 rounded-lg w-full border">
        <div
          className={`${
            isNightMode ? "bg-gray-600 text-white" : "bg-white text-gray-700"
          } rounded-lg overflow-x-auto`}
        >
          <table className="w-full text-left">
            <thead>
              <tr
                className={`${
                  isNightMode
                    ? "bg-customDarkGray text-white"
                    : "bg-gray-50 text-gray-700"
                } border-b`}
              >
                <th className="p-4">ID</th>
                <th className="p-4">Name</th>
                <th className="p-4">Status</th>
                <th className="p-4">Cost</th>
                <th className="p-4">Duration</th>
                <th className="p-4">CTA</th>
                <th className="p-4">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {dashboard.executions?.map((execution) => {
                const cta = getCTA(execution);
                return (
                  <tr key={execution.id} className="text-sm border-t">
                    <td
                      className="p-4 cursor-pointer hover:underline"
                      onClick={() => handleShowDetails(execution)} // Pass the execution object
                    >
                      {execution.id.slice(0, 8)}
                    </td>
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

                        <td className="p-4">
                {execution.extra_charge_breakdown?.length > 0
                  ? `$ ${execution.extra_charge_breakdown[0].total_cost_with_extra.toFixed(2)}`
                  : "N/A"}
              </td>
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
