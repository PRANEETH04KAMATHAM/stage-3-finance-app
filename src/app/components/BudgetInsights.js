"use client";

import { useEffect, useState } from "react";

export default function BudgetInsights({ refresh }) {
  const [insights, setInsights] = useState([]);

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
          const filteredTxns = txnJson.data.filter((t) =>
            t.date.startsWith(currentMonth)
          );

          const spending = {};
          filteredTxns.forEach((t) => {
            const cat = t.category || "Others";
            spending[cat] = (spending[cat] || 0) + t.amount;
          });

          const result = budgetJson.data.map((b) => {
            const spent = spending[b.category] || 0;
            const diff = b.amount - spent;
            return {
              category: b.category,
              spent,
              budget: b.amount,
              status: diff >= 0 ? "Under Budget" : "Over Budget",
              diff: Math.abs(diff),
            };
          });

          setInsights(result);
        }
      } catch (err) {
        console.error("Error fetching budget insights", err);
      }
    };

    fetchData();
  }, [refresh]);

  return (
    <div className="p-4 border rounded shadow">
      <h2 className="text-lg font-semibold mb-3 mt-3">Spending Insights</h2>
      <ul className="space-y-2 text-sm max-h-[200px] overflow-y-auto">
        {insights.map((insight) => (
          <li key={insight.category} className="flex justify-between">
            <span className="font-medium">{insight.category}</span>
            <span
              className={
                insight.status === "Under Budget"
                  ? "text-green-600"
                  : "text-red-600"
              }
            >
              {insight.status} by ₹{insight.diff.toFixed(2)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
