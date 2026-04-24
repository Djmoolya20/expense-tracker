import { useState, useEffect } from "react";
import Login from "./components/Login";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";

function App() {
  const [token, setToken] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("token");
    if (saved) setToken(saved);
  }, []);

  return (
    <div style={{ padding: "20px", background: "#eef2f5", minHeight: "100vh" }}>
      <h1 style={{ textAlign: "center" }}>💸 Expense Tracker</h1>

      {!token ? (
        <Login setToken={setToken} />
      ) : (
        <div style={{ maxWidth: "600px", margin: "auto" }}>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              setToken("");
            }}
            style={{
              float: "right",
              background: "#333",
              color: "white",
              padding: "5px 10px",
              borderRadius: "5px",
            }}
          >
            Logout
          </button>

          <ExpenseForm token={token} />
          <ExpenseList token={token} />
        </div>
      )}
    </div>
  );
}

export default App;