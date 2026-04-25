import { useState } from "react";
import API from "../services/api";

function ExpenseForm({ token }) {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("TOKEN:", token);

    try {
      await API.post(
        "/expense",
        {
          amount,
          category,
          description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Expense added");

      // clear inputs
      setAmount("");
      setCategory("");
      setDescription("");
    } catch (err) {
      console.log(err.response?.data || err.message);
      alert("Error adding expense");
    }
  };

  return (
  <div className="card">
    <h3 className="title">Add Expense</h3>

    <form onSubmit={handleSubmit}>
      <input
        className="input"
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <input
        className="input"
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />

      <input
        className="input"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <button className="btn btn-primary" type="submit">
        Add
      </button>
    </form>
  </div>
);
}

export default ExpenseForm;