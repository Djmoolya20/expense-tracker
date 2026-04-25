import { useEffect, useState } from "react";
import API from "../services/api";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = ["#4CAF50", "#2196F3", "#FF9800", "#F44336", "#9C27B0", "#00BCD4"];

function ExpenseList({ token }) {
  const [data, setData] = useState([]);

  // ✅ EDIT STATES (INSIDE COMPONENT)
  const [editingId, setEditingId] = useState(null);
  const [editAmount, setEditAmount] = useState("");
  const [editCategory, setEditCategory] = useState("");

  // 🔹 FETCH
  const fetchExpenses = async () => {
    try {
      const res = await API.get("/expense", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (!token) return;

    fetchExpenses();
    const interval = setInterval(fetchExpenses, 5000);
    return () => clearInterval(interval);
  }, [token]);

  // 🔹 DELETE
  const deleteExpense = async (id) => {
    try {
      await API.delete(`/expense/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchExpenses();
    } catch (err) {
      console.log(err);
    }
  };

  // 🔹 UPDATE
  const updateExpense = async (id) => {
    try {
      await API.put(
        `/expense/${id}`,
        {
          amount: editAmount,
          category: editCategory,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setEditingId(null);
      fetchExpenses();
    } catch (err) {
      console.log(err);
    }
  };

  // 🔹 TOTAL
  const total = data.reduce((sum, e) => sum + Number(e.amount), 0);

  // 🔹 GROUP
  const grouped = data.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + Number(e.amount);
    return acc;
  }, {});

  // 🔹 CHART DATA
  const chartData = Object.keys(grouped).map((key) => ({
    name: key,
    value: grouped[key],
  }));


  return (
    <div className="container">

      {/* 🔥 CATEGORY BREAKDOWN */}
      <h3>📊 Category Breakdown</h3>
      <div
        style={{
          maxHeight: "150px",
          overflowY: "auto",
          background: "#f9f9f9",
          padding: "10px",
          borderRadius: "8px",
          marginBottom: "15px",
        }}
      >
        {Object.keys(grouped).map((cat) => (
          <div key={cat}>
            {cat}: ₹{grouped[cat]}
          </div>
        ))}
      </div>

      {/* 🔥 CHART */}
      <h3>📊 Category Chart</h3>
      <div className="card">
        <PieChart width={350} height={300}>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            outerRadius={110}
            dataKey="value"
            label={false}
          >
            {chartData.map((entry, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `₹${value}`} />
          <Legend />
        </PieChart>
      </div>

      {/* 🔥 TOTAL */}
      <div className="total-card">
        Total: ₹{total}
      </div>


      {/* 🔥 LIST */}
<div className="card">
  <div className="list-scroll">
    {data.map((e) => (
      <div key={e.id} className="list-item">

        {editingId === e.id ? (
          <>
            <input
              className="input small"
              value={editAmount}
              onChange={(ev) => setEditAmount(ev.target.value)}
            />

            <input
              className="input small"
              value={editCategory}
              onChange={(ev) => setEditCategory(ev.target.value)}
            />

            <button className="btn btn-primary" onClick={() => updateExpense(e.id)}>
              Save
            </button>

            <button className="btn btn-secondary" onClick={() => setEditingId(null)}>
              Cancel
            </button>
          </>
        ) : (
          <>
            <div>
              <strong>₹{e.amount}</strong> — {e.category}
            </div>

            <div className="actions">
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setEditingId(e.id);
                  setEditAmount(e.amount);
                  setEditCategory(e.category);
                }}
              >
                Edit
              </button>

              <button
                className="btn btn-danger"
                onClick={() => deleteExpense(e.id)}
              >
                Delete
              </button>
            </div>
          </>
        )}

      </div>
    ))}
  </div>
</div>
    </div>
  );
}

export default ExpenseList;