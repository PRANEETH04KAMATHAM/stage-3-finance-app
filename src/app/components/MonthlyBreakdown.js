// src/components/MonthlyBreakdown.js

"use client";

import { useEffect, useState } from "react";

export default function MonthlyBreakdown({ refresh }) {
  const [groupedData, setGroupedData] = useState({});

  const fetchAndGroup = async () => {
    try {
      const res = await fetch("/transactions");
      const json = await res.json();

      if (json.success) {
        const groups = {};

        json.data.forEach((txn) => {
          const date = new Date(txn.date);
          const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

          if (!groups[key]) {
            groups[key] = { total: 0, txns: [] };
          }

          groups[key].total += txn.amount;
          groups[key].txns.push(txn);
        });

        const sorted = Object.entries(groups)
          .sort((a, b) => b[0].localeCompare(a[0]))
          .reduce((acc, [month, data]) => {
            acc[month] = data;
            return acc;
          }, {});

        setGroupedData(sorted);
      }
    } catch (err) {
      console.error("Failed to fetch breakdown", err);
    }
  };

  useEffect(() => {
    fetchAndGroup();
  }, [refresh]);

  return (
    <div className="mt-10">
      <h2 className="text-xl font-bold mb-4">Monthly Breakdown</h2>
      {Object.keys(groupedData).length === 0 ? (
        <p className="text-gray-500">No data yet.</p>
      ) : (
        Object.entries(groupedData).map(([month, { total, txns }]) => (
          <div key={month} className="mb-6 p-4 border rounded shadow">
            <h3 className="text-lg font-semibold mb-2">
              {month} - Total: ₹{total.toFixed(2)}
            </h3>
            <ul className="space-y-1">
              {txns.map((txn) => (
                <li key={txn._id} className="flex justify-between border-b py-1 text-sm">
                  <span>{txn.description}</span>
                  <span className="text-gray-600">₹{txn.amount}</span>
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}
