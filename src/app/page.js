// src/app/page.js

"use client";

import { useState } from "react";
import TransactionForm from "./components/TransactionForm";
import TransactionList from "./components/TransactionList";

import MonthlyChart from "./components/MonthlyChart";
import MonthlyBreakdown from "./components/MonthlyBreakdown";
import CategoryPieChart from "./components/CategoryPieChart";
import DashboardSummary from "./components/DashboardSummary";

import BudgetForm from "./components/BudgetForm";
import BudgetChart from "./components/BudgetChart";
import BudgetInsights from "./components/BudgetInsights";

export default function Home() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [editingTxn, setEditingTxn] = useState(null);

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
    setEditingTxn(null); 
  };

  return (
    <main className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Personal Finance Tracker</h1>

      <TransactionForm
        onSubmit={handleRefresh}
        transaction={editingTxn}
      />

      <TransactionList
        refresh={refreshKey}
        onEdit={setEditingTxn}
      />

      <MonthlyChart refresh={refreshKey} />
      <MonthlyBreakdown refresh={refreshKey} />

      <CategoryPieChart refresh={refreshKey} />

      <div className="px-6 py-8"> 
        <DashboardSummary refresh={refreshKey} />
      </div>

      <BudgetForm onSubmit={handleRefresh} />
      <BudgetChart refresh={refreshKey} />
      <BudgetInsights refresh={refreshKey} />
    </main>
  );
}
