import { useState } from "react";

export default function AddCustomer() {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.first_name || !form.last_name) {
      alert("First and last name are required.");
      return;
    }

    await window.api.addCustomer(form);
    alert("Customer added!");

    setForm({
      first_name: "",
      last_name: "",
      email: "",
      phone: ""
    });
  };

  return (
    <div>
      <h1>Add Customer</h1>

      <input
        name="first_name"
        placeholder="First Name"
        value={form.first_name}
        onChange={handleChange}
        style={input}
      />
      <br />

      <input
        name="last_name"
        placeholder="Last Name"
        value={form.last_name}
        onChange={handleChange}
        style={input}
      />
      <br />

      <input
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        style={input}
      />
      <br />

      <input
        name="phone"
        placeholder="Phone Number"
        value={form.phone}
        onChange={handleChange}
        style={input}
      />
      <br />

      <button onClick={handleSubmit} style={button}>
        Add Customer
      </button>
    </div>
  );
}

const input = {
  padding: "10px",
  width: "250px",
  margin: "10px 0",
  fontSize: "16px"
};

const button = {
  padding: "10px 20px",
  fontSize: "16px",
  cursor: "pointer",
  marginTop: "10px"
};
