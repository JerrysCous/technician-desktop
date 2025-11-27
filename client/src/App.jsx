import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import AddCustomer from "./pages/AddCustomer";
import Customers from "./pages/Customers";
import AddJob from "./pages/AddJob";
import Jobs from "./pages/Jobs";
import Settings from "./pages/Settings";
import JobDetails from "./pages/JobDetails";

export default function App() {
  const [password, setPassword] = useState("");
  const [hasPassword, setHasPassword] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);

  // check if admin password exists
  useEffect(() => {
    window.api.login("test").then(res => {
      if (res.error === "NO_PASSWORD_SET") {
        setHasPassword(false);
      } else {
        setHasPassword(true);
      }
    });
  }, []);

  const handleSetPassword = async () => {
    if (!password) return;
    await window.api.setPassword(password);
    setHasPassword(true);
    setPassword("");
  };

  const handleLogin = async () => {
    const res = await window.api.login(password);
    if (res.success) setLoggedIn(true);
    else alert("Incorrect password");
  };

  // If not logged in
  if (!loggedIn) {
    return (
      <div style={{ padding: 40 }}>
        <h1>Technician Admin Login</h1>

        {hasPassword === false ? (
          <>
            <h3>Create Admin Password</h3>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleSetPassword}>Set Password</button>
          </>
        ) : (
          <>
            <h3>Enter Admin Password</h3>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLogin}>Login</button>
          </>
        )}
      </div>
    );
  }

  // Logged in → show dashboard layout
  return (
    <BrowserRouter>
      <div style={{ display: "flex" }}>
        <Sidebar />
        <div style={{ padding: "30px", width: "100%" }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/add-customer" element={<AddCustomer />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/add-job" element={<AddJob />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/settings" element={<Settings />} />
	<Route path="/job/:id" element={<JobDetails />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
