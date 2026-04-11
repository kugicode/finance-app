import { describe, it, expect } from "vitest";

//This is a unit test for the math logic
describe('Financial calculations', () => {

    it('Should correctly calculate the total balance', () => {

    
//Set up fake data
const mockTransactions = [
    { amount: 100, type: 'income' },
    { amount: 50, type: 'expense' },
    { amount: 20, type: 'expense' },
]
//Run the Math
const total = mockTransactions.reduce(
    (acc, current) => 
current.type === 'income' ? acc + current.amount : acc - current.amount, 0
);

expect(total).toBe(30);

});

it('should correctly filter income totals', () => {
    const mockTransactions = [
        { amount: 500, type: 'income' },
        { amount: 200, type: 'expense' },
        { amount: 50, type: 'income' },
    ]

    const total = mockTransactions.filter((t) => t.type === 'income')
    .reduce((acc, current) => acc + current.amount, 0);

    expect(total).toBe(550);
})

})
