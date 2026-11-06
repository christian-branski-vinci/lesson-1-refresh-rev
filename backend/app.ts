import "temporal-polyfill/global";
import express from 'express';
import logger from 'morgan';
import cors from 'cors';
import expensesRouter from './src/routes/expenses.router.ts';
import userRouter from "./src/routes/user.router.ts";
import categoryRouter from "./src/routes/categories.router.ts";
import authRouter from "./src/routes/auth.router.ts";
import { yoga } from './src/graphql/yoga.ts';
import { requireAuth } from "./src/middleware/requireAuth.ts";
import helmet from "helmet";

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

app.use('/api/expenses',requireAuth,  expensesRouter);
app.use('/api/users', requireAuth, userRouter);
app.use('/api/categories',requireAuth,  categoryRouter)
app.use('/api/auth', authRouter);

app.use(
  yoga.graphqlEndpoint,
  helmet.contentSecurityPolicy({
    directives: {
      'style-src': ["'self'", 'unpkg.com', "'unsafe-inline'"],
      'script-src': ["'self'", 'unpkg.com', "'unsafe-inline'"],
      'img-src': ["'self'", 'raw.githubusercontent.com'],
    },
  }),
  yoga
);


app.listen(3000, () => {
  console.log('Server listening on http://localhost:3000');
});

export default app;