"use client"
import { useState } from "react";
import { useEffect } from "react";
import { Transaction } from "./types/transaction";
import TransactionItem from "./components/TransactionItem";

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const [category, setCategory] = useState<string>('');
  const [amount, setAmount] = useState<number>(0);
  const [type, setType] = useState<'income'|'expense'>('expense');

const loadData = async () => {
  //Use await to fetch...
  const res = await fetch('/api/transactions');
  //turn it into json format
  const data = await res.json();
  //Update your state!
  setTransactions(data);
}

useEffect(() =>  {

loadData();
}, []);
  

  const addItem = async () => {
    //Checking if inputs boxes are empty.
    if(category !== '' && amount !== 0){
      //Call the API to save the new transaction
      await fetch('/api/transactions',{
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      //Sending amount, category, type and date to the database!
      body: JSON.stringify({ amount, category, type, date: new Date() })
      });
      //Wait for the save, then refresh the list from the database!
      await loadData();
      //Clear the inputs
    setCategory('');
    setAmount(0);
    }
    else{
      alert("Please enter a name and amount");
    }
  }

  const deleteItem = async (id: string) => {
    //Call the API to delete an item with its unique ID.
    await fetch(`/api/transactions?id=${id}`, {method: 'DELETE'} );
    await loadData();

  }
  const total = transactions.reduce((acc, current) => current.type === 'income' ? acc + current.amount : acc - current.amount, 0);
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, current) => acc + current.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, current) => acc + current.amount, 0);
  return (
    <main className="flex flex-col min-h-screen items-center justify-center bg-gray-100">
    <h1 className="text-4xl text-green-600">Finance app</h1>
    <input className="border-2 border-black m-1" type="text" value={category} onChange={(e) => setCategory(e.target.value)}/>
    <input className="border-2 border-black m-1" type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))}/>
    <div className="flex flex-row gap-4 mb-6">
    <p className="text-2xl font-bold bg-white shadow-md p-4 rounded-4xl flex-1">total: { total }</p>
    <p className="text-2xl font-bold bg-white shadow-md p-4 rounded-4xl flex-1 text-green-600">total income: { totalIncome }</p>
    <p className="text-2xl font-bold bg-white shadow-md p-4 rounded-4xl flex-1 text-red-600">total expense: { totalExpense }</p>
    </div>
    <select value={type} onChange={(e) => setType(e.target.value as 'income' | 'expense')}>
      <option value="income">income</option>
      <option value="expense">expense</option>
    </select>
    <button className="bg-green-500 p-2 rounded text-white" onClick={() => addItem()}>add item</button>
    <ul>{transactions.map((m) =>
  <TransactionItem key={m.id} transaction={m} onDelete={deleteItem}/>
    )}</ul>
    </main>
  );
}