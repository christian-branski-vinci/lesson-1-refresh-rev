import "temporal-polyfill/global";
import express from 'express';
import logger from 'morgan';
import cors from 'cors';
import expensesRouter from './src/routes/expenses.router.ts';
import userRouter from "./src/routes/user.router.ts";
import categoryRouter from "./src/routes/categories.router.ts";
import { createYoga } from "graphql-yoga";
import { schema } from "./src/graphql/schema.ts";

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(cors({ origin: [/localhost/, /\.onrender\.com$/] }));
app.use(
  cors({
    origin: ['http://localhost:5173', /\.onrender\.com$/],
  })
);
app.get('/ping', (req, res) => {
  res.sendStatus(204);
});

app.use('/api/expenses', expensesRouter);
app.use('/api/users', userRouter);
app.use('/api/categories', categoryRouter)

const yoga = createYoga({
  schema,
  graphqlEndpoint: '/graphql',
  // Yoga ships its own CORS handling, separate from the `cors()` middleware
  // above — and its default reflects back whatever Origin it is sent. Turn
  // it off so /graphql respects the same allowlist as the REST routes.
  cors: false,
  // By default Yoga replaces every resolver error with "Unexpected error." so a
  // production server never leaks internals. In development you want the details of what went bad.
  maskedErrors: process.env.NODE_ENV === 'production',
});
app.use(yoga.graphqlEndpoint, yoga);

app.listen(3000, () => {
  console.log('Server listening on http://localhost:3000');
});

export default app;