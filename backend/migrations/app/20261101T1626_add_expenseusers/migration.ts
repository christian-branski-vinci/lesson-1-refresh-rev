#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/46adb1b7c4cfa654144bd16e41bc80b52550d5845aae8897baf6d2987c92efb8/contract';
import endContract from '../../snapshots/46adb1b7c4cfa654144bd16e41bc80b52550d5845aae8897baf6d2987c92efb8/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/b31c0cdda34f8a3007f23ad411cab149d371c3b906002268192171b765904468/contract';
import startContract from '../../snapshots/b31c0cdda34f8a3007f23ad411cab149d371c3b906002268192171b765904468/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.dropTable({ schema: 'public', table: 'Participations' }),
      this.createTable({
        schema: 'public',
        table: '_ParticipantExpenses',
        columns: [
          col('expenseId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('userId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['expenseId', 'userId'])],
      }),
      this.createIndex({
        schema: 'public',
        table: '_ParticipantExpenses',
        index: '_ParticipantExpenses_expenseId_idx_69d413fa',
        columns: ['expenseId'],
      }),
      this.createIndex({
        schema: 'public',
        table: '_ParticipantExpenses',
        index: '_ParticipantExpenses_userId_idx_a489d58a',
        columns: ['userId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: '_ParticipantExpenses',
        foreignKey: {
          name: '_ParticipantExpenses_expenseId_fkey',
          columns: ['expenseId'],
          references: { schema: 'public', table: 'Expense', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: '_ParticipantExpenses',
        foreignKey: {
          name: '_ParticipantExpenses_userId_fkey',
          columns: ['userId'],
          references: { schema: 'public', table: 'User', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
