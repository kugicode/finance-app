"use client";
import { useState } from "react";
import { useEffect } from "react";
import { Transaction } from "./types/transaction";
import TransactionItem from "./components/TransactionItem";
import { Tag, CircleDollarSign, Plus, Loader2, Sparkles } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const [category, setCategory] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  const [type, setType] = useState<"income" | "expense">("expense");
  const [loading, setLoading] = useState(true);
  const [advice, setAdvice] = useState("");
  const [adviceLoading, setAdviceLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/transactions");
      const data = await res.json();
      setTransactions(data);
    } catch (error) {
      console.error("error loading data", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCoachAdvice = async () => {
    setAdviceLoading(true); // Start the loading animation!
    try {
      const res = await fetch("/api/coach");
      const data = await res.json();
      setAdvice(data.advice);
    } catch (error) {
      console.error("Coach error:", error);
    } finally {
      setAdviceLoading(false); // Stop the animation! 
    }
  };

  useEffect(() => {
    loadData();
    // removed fetchCoachAdvice() from here to save API quota!
  }, []);

  const addItem = async () => {
    if (category !== "" && amount !== 0) {
      await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, category, type, date: new Date() }),
      });
      await loadData();
      setCategory("");
      setAmount(0);
    } else {
      alert("Please enter a name and amount");
    }
  };

  const deleteItem = async (id: string) => {
    await fetch(`/api/transactions?id=${id}`, { method: "DELETE" });
    await loadData();
  };

  const total = transactions.reduce(
    (acc, current) =>
      current.type === "income" ? acc + current.amount : acc - current.amount,
    0,
  );
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, current) => acc + current.amount, 0);
  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, current) => acc + current.amount, 0);

  const data = [
    { name: "income", value: totalIncome },
    { name: "expense", value: totalExpense },
  ];

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl text-green-600 text-center mb-2 font-bold">Finance App</h1>
      
      {/* 📊 Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mb-8 mx-auto text-center">
        <div className="bg-white shadow-sm border border-gray-100 p-6 rounded-2xl">
          <p className="text-gray-500 font-medium">Total Balance</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">£{total.toFixed(2)}</p>
        </div>
        <div className="bg-white shadow-sm border border-gray-100 p-6 rounded-2xl">
          <p className="text-green-600 font-medium">Total Income</p>
          <p className="text-3xl font-bold text-green-600 mt-2">£{totalIncome.toFixed(2)}</p>
        </div>
        <div className="bg-white shadow-sm border border-gray-100 p-6 rounded-2xl">
          <p className="text-red-600 font-medium">Total Expense</p>
          <p className="text-3xl font-bold text-red-600 mt-2">£{totalExpense.toFixed(2)}</p>
        </div>
      </div>

      {/* AI Coach Box with Button */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 max-w-4xl mx-auto rounded-2xl shadow-sm border border-green-100 p-6 mb-8 relative">
        <div className="flex justify-between items-center mb-4">
          <p className="text-xs font-bold text-green-600 uppercase tracking-wider flex items-center gap-2">
            <Sparkles size={14} className="text-amber-400" />
            AI Coach Insight
          </p>
          <button 
            onClick={fetchCoachAdvice}
            disabled={adviceLoading}
            className="text-xs bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-all flex items-center gap-1"
          >
            {adviceLoading ? <Loader2 size={12} className="animate-spin" /> : "Get New Tip"}
          </button>
        </div>
        
        {adviceLoading ? (
          <p className="text-green-700 animate-pulse font-medium italic">"The coach is thinking... 🧠"</p>
        ) : advice ? (
          <p className="text-green-900 italic font-medium leading-relaxed">"{advice}"</p>
        ) : (
          <p className="text-green-600 text-sm">Need some financial advice? Click the button! 💡</p>
        )}
      </div>

      {/* Chart Section */}
      <div className="h-64 w-full max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow-md mb-8">
        <ResponsiveContainer width="100%" height="100%" minHeight={200}>
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" radius={[10, 10, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.name === "income" ? "#22c55e" : "#ef4444"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Entry Form */}
      <div className="flex flex-col items-center bg-white rounded-2xl shadow-md mb-8 py-6 px-4 max-w-3xl mx-auto border border-gray-100">
        <div className="flex flex-wrap justify-center gap-4 w-full">
          <div className="flex items-center border border-gray-300 rounded-lg px-3 py-1 focus-within:ring-2 ring-green-500">
            <Tag size={18} className="text-gray-400 mr-2" />
            <input
              className="outline-none py-1 bg-transparent"
              type="text"
              placeholder="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value.replace(/[^a-zA-Z\s]/g, ""))}
            />
          </div>
          <div className="flex items-center border border-gray-300 rounded-lg px-3 py-1 focus-within:ring-2 ring-green-500">
            <CircleDollarSign size={18} className="text-gray-400 mr-2" />
            <input
              className="outline-none py-1 bg-transparent"
              type="number"
              min="0"
              placeholder="Price"
              value={amount === 0 ? "" : amount}
              onChange={(e) => {
                const val = Number(e.target.value);
                if (val >= 0) setAmount(val);
              }}
            />
          </div>
          <select
            className="border border-gray-300 rounded-lg px-3 py-1 outline-none focus:ring-2 ring-green-500 bg-white"
            value={type}
            onChange={(e) => setType(e.target.value as "income" | "expense")}
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <button
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors"
            onClick={addItem}
          >
            <Plus size={18} /> Add
          </button>
        </div>
      </div>

      {/* Transaction List */}
      <div className="max-w-4xl mx-auto">
        {loading ? (
          <div className="flex flex-col items-center p-8">
            <Loader2 className="animate-spin text-green-500 w-10 h-10" />
            <p className="mt-2 text-gray-500">Updating list...</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {transactions.map((m) => (
              <TransactionItem key={m.id} transaction={m} onDelete={deleteItem} />
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
