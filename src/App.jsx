import {  useState,useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { LoginProvider, useLogin } from "./contexts/AuthContext";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import CallLog from "./pages/CallLog";
import Billing from "./pages/Billing";
import Campaigns from "./pages/Campaigns";
import Tasks from "./pages/Tasks";
import RechargePage from "./components/RechargePage";
import Signup from "./components/Signup";
import { NightModeProvider } from "./contexts/NightModeContext";
import LoginPage from "./hooks/LoginPage";
import PrivateRoute from "./hooks/PrivateRoute";
function Content({showSidebar}) {
  const { user } = useLogin();

  return (
    <div className="flex">
      {showSidebar && <Sidebar />}
      <div className="w-full">
       
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<LoginPage />} />

          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/call-logs" element={<CallLog />} />
            <Route path="/billing" element={<Billing />} />
            <Route path="/campaigns" element={<Campaigns />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/recharge" element={<RechargePage />} />
          </Route>
        </Routes>
      </div>
    </div>
  );
}
const AppWrapper = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const location = useLocation();
  const noSidebarPages = ["/", "/login"];

  useEffect(() => {
    setShowSidebar(!noSidebarPages.includes(location.pathname));
  }, [location.pathname]);

  return <Content showSidebar={showSidebar} />;
};
function App() {
  return (
    <Router basename="/maitri_assistant">
      <NightModeProvider>
        <LoginProvider>
          <AppWrapper />
        </LoginProvider>
      </NightModeProvider>
    </Router>
  );
}

export default App;
