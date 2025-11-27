import { useEffect, useState } from "react";

export default function Customers() {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    async function load() {
      const list = await window.api.getCustomers();
      setCustomers(list);
    }
    load();
  }, []);

  return (
    <div>
      <h1>Customer List</h1>

      {customers.length === 0 ? (
        <p>No customers found.</p>
      ) : (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th>ID</th>
              <th>First</th>
              <th>Last</th>
              <th>Email</th>
              <th>Phone</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.first_name}</td>
                <td>{c.last_name}</td>
                <td>{c.email || "-"}</td>
                <td>{c.phone || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const tableStyle = {
  borderCollapse: "collapse",
  width: "100%",
  marginTop: "20px"
};
