import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div style={{
      width: "220px",
      background: "#1e1e1e",
      color: "white",
      height: "100vh",
      padding: "20px",
      boxSizing: "border-box"
    }}>
      <h2 style={{ marginBottom: "30px" }}>Technician</h2>

      <ul style={{ listStyle: "none", padding: 0 }}>
        <li><Link style={link} to="/">Dashboard</Link></li>
        <li><Link style={link} to="/add-customer">Add Customer</Link></li>
        <li><Link style={link} to="/customers">Customer List</Link></li>
        <li><Link style={link} to="/add-job">Add Job</Link></li>
        <li><Link style={link} to="/jobs">Job Queue</Link></li>
        <li><Link style={link} to="/settings">Settings</Link></li>
      </ul>
    </div>
  );
}

const link = {
  display: "block",
  color: "white",
  padding: "10px 0",
  textDecoration: "none",
  fontSize: "16px"
};
