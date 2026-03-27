"use client";
import { useState } from "react";
import { useEffect } from "react";
import { Transaction } from "./types/transaction";
import TransactionItem from "./components/TransactionItem";
import { Tag, CircleDollarSign, TrendingDown, TrendingUp, Plus, Loader2, Sparkles } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const [category, setCategory] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  const [type, setType] = useState<"income" | "expense">("expense");
  const [loading, setLoading] = useState(true);
  const [advice, setAdvice] = useState("");
  const [adviceLoading, setAdviceLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      //Use await to fetch...
      const res = await fetch("/api/transactions");
      //turn it into json format
      const data = await res.json();
      //Update your state!
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
      //Fethcing the ai coach
      const res = await fetch("/api/coach");
      //grabbing the json
      const data = await res.json();
      //Save the advice to a varaible!
      setAdvice(data.advice);
    } catch (error) {
      console.error("Coach error:", error);
    } finally {
      setAdviceLoading(false); // Stop the animation!
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const addItem = async () => {
    //Checking if inputs boxes are empty.
    if (category !== "" && amount !== 0) {
      setIsAdding(true);
      //Call the API to save the new transaction
      await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        //Sending amount, category, type and date to the database!
        body: JSON.stringify({ amount, category, type, date: new Date() }),
      });
      //Wait for the save, then refresh the list from the database!
      await loadData();
      //Clear the inputs
      setCategory("");
      setAmount(0);
      setIsAdding(false);
    } else {
      alert("Please enter a name and amount");
    }
  };

  const deleteItem = async (id: string) => {
    //Call the API to delete an item with its unique ID.
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
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 py-8 px-4 sm:px-6 lg:px-8 text-gray-900 dark:text-white">
      <h1 className="text-4xl text-green-600 text-center mb-2 font-bold">Finance App</h1>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mb-8 mx-auto text-center">
        <div className="bg-white dark:bg-gray-800 dark:border-gray-700 shadow-sm border border-gray-100 p-6 rounded-2xl">
          <p className="text-gray-500 font-medium">Total Balance</p>
          <p className="text-3xl font-bold mt-2">£{total.toFixed(2)}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 dark:border-gray-700 shadow-sm border border-gray-100 p-6 rounded-2xl">
          <p className="text-green-600 font-medium">Total Income</p>
          <p className="text-3xl font-bold text-green-600 mt-2">£{totalIncome.toFixed(2)}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 dark:border-gray-700 shadow-sm border border-gray-100 p-6 rounded-2xl">
          <p className="text-red-600 font-medium">Total Expense</p>
          <p className="text-3xl font-bold text-red-600 mt-2">£{totalExpense.toFixed(2)}</p>
        </div>
      </div>

      {/* AI Coach Box with Button */}
      <div className="bg-linear-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 dark:border-green-900 max-w-4xl mx-auto rounded-2xl shadow-sm border border-green-100 p-6 mb-8 ">
        <div className="flex justify-between items-center mb-4">
          <p className="text-xs font-bold text-green-600 uppercase tracking-wider flex items-center gap-2">
            <Sparkles size={14} className="text-amber-400" />
            AI Coach Insight
          </p>
          <button 
            onClick={fetchCoachAdvice}
            disabled={adviceLoading}
            className="text-xs bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-all flex items-center gap-1 cursor-pointer"
          >
            {adviceLoading ? <Loader2 size={12} className="animate-spin" /> : "Get New Tip"}
          </button>
        </div>
        
        {adviceLoading ? (
          <p className="text-green-700 dark:text-gray-300 animate-pulse font-medium italic">"The coach is thinking..."</p>
        ) : advice ? (
          <p className="text-green-900 dark:text-gray-300 italic font-medium leading-relaxed">"{advice}"</p>
        ) : (
          <p className="text-green-600 text-sm">Need some financial advice? Click the button!</p>
        )}
      </div>

      {/* Chart Section */}
      <div className="h-64 w-full max-w-4xl mx-auto bg-white dark:bg-gray-800 dark:border-gray-700 p-6 rounded-2xl shadow-md mb-8">
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
      <div className="flex flex-col items-center bg-white dark:bg-gray-800 rounded-2xl shadow-md mb-8 py-6 px-4 max-w-3xl mx-auto border border-gray-100 dark:border-gray-700">
        <div className="flex flex-wrap justify-center gap-4 w-full">
          <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-1 focus-within:ring-2 ring-green-500">
            <Tag size={18} className="text-gray-400 mr-2" />
            <input
              className="outline-none py-1 bg-transparent"
              type="text"
              placeholder="Category"
              value={category}
              //Added regex so that users can't type numbers in the category input
              onChange={(e) => setCategory(e.target.value.replace(/[^a-zA-Z\s]/g, ""))}
            />
          </div>
          <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-1 focus-within:ring-2 ring-green-500">
            <CircleDollarSign size={18} className="text-gray-400 mr-2" />
            <input
              className="outline-none py-1 bg-transparent"
              type="number"
              min="0"
              placeholder="Price"
              //setting amount to blank at the start and if user typed a number other than 0 Add that instead.
              value={amount === 0 ? "" : amount}
              onChange={(e) => {
                const val = Number(e.target.value);
                //Only updates if it 0 or higher!
                if (val >= 0) setAmount(val);
              }}
            />
          </div>
          <select
            className="border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-1 outline-none focus:ring-2 ring-green-500 bg-white dark:bg-gray-800"
            value={type}
            onChange={(e) => setType(e.target.value as "income" | "expense")}
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <button
            disabled={isAdding}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors cursor-pointer"
            onClick={addItem}
          >
            {isAdding ? <Loader2 size={18} className="animate-spin"/> : <Plus size={18} />}
            {isAdding ? "Adding..." : "Add"}
          </button>
        </div>
      </div>

      {/* Transaction List */}
      <div className="max-w-4xl mx-auto">
        {/* 1. Check if loading is true */}
        {loading ? (
          //if true show the spinner
          <div className="flex flex-col items-center p-8">
            <Loader2 className="animate-spin text-green-500 w-10 h-10" />
            <p className="mt-2 text-gray-500">Updating list...</p>
          </div>
        ) : (
          //if false, show you transaction list!
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
