import Image from "next/image";
import { Transaction } from "./types/transaction";

export default function Home() {
  const mockTransactions: Transaction[] = [
    {id: "1", amount: 5, category: "meal"},
    {id: "2", amount: 5, category: "Coffee"}
  ]
  return (
    <main className="flex flex-col h-screen items-center justify-center">
    <h1 className="text-4xl text-green-600">Finance app</h1>
    <ul>{mockTransactions.map((m) => 
    <li key={m.id}>{ m.category }: { m.amount } </li>
    )}</ul>
    </main>
  );
}