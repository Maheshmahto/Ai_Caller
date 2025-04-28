import { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNightMode } from "../contexts/NightModeContext";
import { useLogin } from "../contexts/AuthContext";
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { FiMenu, FiX } from "react-icons/fi";
import { MdLogout } from "react-icons/md";

const Sidebar = () => {
  const location = useLocation();
  const [active, setActive] = useState(location.pathname);
  // const [active, setActive] = useState("false"z);
  const { isNightMode, toggleNightMode } = useNightMode();

  const { logout } = useLogin(); // Get logout function here
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout(); // Call the logout function
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
    <div className=" relative sm:pr-16 ">
      {/* Toggle Button */}
      <button
        className="absolute top-4 left-1 z-50 text-2xl p-2 rounded md:hidden"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <FiX /> : <FiMenu />}
      </button>

      <div
        className={`fixed top-0 left-0 h-screen w-full shadow-xl  transition-transform duration-300 z-40  ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 md:fixed md:left-0 md:top-0 md:h-screen md:w-80 ${isNightMode ? "bg-gray-950 text-white" : "bg-white text-gray-700"
          } flex flex-col `}
      >
        {/* Logo Section */}
        <div className="border-b-2 p-5 ">
          <div className="flex p-4 justify-center items-center">
            <img src="./images/MAITRIAILOGO4.png" alt="logo" className="" />
          </div>
        </div>

        {/* Sidebar Menu */}
        <div
          className={`${isNightMode ? "bg-gray-950 text-white" : "bg-white text-gray-700"
            }   mt-10 p-2`}
        >
          {menuItems.map((item) => (
            <Link
              to={item.path}
              key={item.name}
              onClick={() => {
                setActive(item.path);
                if (window.innerWidth < 768) {
                  setIsSidebarOpen(false);
                }
              }}
              className={`flex items-center mb-7 gap-3 px-4 py-3 w-[100%] rounded-lg transition-all duration-300
                            ${active === item.path
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

        <div className="mt-auto mb-6 px-4">
        <button
          className={`flex items-center text-2xl gap-2 px-4 py-3 w-full text-red-600 rounded-lg transition-all duration-300
                        ${active === "Logout"
              ? "bg-blue-100 text-pink-500"
              : " relative pb-3 after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[3px] after:bg-red-500 after:transition-all after:duration-300 hover:after:w-full"
            }
                    `}
          onClick={handleLogout}
        >
        <MdLogout />
        Logout
        </button>
        </div>
        
      </div>

    </div>

  );
};

export default Sidebar;
