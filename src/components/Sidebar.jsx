import { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNightMode } from "../contexts/NightModeContext";
import { AuthContext } from "../contexts/AuthContext";
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";

const Sidebar = () => {
  const location = useLocation();
  const [active, setActive] = useState(location.pathname);
  // const [active, setActive] = useState("false");
  const { isNightMode, toggleNightMode } = useNightMode();
//   const handleLogout = () => {
//     const result = Swal.fire({
//       title: "Are you sure?",
//       text: "You want to Logout",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#d33",
//       cancelButtonColor: "#3085d6",
//       confirmButtonText: "Yes, delete it!",
//     });
//     if (result.isConfirmed) {
//       const { logout } = useContext(AuthContext);
//     }
//   };
const { logout } = useContext(AuthContext); // Get logout function here

const handleLogout = async () => {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "You want to Logout",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, Logout!",
  });

  if (result.isConfirmed) {
    logout(); // Call the logout function
  }
};
  const menuItems = [
    {
      name: "Dashboard",
      path: "/",
      icon: "/i-1.webp",
      activeIcon: "/dashboard icon.webp",
    },
    {
      name: "Call Logs",
      path: "/call-logs",
      icon: "/Frame.webp",
      activeIcon: "/call icon.webp",
    },
    {
      name: "Billing & Usage",
      path: "/billing",
      icon: "/Frame-1.webp",
      activeIcon: "/Vector (1) (1).webp",
    },
    {
      name: "Campaigns",
      path: "/campaigns",
      icon: "/Frame-2.webp",
      activeIcon: "/Vector (2).webp",
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
          <img src="/MAITRI AI LOGO 4.webp" alt="logo" />
        </div>
      </div>

      {/* Sidebar Menu */}
      <div
        className={`${
          isNightMode ? "bg-gray-950 text-white" : "bg-white text-gray-700"
        } text-2xl ml-6 mt-10 p-2`}
      >
        {menuItems.map((item) => (
          <Link
            to={item.path}
            key={item.name}
            onClick={() => setActive(item.path)}
            className={`flex mb-7 gap-3 px-4 py-3 w-full rounded-lg transition-all duration-300
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
