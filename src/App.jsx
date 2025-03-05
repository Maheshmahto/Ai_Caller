import { useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider, AuthContext } from "./contexts/AuthContext";
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
import RazorpayCheckout from "./pages/RazorpayCheckout";
function Content() {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <div className="flex">
      {isAuthenticated && <Sidebar />}
      <div className="w-full">
        <Routes>
          {/* <Route path='/sidebar' element={<Sidebar />} /> */}
          {/* <Route path='/dashboard' element={<Dashboard />} /> */}
          {/* <Route path='/call-logs' element={<CallLog />} /> */}
          {/* <Route path='/billing' element={<Billing />} /> */}
          {/* <Route path='/campaigns' element={<Campaigns />} /> */}
          {/* <Route path='/tasks' element={<Tasks />} /> */}
          {/* <Route path='/recharge' element={<RechargePage />} /> */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/sidebar"
            element={
              <PrivateRoute>
                <Sidebar />
              </PrivateRoute>
            }
          />
          <Route
            path='/dashboard'
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/call-logs"
            element={
              <PrivateRoute>
                <CallLog />
              </PrivateRoute>
            }
          />
          <Route
            path="/billing"
            element={
              <PrivateRoute>
                <Billing />
              </PrivateRoute>
            }
          />
          <Route
            path="/campaigns"
            element={
              <PrivateRoute>
                <Campaigns />
              </PrivateRoute>
            }
          />
          <Route
            path="/tasks"
            element={
              <PrivateRoute>
                <Tasks />
              </PrivateRoute>
            }
          />
          <Route
            path="/recharge"
            element={
              <PrivateRoute>
                <RechargePage />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <NightModeProvider>
        <AuthProvider>
          <Content />
        </AuthProvider>
      </NightModeProvider>
    </Router>
    // <RazorpayCheckout></RazorpayCheckout>
  );
}

export default App;
