import { Router } from 'express';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransaction.service';
import GetBalanceService from '../services/GetBalance.service';

const transactionRouter = Router();

const transactionsRepository = new TransactionsRepository();
const getBalance = new GetBalanceService(transactionsRepository);

transactionRouter.get('/', (request, response) => {
  try {
    const transactions = transactionsRepository.all();

    const balance = getBalance.execute(transactions);

    const generalBalance = { transactions, balance };

    return response.json(generalBalance);
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

transactionRouter.post('/', (request, response) => {
  try {
    const { title, value, type } = request.body;

    const transactions = transactionsRepository.all();

    const balance = getBalance.execute(transactions);

    const createTransaction = new CreateTransactionService(
      transactionsRepository,
    );

    const transaction = createTransaction.execute(balance, {
      title,
      value,
      type,
    });

    return response.json(transaction);
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

export default transactionRouter;
