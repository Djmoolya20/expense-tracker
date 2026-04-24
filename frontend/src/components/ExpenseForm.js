import { useState } from "react";
import axios from "axios";
import API from "../services/api";

function ExpenseForm({ token }) {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");

  const addExpense = async () => {
    try {
      await axios.post(
        `${API}/expense`,
        { amount, category },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Added!");
    } catch (err) {
      alert("Error adding expense");
    }
  };

  return (
    <div>
      <h3>Add Expense</h3>
      <input placeholder="Amount" onChange={(e) => setAmount(e.target.value)} />
      <input placeholder="Category" onChange={(e) => setCategory(e.target.value)} />
      <button onClick={addExpense}>Add</button>
    </div>
  );
}

export default ExpenseForm;