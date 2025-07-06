"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function BudgetChart({ refresh }) {
  const [data, setData] = useState([]);

  const getCurrentMonth = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const txnRes = await fetch("/transactions");
        const txnJson = await txnRes.json();

        const budgetRes = await fetch("/budget");
        const budgetJson = await budgetRes.json();

        if (txnJson.success && budgetJson.success) {
          const currentMonth = getCurrentMonth();

          console.log("Current Month:", currentMonth);
          console.log("All Transactions:", txnJson.data);

          const filteredTxns = txnJson.data.filter(
            (t) => t.date.startsWith(currentMonth)
          );

          console.log("Filtered Transactions:", filteredTxns);

          const spending = {};
          filteredTxns.forEach((t) => {
            const cat = t.category || "Others";
            spending[cat] = (spending[cat] || 0) + t.amount;
          });

          console.log("Spending per category:", spending);
          console.log("Budgets:", budgetJson.data);

          // Combine all categories from budgets and spending
          const allCategories = new Set([
            ...budgetJson.data.map((b) => b.category),
            ...Object.keys(spending),
          ]);

          const chartData = Array.from(allCategories).map((category) => {
            const budgetEntry = budgetJson.data.find((b) => b.category === category);
            return {
              category,
              Budget: budgetEntry ? budgetEntry.amount : 0,
              Spent: spending[category] || 0,
            };
          });

          setData(chartData);
        }
      } catch (err) {
        console.error("Error loading budget chart", err);
      }
    };

    fetchData();
  }, [refresh]);

  return (
    <div className="w-full h-[350px] p-2 border rounded shadow">
      <h2 className="text-lg font-semibold mb-2">Budget vs Actual Spending</h2>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="category" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Budget" fill="#8884d8" />
          <Bar dataKey="Spent" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
