"use client";
import { useState } from "react";
import { useEffect } from "react";
import { Transaction } from "./types/transaction";
import TransactionItem from "./components/TransactionItem";
import { Tag, CircleDollarSign, TrendingDown, TrendingUp, Plus, Loader2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const [category, setCategory] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  const [type, setType] = useState<"income" | "expense">("expense");
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    loadData();
  }, []);

  const addItem = async () => {
    //Checking if inputs boxes are empty.
    if (category !== "" && amount !== 0) {
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
    <main className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl text-green-600 text-center mb-2">Finance app</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mb-8 mx-auto">
        <p className="text-xl font-medium bg-white shadow-sm border border-gray-100 p-6 rounded-2xl text-gray-600">
          Total Balance:{" "}
          <span className="block text-3xl font-bold text-gray-900 mt-2">
            {total}
          </span>
        </p>
        <p className="text-xl font-medium bg-white shadow-sm border border-gray-100 p-6 rounded-2xl text-green-600">
          Total income:{" "}
          <span className="block text-3xl font-bold mt-2">{totalIncome}</span>
        </p>
        <p className="text-xl font-medium bg-white shadow-sm border border-gray-100 p-6 rounded-2xl text-red-600">
          Total expense:{" "}
          <span className="block text-3xl font-bold mt-2">{totalExpense}</span>
        </p>
      </div>
      <div className="h-64 w-full max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow-md mb-8">
        <ResponsiveContainer width="100%" height="100%" minHeight={200}>
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />

            <Bar dataKey="value" radius={[10, 10, 0, 0]}>
              {data.map((entry, index) => (
                <Cell
                  key={index}
                  fill={entry.name === "income" ? "#22c55e" : "#ef4444"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-col items-center bg-white rounded-2xl shadow-md mb-1.5 py-1.5 max-w-3xl mx-auto">
        <div className="flex items-center ">
          <Tag className="text-gray-400 mr-2 " />
          <input
            className="border border-gray-500 m-1 rounded-lg px-4 py-2 focus:ring-2"
            type="text"
            placeholder="Enter category..."
            value={category}
            onChange={(e) => {
              //Added regex so that users can't type numbers in the category input
              const onlyLetters = e.target.value.replace(/[^a-zA-Z\s]/g, "");
              setCategory(onlyLetters);
            }}
          />
        </div>
        <div className="flex items-center">
          <CircleDollarSign className="text-gray-400 mr-2" />
          <input
            type="number"
            min="0"
            className="border border-gray-500 m-1 rounded-lg px-4 py-2 focus:ring-2"
            placeholder="Enter price..."
            //setting amount to blank at the start and if user typed a number other than 0 Add that instead.
            value={amount === 0 ? "" : amount}
            onChange={(e) => {
              const val = Number(e.target.value);
              //Only updates if it 0 or higher!
              if (val >= 0) {
                setAmount(val);
              }
            }}
          />
        </div>
        <div className="flex items-center">
          {type === "expense" ? (
            <TrendingDown className="text-red-500 mr-2" />
          ) : (
            <TrendingUp className=" text-green-500 mr-2" />
          )}
          <select
            className="border border-gray-500 m-1 rounded-lg px-4 py-2 focus:ring-2"
            value={type}
            onChange={(e) => setType(e.target.value as "income" | "expense")}
          >
            <option value="income">income</option>
            <option value="expense">expense</option>
          </select>
        </div>
        <div className="flex items-center">
          <Plus className="text-gray-400 mr-2" />
          <button
            className="bg-green-500 p-2 rounded text-white mb-1.5"
            onClick={() => addItem()}
          >
            add item
          </button>
        </div>
      </div>
      {/* 1. Check if loading is true */}
      {loading ? (
        //if true show the spinner
        <div className="flex flex-col items-center p-4">
          <Loader2 className="animate-spin text-green-500" />
          <p className="">Updating list...</p>
        </div>
      ) : (
        //if false, show you transaction list!
        <ul>
          {transactions.map((m) => (
            <TransactionItem key={m.id} transaction={m} onDelete={deleteItem} />
          ))}
        </ul>
      )}
    </main>
  );
}
