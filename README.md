# 💸 Finance Tracker App - Stage 2

This is a simple personal expense tracker built with **Next.js (App Router)**, **MongoDB**, and **Tailwind CSS**.

Stage 2 adds enhanced categorization and dashboard features on top of Stage 1.

---

## ✅ Features

### 🔁 Stage 1 Features
- Add new transactions with amount, date, and description
- Edit or delete existing transactions
- All data stored in **MongoDB**
- Client-server architecture using Next.js App Router

### 🔁 Stage 2 Additions
- ✅ Predefined **transaction categories** (e.g., Food, Health, Transport, etc.)
- ✅ Each transaction now includes a **category field**
- ✅ **Pie Chart** visualizing expenses by category (using `recharts`)
- ✅ **Dashboard Summary Cards**:
  - **Total Expenses**
  - **Category-wise Breakdown**
  - **Recent Transactions**

## ✅ Features Added in Stage 3

- ✅ All features from Stage 2:
  - Transaction logging (add, edit, delete)
  - Category assignment and visualization
  - Dashboard summary with pie and bar charts

- ✅ **Set Monthly Budgets**
  - Users can define a monthly budget per category
  - Form validates category, amount, and month

- ✅ **Budget vs Actual Spending (Chart)**
  - Interactive bar chart showing comparison between budgeted and actual spending

- ✅ **Spending Insights**
  - Get insights such as "Under Budget" or "Over Budget" with amount difference for each category
