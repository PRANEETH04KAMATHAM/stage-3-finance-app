// src/components/TransactionList.js

"use client";

import { useEffect, useState } from "react";

export default function TransactionList({ refresh , onEdit }) {
  const [transactions, setTransactions] = useState([]);

  const fetchTransactions = async () => {
    try {
      const res = await fetch("/transactions"); 
      const data = await res.json();
      if (data.success) {
        setTransactions(data.data || []);
      } else {
        console.error("Failed to load transactions:", data.message);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const handleDelete = async (id) => {
  const confirmed = confirm("Are you sure you want to delete this transaction?");
  if (!confirmed) return;

  try {
    const res = await fetch(`/transactions?id=${id}`, {
      method: "DELETE",
    });

    const data = await res.json();
    if (data.success) {
      fetchTransactions(); 
    } else {
      alert("Delete failed");
    }
  } catch (err) {
    console.error(err);
    alert("Something went wrong");
  }
};


  useEffect(() => {
    fetchTransactions();
  }, [refresh]);

   return (
    <ul className="space-y-2">
      {transactions.map((txn) => (
        <li key={txn._id} className="p-3 border rounded flex justify-between items-center">
          <div>
            <p className="font-medium">{txn.description}</p>
            <p className="text-sm text-gray-500">{new Date(txn.date).toLocaleDateString()}</p>
          </div>
          <div className="flex items-center gap-3">
            <p className="font-semibold text-green-600">₹{txn.amount}</p>
            <button
              onClick={() => onEdit(txn)}
              className="text-blue-600 hover:underline"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(txn._id)}
              className="text-red-500 hover:underline"
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );

}
