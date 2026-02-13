import { Transaction } from "../types/transaction";

interface Props {
    transaction: Transaction,
    onDelete: (id: string) => void
}

export default function TransactionItem({transaction, onDelete}: Props){

    return(
    <li>{ transaction.category }: { transaction.amount } <button className="bg-red-500 px-3 py-1 rounded" onClick={() => 
        onDelete(transaction.id)}>X</button></li>

    );

}