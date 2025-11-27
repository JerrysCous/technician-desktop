import { useEffect, useState } from "react";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [customers, setCustomers] = useState([]);

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

  const getCustomerName = (id) => {
    const c = customers.find((c) => c.id === id);
    if (!c) return "Unknown";
    return `${c.first_name} ${c.last_name}`;
  };

  if (!jobs.length) {
    return (
      <div>
        <h1>Job Queue</h1>
        <p>No jobs in the queue yet.</p>
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
          </tr>
        </thead>
        <tbody>
          {jobs.map((j) => (
            <tr key={j.id}>
              <td>{j.id}</td>
              <td>{getCustomerName(j.customer_id)}</td>
              <td>{j.description}</td>
              <td>{formatStatus(j.status)}</td>
              <td>{j.timestamp || "-"}</td>
              <td>
                <pre style={notesStyle}>{j.notes}</pre>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

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

function formatStatus(status) {
  if (status === "pending") return "Pending";
  if (status === "in_progress") return "In Progress";
  if (status === "completed") return "Completed";
  return status;
}
