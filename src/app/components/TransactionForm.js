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

export default function TransactionForm({ onSubmit, transaction = null }) {
  const isEdit = !!transaction;

  const [form, setForm] = useState({
    amount: transaction?.amount || "",
    date: transaction?.date?.slice(0, 10) || "",
    description: transaction?.description || "",
    category: transaction?.category || "Others",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.amount || !form.date || !form.description || !form.category) {
      setError("All fields are required.");
      return;
    }

    try {
      const res = await fetch("/transactions", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          amount: parseFloat(form.amount),
          id: transaction?._id,
        }),
      });

      const data = await res.json();

      if (data.success) {
        onSubmit();
        setForm({ amount: "", date: "", description: "", category: "Others" });
        setError("");
      } else {
        setError(data.message || "Failed to save transaction.");
      }
    } catch (err) {
      setError("Server error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded shadow">
      <h2 className="text-xl font-bold">{isEdit ? "Edit Transaction" : "Add Transaction"}</h2>

      <input
        name="amount"
        type="number"
        placeholder="Amount"
        value={form.amount}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />
      <input
        name="date"
        type="date"
        value={form.date}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />
      <input
        name="description"
        type="text"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />

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

      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {isEdit ? "Update" : "Add"}
      </button>
    </form>
  );
}
