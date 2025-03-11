import { Outdent } from "lucide-react";
import { Navigate, Outlet } from "react-router-dom";
// import { useAuth } from "../contexts/AuthContext";

const PrivateRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('token'); 

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  return children ? <>{children}</> : <Outlet />;
};

export default PrivateRoute;