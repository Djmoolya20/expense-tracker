import { useState, useEffect } from "react";
import Login from "./components/Login";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import "./App.css";

function App() {
  const [token, setToken] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("token");
    if (saved) setToken(saved);
  }, []);

  return (
  <div className="container">

    {/* 🔥 HEADER */}
    <div className="header">
      <h1>💸 Expense Tracker</h1>

      {token && (
        <button
          className="btn btn-dark"
          onClick={() => {
            localStorage.removeItem("token");
            setToken("");
          }}
        >
          Logout
        </button>
      )}
    </div>

    {!token ? (
      <Login setToken={setToken} />
    ) : (
      <>
        <ExpenseForm token={token} />
        <ExpenseList token={token} />
      </>
    )}
  </div>
);
}
export default App;