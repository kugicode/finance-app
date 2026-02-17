"use client"
import { useState } from "react";
import { Transaction } from "./types/transaction";
import TransactionItem from "./components/TransactionItem";

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>( [
    {id: "1", amount: 5, category: "Meal", date: new Date().toLocaleDateString(), type: 'expense'},
    {id: "2", amount: 5, category: "Coffee", date: new Date().toLocaleDateString(), type: 'expense'},
     
  ]);
  const [category, setCategory] = useState<string>('');
  const [amount, setAmount] = useState<number>(0);
  const [type, setType] = useState<'income'|'expense'>('expense');

  const addItem = () => {
    if(category !== '' && amount !== 0){
    setTransactions([...transactions, {id: Math.random().toString() ,amount: amount, category: category, date: new Date().toLocaleDateString(), type: type}]);
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
  const total = transactions.reduce((acc, current) => current.type === 'income' ? acc + current.amount : acc - current.amount, 0);
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, current) => acc + current.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, current) => acc + current.amount, 0);
  return (
    <main className="flex flex-col h-screen items-center justify-center">
    <h1 className="text-4xl text-green-600">Finance app</h1>
    <input className="border-2 border-black m-1" type="text" value={category} onChange={(e) => setCategory(e.target.value)}/>
    <input className="border-2 border-black m-1" type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))}/>
    <select value={type} onChange={(e) => setType(e.target.value as 'income' | 'expense')}>
      <option value="income">income</option>
      <option value="expense">expense</option>
    </select>
    <button className="bg-green-500 p-2 rounded text-white" onClick={() => addItem()}>add item</button>
    <ul>{transactions.map((m) =>
  <TransactionItem key={m.id} transaction={m} onDelete={deleteItem}/>
    )}</ul>
    <p className="text-2xl font-bold">total: { total }</p>
    <p className="text-2xl font-bold">total income: { totalIncome }</p>
    <p className="text-2xl font-bold">total expense: { totalExpense }</p>
    </main>
  );
}