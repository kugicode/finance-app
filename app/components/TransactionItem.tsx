import { Transaction } from "../types/transaction";
import { Trash2 } from "lucide-react";

interface Props {
    transaction: Transaction,
    onDelete: (id: string) => void
}

export default function TransactionItem({transaction, onDelete}: Props){

    return(
    <li className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 mb-2 flex justify-between items-center">
        <div className="ml-4 flex-1">
        <p className="font-bold text-gray-900 dark:text-gray-100 text-lg leading-tight capitalize">{ transaction.category }</p>
        {/* We use new Date(transaction.date) so it turns the long string back to a Javascript Date object
        and .toLocalDateString so it formats the date in which country we're in.
        */}
        <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 mt-1 uppercase tracking-widest ">{new Date(transaction.date).toLocaleDateString()}</p>
        </div> 
        <div className="text-right mr-4">
            <span className={` ${transaction.type === 'income' ? 'text-green-500' : 'text-red-500'} font-bold text-lg` }>
               {transaction.type === 'income' ? '+' : '-'}£{ transaction.amount.toFixed(2) } </span>
      </div>
        <button className="bg-red-300 px-3 py-2 rounded cursor-pointer hover:bg-red-500" onClick={() => onDelete(transaction.id)}> 
            <Trash2 />
         </button></li>
    );
}