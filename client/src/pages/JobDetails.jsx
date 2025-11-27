import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    async function load() {
      const jobs = await window.api.getJobs();
      const customers = await window.api.getCustomers();

      const foundJob = jobs.find(j => j.id === Number(id));
      setJob(foundJob);

      if (foundJob) {
        setNotes(foundJob.notes);
        const foundCustomer = customers.find(c => c.id === foundJob.customer_id);
        setCustomer(foundCustomer);
      }
    }
    load();
  }, [id]);

  if (!job) {
    return <h1>Job not found</h1>;
  }

  const updateStatus = async (newStatus) => {
    await window.api.updateJobStatus({ id: job.id, status: newStatus });
    setJob({ ...job, status: newStatus });
  };

  const saveNotes = async () => {
    await window.api.updateJobStatus({ id: job.id, status: job.status, notes });
    alert("Notes updated!");
  };

  const deleteJob = async () => {
    if (confirm("Delete this job?")) {
      await window.api.deleteJob(job.id);
      navigate("/jobs");
    }
  };

  return (
    <div>
      <h1>Job Details</h1>

      <button onClick={() => navigate(-1)} style={backBtn}>
        ← Back
      </button>

      <h2>Job #{job.id}</h2>

      <h3>Customer</h3>
      {customer ? (
        <p>
          {customer.first_name} {customer.last_name}<br/>
          {customer.email}<br/>
          {customer.phone}
        </p>
      ) : (
        <p>Unknown Customer</p>
      )}

      <h3>Device & Issue</h3>
      <p>{job.description}</p>

      <h3>Status: {formatStatus(job.status)}</h3>

      <button onClick={() => updateStatus("pending")} style={btn}>Pending</button>
      <button onClick={() => updateStatus("in_progress")} style={btn}>Start</button>
      <button onClick={() => updateStatus("completed")} style={btn}>Complete</button>

      <h3>Notes</h3>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        style={textarea}
      />

      <br />
      <button onClick={saveNotes} style={btn}>Save Notes</button>

      <br /><br />
      <button onClick={deleteJob} style={deleteBtn}>Delete Job</button>
    </div>
  );
}

const btn = {
  padding: "8px 15px",
  marginRight: "10px",
  marginBottom: "10px",
  cursor: "pointer"
};

const deleteBtn = {
  padding: "8px 15px",
  background: "#b71c1c",
  color: "white",
  cursor: "pointer",
  marginTop: "10px"
};

const backBtn = {
  padding: "6px 12px",
  marginBottom: "20px",
  cursor: "pointer"
};

const textarea = {
  width: "100%",
  height: "130px",
  padding: "10px",
  fontSize: "14px"
};

function formatStatus(status) {
  if (status === "pending") return "Pending";
  if (status === "in_progress") return "In Progress";
  if (status === "completed") return "Completed";
  return status;
}
