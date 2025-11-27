// Jobs.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Jobs() {
  const navigate = useNavigate();   // ✔ valid hook placement

  const [jobs, setJobs] = useState([]);
  const [customers, setCustomers] = useState([]);

  // Load jobs + customers
  useEffect(() => {
    async function loadData() {
      const [jobsList, customerList] = await Promise.all([
        window.api.getJobs(),
        window.api.getCustomers()
      ]);
      setJobs(jobsList);
      setCustomers(customerList);
    }
    loadData();
  }, []);

  // Refresh job list without reloading browser
  const refreshJobs = () => {
    window.api.getJobs().then((data) => setJobs(data));
  };

  // Helper to match customer ID → customer name
  const getCustomerName = (id) => {
    const c = customers.find((cust) => cust.id === id);
    if (!c) return "Unknown Customer";
    return `${c.first_name} ${c.last_name}`;
  };

  // Update job status (Start, Complete)
  const updateStatus = async (id, newStatus, e) => {
    e.stopPropagation(); // prevent clicking row
    await window.api.updateJobStatus({ id, status: newStatus });
    refreshJobs(); // ✔ no logout now
  };

  // Delete job
  const deleteJob = async (id, e) => {
    e.stopPropagation();

    const ok = confirm("Are you sure you want to delete this job?");
    if (!ok) return;

    await window.api.deleteJob(id);
    refreshJobs(); // ✔ no reload → no logout
  };

  if (!jobs.length) {
    return (
      <div>
        <h1>Job Queue</h1>
        <p>No jobs in the system yet.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Job Queue</h1>

      <table style={tableStyle}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Customer</th>
            <th>Description</th>
            <th>Status</th>
            <th>Created</th>
            <th>Notes</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {jobs.map((j) => (
            <tr
              key={j.id}
              onClick={() => navigate(`/job/${j.id}`)}
              style={{ cursor: "pointer" }}
            >
              <td>{j.id}</td>
              <td>{getCustomerName(j.customer_id)}</td>
              <td>{j.description}</td>
              <td>{formatStatus(j.status)}</td>
              <td>{j.timestamp || "-"}</td>
              <td>
                <pre style={notesStyle}>{j.notes}</pre>
              </td>

              <td>
                {/* Start */}
                {j.status !== "in_progress" && j.status !== "completed" && (
                  <button
                    style={btn}
                    onClick={(e) => updateStatus(j.id, "in_progress", e)}
                  >
                    Start
                  </button>
                )}

                {/* Complete */}
                {j.status !== "completed" && (
                  <button
                    style={btn}
                    onClick={(e) => updateStatus(j.id, "completed", e)}
                  >
                    Complete
                  </button>
                )}

                {/* Delete */}
                <button
                  style={deleteBtn}
                  onClick={(e) => deleteJob(j.id, e)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ----------------------
// STYLES
// ----------------------

const tableStyle = {
  borderCollapse: "collapse",
  width: "100%",
  marginTop: "20px"
};

const notesStyle = {
  margin: 0,
  whiteSpace: "pre-wrap",
  fontSize: "12px"
};

const btn = {
  padding: "5px 10px",
  marginRight: "5px",
  cursor: "pointer"
};

const deleteBtn = {
  padding: "5px 10px",
  background: "#b71c1c",
  color: "white",
  cursor: "pointer"
};

// Format status properly
function formatStatus(status) {
  if (status === "pending") return "Pending";
  if (status === "in_progress") return "In Progress";
  if (status === "completed") return "Completed";
  return status;
}
