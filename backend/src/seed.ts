import { Temporal } from "temporal-polyfill";
import { db } from "./prisma/db.ts";



const users = [
  { id: 1, name: "John Doe", email: "john.doe@example.com", bankAccount: "BE12 3456 7890 1234" },
  { id: 2, name: "Jane Doe", email: "jane.doe@example.com", bankAccount: "BE13 3456 7890 1234" },
  { id: 3, name: "Abdallah Doe", email: "abdallah.doe@example.com", bankAccount: "BE14 3456 7890 1234" },
  { id: 4, name: "Soufiane Doe", email: "soufiane.doe@example.com", bankAccount: "BE15 3456 7890 1234" },
];

const expensesSeed = [
  { description: "Coffee", amount: 3.5, payerId: 1, date: Temporal.Instant.from("2026-10-15T00:00:00Z"), participants: [1, 2] },
  { description: "Groceries", amount: 45.0, payerId: 2, date: Temporal.Instant.from("2026-10-16T00:00:00Z"), participants: [1, 2, 3] },
  { description: "Internet Bill", amount: 60.0, payerId: 3, date: Temporal.Instant.from("2026-10-17T00:00:00Z"), participants: [2, 3] },
];

const transfers = [
  { id: 1, amount: 1.75, sourceId: 2, targetId: 1, date: Temporal.Instant.from("2026-10-15T10:05:00Z") },
  { id: 2, amount: 15.0, sourceId: 1, targetId: 2, date: Temporal.Instant.from("2026-10-17T09:00:00Z") },
  { id: 3, amount: 15.0, sourceId: 3, targetId: 2, date: Temporal.Instant.from("2026-10-17T09:03:00Z") },
  { id: 4, amount: 30.0, sourceId: 2, targetId: 3, date: Temporal.Instant.from("2026-10-20T22:30:00Z") },
];

export async function populate() {
  // Ordre imposé par les clés étrangères
  await db.orm.public.Transfer.where({}).deleteAll();
  await db.orm.public.Expense.where({}).deleteAll();
  await db.orm.public.User.where({}).deleteAll();

  await Promise.all(users.map((u) => db.orm.public.User.create(u)));

  await Promise.all(
    expensesSeed.map(({ participants, ...fields }) =>
      db.orm.public.Expense.create({
        ...fields,
        participants: (mutator) =>
         mutator.create(participants.map((userId) => ({ userId }))),
      }),
    ),
  );

  await Promise.all(transfers.map((t) => db.orm.public.Transfer.create(t)));
}