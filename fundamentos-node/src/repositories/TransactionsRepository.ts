import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface CreateTransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    const { income, outcome } = this.transactions
      .map(transaction =>
        transaction.type === 'income'
          ? { income: transaction.value }
          : { outcome: transaction.value },
      )
      .reduce(
        (acc, cur) => ({
          income: acc.income + (cur.income || 0),
          outcome: acc.outcome + (cur.outcome || 0),
        }),
        { income: 0, outcome: 0 },
      );

    const balance = { income, outcome, total: income - outcome } as Balance;
    return balance;
  }

  public create({ title, value, type }: CreateTransactionDTO): Transaction {
    const transaction = new Transaction({ title, value, type });

    this.transactions.push(transaction);
    return transaction;
  }
}

export default TransactionsRepository;
