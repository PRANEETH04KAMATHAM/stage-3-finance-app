"use client";

import { useEffect, useState } from "react";

export default function DashboardSummary({ refresh }) {
  const [transactions, setTransactions] = useState([]);
  const [total, setTotal] = useState(0);
  const [byCategory, setByCategory] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/transactions");
        const result = await res.json();

        if (result.success) {
          const txns = result.data || [];
          setTransactions(txns);

          const totalAmount = txns.reduce((sum, t) => sum + t.amount, 0);
          setTotal(totalAmount);

          const catMap = {};
          txns.forEach((t) => {
            const cat = t.category || "Others";
            catMap[cat] = (catMap[cat] || 0) + t.amount;
          });
          setByCategory(catMap);
        }
      } catch (err) {
        console.error("Error loading dashboard summary", err);
      }
    };

    fetchData();
  }, [refresh]);

  return (
    <div className="w-full ">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Dashboard Summary</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Total Expenses */}
        <div className="bg-white border rounded-xl shadow p-2">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Expenses</h3>
          <p className="text-3xl font-bold text-red-600">₹{total.toFixed(2)}</p>
        </div>

        {/* By Category */}
        <div className="bg-white border rounded-xl shadow p-2">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">By Category</h3>
          <ul className="space-y-2 max-h-[200px] overflow-y-auto pr-2 text-sm">
            {Object.entries(byCategory).map(([cat, amount]) => (
              <li key={cat} className="flex justify-between">
                <span className="text-gray-600">{cat}</span>
                <span className="text-blue-600 font-semibold">₹{amount.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white border rounded-xl shadow p-2">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Recent Transactions</h3>
          <ul className="space-y-2 max-h-[200px] overflow-y-auto pr-2 text-sm">
            {[...transactions]
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .slice(0, 5)
              .map((txn) => (
                <li key={txn._id} className="flex justify-between">
                  <span className="text-gray-600">{txn.description}</span>
                  <span className="text-green-600 font-semibold">₹{txn.amount}</span>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
