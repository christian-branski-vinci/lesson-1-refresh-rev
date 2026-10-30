#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/47500089b4baf6c61d6abeb9282af8f71cbe2b7d0100d51bdcbeb9b95aadf219/contract';
import startContract from '../../snapshots/47500089b4baf6c61d6abeb9282af8f71cbe2b7d0100d51bdcbeb9b95aadf219/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/b31c0cdda34f8a3007f23ad411cab149d371c3b906002268192171b765904468/contract';
import endContract from '../../snapshots/b31c0cdda34f8a3007f23ad411cab149d371c3b906002268192171b765904468/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, fn, primaryKey, sql } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.dropColumn({ schema: 'public', table: 'Expense', column: 'payer' }),
      this.createTable({
        schema: 'public',
        table: 'Participations',
        columns: [
          col('expenseId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('userId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['expenseId', 'userId'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'Transfer',
        columns: [
          col('amount', 'float8', { notNull: true, codecRef: { codecId: 'pg/float8@1' } }),
          col('date', 'timestamptz', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('sourceId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('targetId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'User',
        columns: [
          col('bankAccount', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('email', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.addRequiredColumnToEmptyTable({
        schema: 'public',
        table: 'Expense',
        column: 'payerId',
        type: 'int4',
      }),
      this.addUnique({
        schema: 'public',
        table: 'User',
        constraint: 'User_email_key',
        columns: ['email'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Expense',
        index: 'Expense_payerId_idx_3d3ae95d',
        columns: ['payerId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Participations',
        index: 'Participations_expenseId_idx_69d413fa',
        columns: ['expenseId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Participations',
        index: 'Participations_userId_idx_a489d58a',
        columns: ['userId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Transfer',
        index: 'Transfer_sourceId_idx_d92a2571',
        columns: ['sourceId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Transfer',
        index: 'Transfer_targetId_idx_9852d518',
        columns: ['targetId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Participations',
        foreignKey: {
          name: 'Participations_expenseId_fkey',
          columns: ['expenseId'],
          references: { schema: 'public', table: 'Expense', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Participations',
        foreignKey: {
          name: 'Participations_userId_fkey',
          columns: ['userId'],
          references: { schema: 'public', table: 'User', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Transfer',
        foreignKey: {
          name: 'Transfer_sourceId_fkey',
          columns: ['sourceId'],
          references: { schema: 'public', table: 'User', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Transfer',
        foreignKey: {
          name: 'Transfer_targetId_fkey',
          columns: ['targetId'],
          references: { schema: 'public', table: 'User', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Expense',
        foreignKey: {
          name: 'Expense_payerId_fkey',
          columns: ['payerId'],
          references: { schema: 'public', table: 'User', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
