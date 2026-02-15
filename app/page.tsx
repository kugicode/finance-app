"use client"
import { useState } from "react";
import { Transaction } from "./types/transaction";
import TransactionItem from "./components/TransactionItem";

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>( [
    {id: "1", amount: 5, category: "Meal", date: new Date().toLocaleDateString()},
    {id: "2", amount: 5, category: "Coffee", date: new Date().toLocaleDateString()},
     
  ]);
  const [category, setCategory] = useState<string>('');
  const [amount, setAmount] = useState<number>(0);

  const addItem = () => {
    if(category !== '' && amount !== 0){
    setTransactions([...transactions, {id: Math.random().toString() ,amount: amount, category: category, date: new Date().toLocaleDateString()}]);
    setCategory('');
    setAmount(0);
    }
    else{
      alert("Please enter a name and amount");
    }
  }

  const deleteItem = (id: string) => {
    console.log("button clicked!");
    setTransactions(transactions.filter(t => t.id !== id));

  }
  const total = transactions.reduce((acc, current) => acc + current.amount, 0);

  return (
    <main className="flex flex-col h-screen items-center justify-center">
    <h1 className="text-4xl text-green-600">Finance app</h1>
    <input className="border-2 border-black m-1" type="text" value={category} onChange={(e) => setCategory(e.target.value)}/>
    <input className="border-2 border-black m-1" type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))}/>
    <button className="bg-green-500 p-2 rounded text-white" onClick={() => addItem()}>add item</button>
    <ul>{transactions.map((m) => 
  <TransactionItem key={m.id} transaction={m} onDelete={deleteItem}/>
    )}</ul>
    <p className="text-2xl font-bold">total: { total }</p>
    </main>
  );
}