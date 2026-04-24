import { useEffect, useState } from "react";
import axios from "axios";
import API from "../services/api";

function ExpenseList({ token }) {
  const [data, setData] = useState([]);

  // 🔹 Function to fetch data
  const fetchExpenses = async () => {
    try {
      const res = await axios.get(`${API}/expense`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ 🔥 ADD YOUR useEffect HERE
  useEffect(() => {
    if (!token) return;

    fetchExpenses(); // initial load

    const interval = setInterval(() => {
      fetchExpenses();
    }, 5000);

    return () => clearInterval(interval); // cleanup
  }, [token]);

  // 🔹 Delete function
  const deleteExpense = async (id) => {
    await axios.delete(`${API}/expense/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchExpenses();
  };
  const getTotal = () => {
  return data.reduce((sum, e) => sum + Number(e.amount), 0);
};
  return (
  <div style={{ maxWidth: "600px", margin: "auto" }}>
    
    {/* 🔥 TITLE */}
    <h2 style={{ textAlign: "center" }}>💰 Expense Dashboard</h2>

    {/* 🔥 TOTAL CARD */}
    <div
      style={{
        background: "#4CAF50",
        color: "white",
        padding: "15px",
        borderRadius: "10px",
        textAlign: "center",
        marginBottom: "20px",
        fontSize: "20px",
      }}
    >
      Total: ₹{getTotal()}
    </div>

    {/* 🔥 REFRESH BUTTON */}
    <button onClick={fetchExpenses} style={{ marginBottom: "15px" }}>
      🔄 Refresh
    </button>

    {/* 🔥 LIST */}
    {data.map((e) => (
      <div
        key={e.id}
        style={{
          background: "#f5f5f5",
          padding: "10px",
          marginBottom: "10px",
          borderRadius: "8px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <strong>₹{e.amount}</strong> — {e.category}
        </div>

        <button
          onClick={() => deleteExpense(e.id)}
          style={{
            background: "red",
            color: "white",
            border: "none",
            padding: "5px 10px",
            borderRadius: "5px",
          }}
        >
          Delete
        </button>
      </div>
    ))}
  </div>
);
}

export default ExpenseList;