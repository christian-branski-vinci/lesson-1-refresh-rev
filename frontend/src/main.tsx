import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';

import './index.css';
import Layout from './pages/Layout.tsx';
import Welcome from './pages/Welcome.tsx';
import ExpenseList from './pages/expenses/ExpenseList.tsx';
import ExpenseNew from './pages/expenses/ExpenseNew.tsx';
import ExpenseShow from './pages/expenses/ExpenseShow.tsx';
import { expenseListLoader } from './pages/expenses/ExpenseList.loader.ts';
import { expenseShowLoader } from './pages/expenses/ExpenseShow.loader.ts';

const router = createBrowserRouter([
  {
    // No path here: a layout route only exists to wrap its children.
    Component: Layout,
    children: [
      { index: true, Component: Welcome },
      { path: 'expenses/new', Component: ExpenseNew },
      { path: 'expenses', Component: ExpenseList, loader: expenseListLoader },
      { path: "expenses/:id", Component: ExpenseShow, loader: expenseShowLoader },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
