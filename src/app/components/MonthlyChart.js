"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0].payload;

  return (
    <div className="bg-white p-3 border rounded shadow text-sm max-w-xs">
      <p className="font-semibold mb-1">{label}</p>
      <p>Total: ₹{data.total.toFixed(2)}</p>
      <ul className="mt-2 space-y-1 max-h-40 overflow-y-auto">
        {data.txns?.map((txn) => (
          <li key={txn._id} className="flex justify-between border-b pb-1">
            <span>{txn.description}</span>
            <span className="text-gray-600">₹{txn.amount}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function MonthlyChart({ refresh }) {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const res = await fetch("/transactions");
      const json = await res.json();

      if (json.success) {
        const grouped = {};

        json.data.forEach((txn) => {
          const date = new Date(txn.date);
          const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
          if (!grouped[key]) {
            grouped[key] = { total: 0, txns: [] };
          }
          grouped[key].total += txn.amount;
          grouped[key].txns.push(txn);
        });

        const chartData = Object.entries(grouped).map(([month, { total, txns }]) => ({
          month,
          total: parseFloat(total.toFixed(2)),
          txns,
        }));

        chartData.sort((a, b) => a.month.localeCompare(b.month));
        setData(chartData);
      }
    } catch (err) {
      console.error("Chart fetch error", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refresh]);

  return (
    <div className="p-4 mt-8 border rounded shadow">
      <h2 className="text-xl font-bold mb-4">Monthly Expenses</h2>
      {data.length === 0 ? (
        <p className="text-gray-500">No data to display.</p>
      ) : (
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="total" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
