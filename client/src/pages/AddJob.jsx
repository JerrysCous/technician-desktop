import { useEffect, useState } from "react";

export default function AddJob() {
  const [customers, setCustomers] = useState([]);
  const [customerId, setCustomerId] = useState("");
  const [deviceType, setDeviceType] = useState("Desktop PC");
  const [brandModel, setBrandModel] = useState("");
  const [issueDescription, setIssueDescription] = useState("");
  const [notes, setNotes] = useState("");
  const [priority, setPriority] = useState("Normal");
  const [status, setStatus] = useState("pending");

  // Load customers for dropdown
  useEffect(() => {
    async function loadCustomers() {
      const list = await window.api.getCustomers();
      setCustomers(list);
    }
    loadCustomers();
  }, []);

  const handleSubmit = async () => {
    if (!customerId) {
      alert("Please select a customer.");
      return;
    }
    if (!issueDescription.trim()) {
      alert("Issue description is required.");
      return;
    }

    // Pack extra info into description + notes for now
    const fullDescription = `${deviceType} - ${brandModel || "Unknown model"} - ${issueDescription}`;
    const fullNotes = `Priority: ${priority}\n${notes || ""}`;

    const job = {
      customer_id: Number(customerId),
      description: fullDescription,
      status,
      notes: fullNotes
    };

    await window.api.addJob(job);
    alert("Job added to queue!");

    // Reset form
    setCustomerId("");
    setDeviceType("Desktop PC");
    setBrandModel("");
    setIssueDescription("");
    setNotes("");
    setPriority("Normal");
    setStatus("pending");
  };

  return (
    <div>
      <h1>Add Job</h1>

      {/* Customer select */}
      <label>Customer:</label>
      <br />
      <select
        value={customerId}
        onChange={(e) => setCustomerId(e.target.value)}
        style={selectStyle}
      >
        <option value="">-- Select Customer --</option>
        {customers.map((c) => (
          <option key={c.id} value={c.id}>
            {c.first_name} {c.last_name} ({c.phone || c.email || "No contact"})
          </option>
        ))}
      </select>

      <br /><br />

      {/* Device type */}
      <label>Device Type:</label>
      <br />
      <select
        value={deviceType}
        onChange={(e) => setDeviceType(e.target.value)}
        style={selectStyle}
      >
        <option>Desktop PC</option>
        <option>Laptop</option>
        <option>Gaming PC</option>
        <option>Phone</option>
        <option>Tablet</option>
        <option>Other</option>
      </select>

      <br /><br />

      {/* Brand / Model */}
      <label>Brand / Model:</label>
      <br />
      <input
        type="text"
        value={brandModel}
        onChange={(e) => setBrandModel(e.target.value)}
        placeholder="e.g. NZXT / Custom build / Dell G15"
        style={inputStyle}
      />

      <br />

      {/* Issue description */}
      <label>Issue Description:</label>
      <br />
      <textarea
        value={issueDescription}
        onChange={(e) => setIssueDescription(e.target.value)}
        placeholder="Describe the problem (no boot, BSOD, overheating, etc)"
        style={textareaStyle}
      />

      <br />

      {/* Notes */}
      <label>Notes:</label>
      <br />
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Extra info, accessories left with PC, passwords, etc."
        style={textareaStyle}
      />

      <br />

      {/* Priority + Status */}
      <div style={{ marginTop: "10px" }}>
        <label>Priority:&nbsp;</label>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          style={smallSelect}
        >
          <option>Low</option>
          <option>Normal</option>
          <option>High</option>
          <option>Urgent</option>
        </select>

        <span style={{ marginLeft: "20px" }} />

        <label>Status:&nbsp;</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          style={smallSelect}
        >
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <br />

      <button onClick={handleSubmit} style={buttonStyle}>
        Add Job to Queue
      </button>
    </div>
  );
}

const inputStyle = {
  padding: "8px",
  width: "320px",
  marginTop: "4px",
  marginBottom: "10px",
  fontSize: "14px"
};

const textareaStyle = {
  padding: "8px",
  width: "100%",
  height: "80px",
  marginTop: "4px",
  marginBottom: "10px",
  fontSize: "14px"
};

const selectStyle = {
  padding: "8px",
  width: "320px",
  fontSize: "14px"
};

const smallSelect = {
  padding: "6px",
  fontSize: "14px"
};

const buttonStyle = {
  padding: "10px 20px",
  fontSize: "16px",
  cursor: "pointer",
  marginTop: "10px"
};
