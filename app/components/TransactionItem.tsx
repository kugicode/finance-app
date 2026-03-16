import { Transaction } from "../types/transaction";

interface Props {
    transaction: Transaction,
    onDelete: (id: string) => void
}

export default function TransactionItem({transaction, onDelete}: Props){

    return(
    <li className="bg-white shadow-md rounded-lg p-4 mb-2 flex justify-between items-center">
        <div className="flex flex-col">
        <p className="font-bold text-gray-900 text-lg leading-tight">{ transaction.category }</p>
        <p className="text-xs font-semibold text-gray-400 mt-1 uppercase tracking-widest ">{transaction.date}</p>
        </div> 
        <div>
            <span className={` ${transaction.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>{ transaction.amount }: </span>
      </div>
        <button className="bg-red-500 px-3 py-1 rounded" onClick={() => 
        onDelete(transaction.id)}>X</button></li>
    );
}