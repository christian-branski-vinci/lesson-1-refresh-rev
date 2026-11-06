import { db } from "../src/prisma/db.ts";
import bcrypt from 'bcrypt';

const categories = [
  { id: 1, name: "Groceries", colour: "#16a34a" },
  { id: 2, name: "House Expenses", colour: "#2563eb" },
  { id: 3, name: "Entertainment", colour: "#db2777" },
];

const users = [
  { id: 1, name: "John Doe", email: "john.doe@example.com", bankAccount: "BE12 3456 7890 1234" },
  { id: 2, name: "Jane Doe", email: "jane.doe@example.com", bankAccount: "BE13 3456 7890 1234" },
  { id: 3, name: "Abdallah Doe", email: "abdallah.doe@example.com", bankAccount: "BE14 3456 7890 1234" },
  { id: 4, name: "Soufiane Doe", email: "soufiane.doe@example.com", bankAccount: null },
];

const expenses = [
  {
    description: "Coffee",
    amount: 3.5,
    date: "2026-10-15T08:00:00Z",
    payerId: 1,
    categoryId: 3,
    participants: [1, 2],
  },
  {
    description: "Groceries",
    amount: 45.0,
    date: "2026-10-16T17:30:00Z",
    payerId: 2,
    categoryId: 1,
    participants: [1, 2, 3],
  },
  {
    description: "Internet Bill",
    amount: 60.0,
    date: "2026-10-17T09:00:00Z",
    payerId: 3,
    categoryId: 2,
    participants: [2, 3],
  },
  {
    description: "Cinema tickets",
    amount: 24.0,
    date: "2026-10-18T20:15:00Z",
    payerId: 4,
    categoryId: 3,
    participants: [1, 4],
  },
  {
    // No category on purpose: the relation is optional, so something in the
    // demo data should exercise that.
    description: "Parking",
    amount: 4.5,
    date: "2026-10-19T11:00:00Z",
    payerId: 1,
    participants: [1],
  },
];

const transfers = [
  { amount: 1.75, sourceId: 2, targetId: 1, date: "2026-10-15T10:05:00Z" },
  { amount: 15.0, sourceId: 1, targetId: 2, date: "2026-10-17T09:00:00Z" },
  { amount: 15.0, sourceId: 3, targetId: 2, date: "2026-10-17T09:03:00Z" },
  { amount: 30.0, sourceId: 2, targetId: 3, date: "2026-10-20T22:30:00Z" },
];

async function populate() {
  // Delete in reverse dependency order: rows that point at other rows go first.
  console.log("Deleting existing data...");
  await db.orm.public.Transfer.where({}).deleteAll();
  await db.orm.public.Participations.where({}).deleteAll();
  await db.orm.public.Expense.where({}).deleteAll();
  await db.orm.public.User.where({}).deleteAll();
  await db.orm.public.Category.where({}).deleteAll();

  console.log("Creating categories...");
  await db.orm.public.Category.createAll(categories);

  console.log("Creating users...");
  const DEMO_PASSWORD = 'topsecret';
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);
  await db.orm.public.User.createAll(users.map((user) => ({ ...user, passwordHash })));

  console.log("Creating expenses...");
  for (const { participants, ...expense } of expenses) {
    await db.orm.public.Expense.create({
      ...expense,
      participants: (mutator) => mutator.connect(participants.map((id) => ({ id }))),
    });
  }

  console.log("Creating transfers...");
  await db.orm.public.Transfer.createAll(transfers);

  console.log("Done.");
}

export default populate;