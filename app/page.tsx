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
    <main className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
    <h1 className="text-4xl text-green-600 text-center mb-2">Finance app</h1>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mb-8 mx-auto">
    <p className="text-xl font-medium bg-white shadow-sm border border-gray-100 p-6 rounded-2xl text-gray-600">
      Total Balance: <span className="block text-3xl font-bold text-gray-900 mt-2">{ total }</span></p>
    <p className="text-xl font-medium bg-white shadow-sm border border-gray-100 p-6 rounded-2xl text-green-600">
      Total income: <span className="block text-3xl font-bold mt-2">{ totalIncome }</span></p>
    <p className="text-xl font-medium bg-white shadow-sm border border-gray-100 p-6 rounded-2xl text-red-600">
      Total expense: <span className="block text-3xl font-bold mt-2">{ totalExpense }</span></p>
    </div>
    <div className="flex flex-col items-center">
    <input className="border border-gray-500 m-1 " type="text" placeholder="Enter category..." value={category} onChange={(e) => setCategory(e.target.value)}/>
    <input className="border border-gray-500 m-1 " type="number" placeholder="Enter price..." value={amount} onChange={(e) => setAmount(Number(e.target.value))}/>
    <select className="border border-gray-500 m-1 " value={type} onChange={(e) => setType(e.target.value as 'income' | 'expense')}>
      <option value="income">income</option>
      <option value="expense">expense</option>
    </select>
    <button className="bg-green-500 p-2 rounded text-white" onClick={() => addItem()}>add item</button>
    </div>
    <ul>{transactions.map((m) =>
  <TransactionItem key={m.id} transaction={m} onDelete={deleteItem}/>
    )}</ul>
    </main>
  );
}