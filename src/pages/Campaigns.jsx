import { useEffect, useState } from "react";
import { useNightMode } from "../contexts/NightModeContext";
import axios from "../helper/axios";
import Swal from "sweetalert2";
import { MdDelete } from "react-icons/md";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Loader from "../components/Loader";
const Campaigns = () => {
  const [showForm, setShowForm] = useState(false);
  const { isNightMode } = useNightMode();
  const [fileData, setFileData] = useState(null);
  const [BatchData, setBatchData] = useState([]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [scheduledTime, setScheduledTime] = useState("");
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState("12:00");
  const [batchId, setBatchId] = useState("");
  const token = localStorage.getItem("token");
  const [load, setLoad] = useState(true);

  const DeleteBatch = async (id) => {

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });
   if(result.isConfirmed){
    try {
      const response = await axios.delete(`/api/batches/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response) {
        Swal.fire({
          icon: "success",
          title: "data is deleted",
        });
        window.location.reload();

        
      }
    } catch (e) {
      Swal.fire({
        icon: "error",
        title: `${e}`,
      });
    }
   }
  
  };
  const handleSchedule = () => {
    if (!batchId) {
      Swal.fire({
        icon: "error",
        title: "Batch ID is missing!",
      });
      return;
    }

    const [hours, minutes] = time.split(":");
    const scheduledDate = new Date(date);
    scheduledDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    const scheduled_at = scheduledDate.toISOString().slice(0, 19);

    // console.log("Scheduled Time:", scheduled_at);
    // console.log("Batch ID:", batchId);

    setScheduledTime(scheduled_at);
    setShowCalendar(false);
    ScheduleCall(scheduled_at);
  };

  const ScheduleCall = async (scheduled_at) => {
    try {
      const response = await axios.post(
        "/api/batches/schedule/call/",
        {
          batch_id: batchId,
          scheduled_at: scheduled_at,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      Swal.fire({
        icon: "success",
        title: "Call Scheduled Successfully",
      });
      // console.log(response.data);
    } catch (e) {
      const errorMessage = e.response?.data?.detail || e.message;
      Swal.fire({
        icon: "error",
        title: "Error Scheduling Call",
        text: `${errorMessage}`,
      });
    }
  };

  const getBatch = async () => {
    try {
      const response = await axios.get("/api/batches/all", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setBatchData(response.data);
      setLoad(false);
    } catch (e) {
      console.error("Error fetching batches:", e.response?.data);
    }
  };

  const handleFileChange = (e) => {


    const file = e.target.files[0];
    if (file && file.type === "text/csv") {
      setFileData(file);
    } else {
    
    Swal.fire({
      icon:'warning',
      title: "Please Upload .CSV file",
    });
      e.target.value = ""; 
    }
  
  };

  const BatchCreate = async () => {
    try {
      const formData = new FormData();
      formData.append("file", fileData);

      await axios.post("/api/batch_create/", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      Swal.fire({
        icon: "success",
        title: "File Uploaded Successfully",
      });
      setShowForm(false);
      getBatch(); // Refresh batch list after upload
    } catch (e) {
      Swal.fire({
        icon: "error",
        title: `${e.response?.data?.message || "Upload failed"}`,
      });
    }
  };

  useEffect(() => {
    getBatch();
  }, []);

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
      </div>

      <div
        className={`${
          isNightMode ? "bg-black text-white" : "bg-white text-gray-700"
        } flex justify-between shadow p-4 mt-10 rounded-lg`}
      >
        <h1 className="text-3xl flex items-center font-bold">Campaigns</h1>
        <button
          onClick={() => setShowForm(true)}
          className="border flex text-white text-lg bg-customPink hover:bg-customDarkPink rounded-lg px-5 p-3 items-center gap-2"
        >
          New Campaign
        </button>
      </div>

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
              Create New Campaign
              <button onClick={() => setShowForm(false)}>X</button>
            </h2>
            <form>
              <div className="mb-4">
                <label className="block font-medium mb-2">Upload File</label>
                <input
                  type="file"
                  className="w-full border rounded-lg px-4 py-2 text-gray-700"
                  accept=".csv"
                  onChange={handleFileChange}
                />
              </div>
            </form>
            <div className="flex gap-4 justify-end">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-200 text-black px-5 py-2 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-customPink text-white px-5 py-2 rounded-lg hover:bg-customDarkPink transition"
                onClick={BatchCreate}
              >
                Create Campaign
              </button>
            </div>
          </div>
        </div>
      )}
      {load && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md z-50">
          <Loader />
        </div>
      )}
      {showCalendar && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-70 z-[1000]">
          <div className="bg-white p-5 rounded-lg shadow-lg text-center">
            <h2 className="text-lg font-bold mb-3">Schedule Campaign</h2>
            <Calendar onChange={setDate} value={date} className="mb-3" />
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="border p-2 rounded mb-3 w-full"
            />
            <div className="flex justify-between">
              <button
                onClick={() => setShowCalendar(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSchedule}
                className="px-4 py-2 bg-green-500 text-white rounded-lg"
              >
                Schedule
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="shadow-md mt-9">
        <table className="w-full rounded-lg border">
          <thead>
            <tr
              className={`${
                isNightMode
                  ? "bg-gray-800 text-white"
                  : "bg-gray-100 text-gray-700"
              } text-left border-b`}
            >
              <th className="p-3">Campaign Name</th>
              <th className="p-3">Caller</th>
              <th className="p-3">Status</th>
              <th className="p-3">Created At</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {BatchData.map((batch) => (
              <tr
                key={batch.batch_id}
                className={`${
                  isNightMode
                    ? "bg-gray-600 text-white"
                    : "bg-white text-gray-700"
                } h-14`}
              >
                <td className="p-3">{batch.file_name}</td>
                <td className="p-3">{batch.from_phone_number}</td>
                <td className="p-3">{batch.status}</td>
                <td className="p-3">{batch.created_at}</td>
                <td className="p-3 flex items-center gap-2">
                  <button
                    onClick={() => {
                      setShowCalendar(true);
                      setBatchId(batch.batch_id);
                    }}
                    className="bg-green-500 p-2 px-4 text-white rounded-lg"
                  >
                    Schedule
                  </button>
                  <MdDelete
                    className="cursor-pointer"
                    size={25}
                    onClick={() => DeleteBatch(batch.batch_id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Campaigns;
