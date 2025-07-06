"use client";

import { useState } from "react";

const categories = [
  "Food",
  "Transport",
  "Health",
  "Entertainment",
  "Utilities",
  "Shopping",
  "Others",
];

const getCurrentMonth = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
};

export default function BudgetForm({ onSubmit }) {
  const [form, setForm] = useState({
    category: "Food",
    amount: "",
    month: getCurrentMonth(),
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.category || !form.amount || !form.month) {
      setError("All fields are required.");
      return;
    }

    try {
      const res = await fetch("/budget", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, amount: parseFloat(form.amount) }),
      });

      const data = await res.json();

      if (data.success) {
        onSubmit?.();
        setError("");
        alert("Budget saved!");
      } else {
        setError(data.message || "Failed to save budget.");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border p-4 rounded shadow max-w-md">
      <h2 className="text-xl font-bold">Set Monthly Budget</h2>

      <select
        name="category"
        value={form.category}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      >
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      <input
        name="amount"
        type="number"
        placeholder="Budget Amount"
        value={form.amount}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />

      <input
        name="month"
        type="month"
        value={form.month}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Save Budget
      </button>
    </form>
  );
}
