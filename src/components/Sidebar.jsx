import { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNightMode } from "../contexts/NightModeContext";
import { useLogin } from "../contexts/AuthContext";
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";

const Sidebar = () => {
  const location = useLocation();
  const [active, setActive] = useState(location.pathname);
  // const [active, setActive] = useState("false");
  const { isNightMode, toggleNightMode } = useNightMode();

  const { logout } = useLogin(); // Get logout function here

  const handleLogout = async () => {
  

    await  logout(); // Call the logout function
  };
  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: "./images/Dashboard.png",
      // icon: "",
      // activeIcon: "./images/dashboadicon.webp",
      activeIcon: "./images/activeDahboard.png",
    },
    {
      name: "Call Logs",
      path: "/call-logs",
      icon: "./images/callLogs.png",
      activeIcon: "./images/ActiveCallLog.png",
    },
    {
      name: "Billing & Usage",
      path: "/billing",
      icon: "./images/Billing & Usage.png",
      activeIcon: "./images/Billing & Usage (1).png",
    },
    {
      name: "Campaigns",
      path: "/campaigns",
      icon: "./images/Campaigns icon.png",
      activeIcon: "./images/Campaigns icon (1).png",
    },
  ];
  useEffect(() => {
    setActive(location.pathname);
  }, [location.pathname]);

  return (
    <div
      className={`${
        isNightMode ? "bg-gray-950 text-white" : "bg-white text-gray-700"
      } w-[20%] shadow-xl sticky top-0 left-0 h-screen blur-0`}
    >
      {/* Logo Section */}
      <div className="border-b-2 p-5">
        <div className="flex -ml-8 p-4 justify-center items-center">
          <img src="./images/MAITRIAILOGO4.png" alt="logo" />
        </div>
      </div>

      {/* Sidebar Menu */}
      <div
        className={`${
          isNightMode ? "bg-gray-950 text-white" : "bg-white text-gray-700"
        }   mt-10 p-2`}
      >
        {menuItems.map((item) => (
          <Link
            to={item.path}
            key={item.name}
            onClick={() => setActive(item.path)}
            className={`flex items-center mb-7 gap-3 px-4 py-3 w-full rounded-lg transition-all duration-300
                            ${
                              active === item.path
                                ? "bg-blue-100 text-pink-500"
                                : " relative pb-3 after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[3px] after:bg-pink-500 after:transition-all after:duration-300 hover:after:w-full"
                            }
                        `}
          >
            {/* Icon changes when active */}
            <img
              src={active === item.path ? item.activeIcon : item.icon}
              alt="icon"
              className="mt-2 h-5 w-5"
            />
            {item.name}
          </Link>
        ))}
      </div>
      <div className="mt-30 text-2xl ml-6 p-2">
        <button
          className={`flex items-center gap-3 px-4 py-3 w-full rounded-lg transition-all duration-300
                        ${
                          active === "Logout"
                            ? "bg-blue-100 text-pink-500"
                            : " relative pb-3 after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[3px] after:bg-pink-500 after:transition-all after:duration-300 hover:after:w-full"
                        }
                    `}
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
