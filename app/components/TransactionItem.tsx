import { Transaction } from "../types/transaction";

interface Props {
    transaction: Transaction,
    onDelete: (id: string) => void
}

export default function TransactionItem({transaction, onDelete}: Props){

    return(
    <li className="bg-white shadow-md rounded-lg p-4 mb-2 flex justify-between items-center"><div>
        { transaction.category }: 
        <span className={` ${transaction.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>{ transaction.amount }: </span>
        {transaction.date}
        </div> 
        <button className="bg-red-500 px-3 py-1 rounded" onClick={() => 
        onDelete(transaction.id)}>X</button></li>

    );

}