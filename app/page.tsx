"use client"
import { useState } from "react";
import { Transaction } from "./types/transaction";

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>( [
    {id: "1", amount: 5, category: "Meal"},
    {id: "2", amount: 5, category: "Coffee"} 
  ]);

  const addItem = () => {
    setTransactions([...transactions, {id: Math.random().toString() ,amount: 10, category: "Test item"}]);
  }

  const deleteItem = (id: string) => {
    console.log("button clicked!");
    setTransactions(transactions.filter(t => t.id !== id))

  }
  const total = transactions.reduce((acc, current) => acc + current.amount, 0);

  return (
    <main className="flex flex-col h-screen items-center justify-center">
    <h1 className="text-4xl text-green-600">Finance app</h1>
    <button className="bg-green-500 p-2 rounded text-white" onClick={() => addItem()}>add item</button>
    <ul>{transactions.map((m) => 
    <li key={m.id}>{ m.category }: { m.amount } <button className="bg-red-500 px-3 py-1 rounded" onClick={() => deleteItem(m.id)}>X</button></li>
    )}</ul>
    <p>total: { total }</p>
    </main>
  );
}