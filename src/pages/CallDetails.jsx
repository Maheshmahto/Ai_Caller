/* eslint-disable react/prop-types */
import { MdOutlineCancel } from "react-icons/md";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useNightMode } from "../contexts/NightModeContext";

const CallDetails = ({ handleShowDetails, execution }) => {
  const formatDuration = (seconds) => {
    if (!seconds) return "N/A";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    return `${minutes}m ${remainingSeconds}s`;
  };
  const { isNightMode ,toggleNightMode } = useNightMode();

  const exportToExcel = () => {
    if (!execution) {
      Swal.fire({
        title: "Error",
        text: "No execution selected. Please select a call log first.",
        icon: "error",
      });
      return;
    }

    const getName = (execution) => {
      if (execution?.context_details?.recipient_data) {
        const { first_name, last_name } = execution.context_details.recipient_data;
        return `${first_name || ""} ${last_name || ""}`.trim() || "Unknown";
      }
      return "Unknown";
    };
    

    const getCTA = (execution) => {
      return { text: execution?.cta || "No CTA" }; // Modify based on your data
    };
    
    
  // Prepare data for export
  const executionData = {
    ID: execution.id,
    
    Name: getName(execution),
    Status: execution.status,
    "Phone Number": execution.telephony_data?.to_number || "N/A",
    Cost: execution.total_cost ? execution.total_cost.toFixed(2) : "N/A",
    Duration: formatDuration(execution.conversation_duration),
    CTA: getCTA(execution).text,
    "Timestamp": new Date(execution.created_at).toLocaleString(),
    "Transcript": execution.transcript || "No transcript available",
    "Summary": execution.summary || "No summary available",
  };

  const worksheet = XLSX.utils.json_to_sheet([executionData]); 
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Call Details"); 

  // Generate and save the Excel file
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const data = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(data, `Call_Details_${execution.id}.xlsx`);
};

  return (
    <div className= {`${
      isNightMode ? "bg-gray-600 text-white" : "bg-white text-gray-700"
    } max-w-2xl mx-auto shadow-lg rounded-lg p-6 overflow-y-auto max-h-[90vh]`}>
      <div className={`${
      isNightMode ? "bg-gray-600 text-white" : "bg-white text-gray-700"
    } flex justify-between`}>
        <h2 className="text-xl font-semibold mb-4">Call Details</h2>
        <MdOutlineCancel
          className="cursor-pointer"
          size={25}
          onClick={handleShowDetails}
        />
      </div>

      <div className={`${
      isNightMode ? "bg-gray-600 text-white" : "bg-white text-gray-700"
    } grid grid-cols-2 gap-4 mb-4`}>
        <div>
          <label className={`${
      isNightMode ? "bg-gray-600 text-white" : "bg-white text-gray-700"
    } text-gray-600 text-sm`}>Session ID</label>
          <input
            type="text"
            value={execution?.id || "N/A"}
            readOnly
            className={`${
              isNightMode ? "bg-gray-600 text-white" : "bg-white text-gray-700"
            } w-full border p-2 rounded bg-gray-100`}
          />
        </div>
        <div>
          <label className={`${
      isNightMode ? "bg-gray-600 text-white" : "bg-white text-gray-700"
    } text-gray-600 text-sm`}>Agent ID</label>
          <input
            type="text"
            value={execution?.agent_id || "N/A"}
            readOnly
            className={`${
              isNightMode ? "bg-gray-600 text-white" : "bg-white text-gray-700"
            } w-full border p-2 rounded bg-gray-100`}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <label className={`${
      isNightMode ? "bg-gray-600 text-white" : "bg-white text-gray-700"
    } text-gray-600 text-sm`}>Duration</label>
          <input
            type="text"
            value={formatDuration(execution?.conversation_duration)}
            readOnly
            className={`${
              isNightMode ? "bg-gray-600 text-white" : "bg-white text-gray-700"
            } w-full border p-2 rounded bg-gray-100`}
          />
        </div>
        <div>
          <label className={`${
      isNightMode ? "bg-gray-600 text-white" : "bg-white text-gray-700"
    } text-gray-600 text-sm`}>Status</label>
          <div
            className={`p-2 rounded text-center ${
              execution?.status === "completed"
                ? "bg-green-100 text-green-600"
                : execution?.status === "failed"
                ? "bg-red-100 text-red-600"
                : "bg-yellow-100 text-yellow-600"
            }`}
          >
            {execution?.status || "N/A"}
          </div>
        </div>
        <div>
          <label className={`${
      isNightMode ? "bg-gray-600 text-white" : "bg-white text-gray-700"
    } text-gray-600 text-sm`}>Date</label>
          <input
            type="text"
            value={
              execution?.created_at
                ? new Date(execution.created_at).toLocaleString()
                : "N/A"
            }
            readOnly
            className={`${
              isNightMode ? "bg-gray-600 text-white" : "bg-white text-gray-700"
            } w-full border p-2 rounded bg-gray-100`}
          />
        </div>
      </div>

      <h3 className="text-lg font-semibold mb-2">Contact Information</h3>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <button className={`${
      isNightMode ? "bg-gray-200 text-gray-700" : "bg-gray-200 text-gray-700"
    } p-2 rounded flex items-center gap-2`}>
          {execution?.telephony_data?.to_number || "N/A"}
        </button>
        <button className={`${
      isNightMode ? "bg-gray-200 text-gray-700" : "bg-gray-200 text-gray-700"
    } p-2 rounded flex items-center gap-2`}>
          {execution?.telephony_data?.from_number || "N/A"}
        </button>
      </div>

      {/* <h3 className="text-lg font-semibold mb-2">Cost Breakdown</h3>
      <div className="flex justify-between bg-gray-100 p-2 rounded mb-4">
        <span>Base Cost</span>
        <span>₹{(execution?.cost_breakdown?.llm + execution?.cost_breakdown?.network + execution?.cost_breakdown?.platform + execution?.cost_breakdown?.synthesizer + execution?.cost_breakdown?.transcriber).toFixed(2) || "0.00"}</span>
      </div>
      <div className="flex justify-between bg-gray-100 p-2 rounded mb-4">
        <span>Total</span>
        <span>₹{execution?.total_cost.toFixed(2) || "0.00"}</span>
      </div> */}

      <h3 className="text-lg font-semibold mb-2">Call Recording</h3>
      <audio controls className="w-full mb-4">
        <source
          // eslint-disable-next-line react/prop-types
          src={execution?.telephony_data?.recording_url || "audio-file.mp3"}
          type="audio/mp3"
        />
        Your browser does not support the audio element.
      </audio>

      <h3 className="text-lg font-semibold mb-2">Call History</h3>
      <div className={`${
      isNightMode ? "bg-gray-200 text-gray-700" : "bg-gray-200 text-gray-700"
    } flex items-center gap-4 p-2 bg-gray-100 rounded mb-4`}>
        <div className="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center">
          {execution?.context_details?.recipient_phone_number?.slice(-2)[0] || "U"}
        </div>
        <div>
          <p className="font-medium">
            {execution?.context_details?.recipient_phone_number || "Unknown"}
          </p>
          <p className="text-sm text-gray-600">
            {execution?.telephony_data?.call_type === "outbound"
              ? "Outbound Call"
              : "Unknown Call Type"}
          </p>
        </div>
        <span className="ml-auto text-gray-600">
          {execution?.created_at
            ? new Date(execution.created_at).toLocaleTimeString()
            : "N/A"}
        </span>
        <span className="bg-purple-200 text-purple-800 px-2 py-1 rounded">
          {formatDuration(execution?.conversation_duration)}
        </span>
      </div>

      <div className="flex justify-end gap-4">
        <button
          className={`${
            isNightMode ? "bg-gray-200 text-gray-700" : "bg-gray-200 text-gray-700"
          } px-4 py-2 bg-gray-300 rounded`}
          onClick={handleShowDetails}
        >
          Close
        </button>
        <button className="px-4 py-2 bg-purple-600 text-white rounded"
        onClick={exportToExcel}
        >
          Export Details
        </button>
      </div>
    </div>
  );
};

export default CallDetails;