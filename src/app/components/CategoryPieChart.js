"use client";

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#B14AED", "#FF6666", "#AAAAAA"];

export default function CategoryPieChart({ refresh }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await fetch("/transactions");
        const result = await res.json();
        if (result.success) {
          const categoryMap = {};
          result.data.forEach((txn) => {
            const cat = txn.category || "Others";
            categoryMap[cat] = (categoryMap[cat] || 0) + txn.amount;
          });

          const chartData = Object.entries(categoryMap).map(([name, value]) => ({
            name,
            value,
          }));

          setData(chartData);
        }
      } catch (err) {
        console.error("Error fetching pie chart data", err);
      }
    };

    fetchTransactions();
  }, [refresh]);

  return (
    <div className="w-full h-[300px] p-2 border rounded shadow">
      <h2 className="text-lg font-semibold">Expenses by Category</h2>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            label
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
