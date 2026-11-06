#!/usr/bin/env -S node
import 'dotenv/config';
import postgres from '@prisma/orm-postgres/runtime';
import { contractFromJson } from '@prisma/orm-postgres/static';
import type { Contract as End } from '../../snapshots/001a3b33f87264341a6e61912c7005a4cd93c7b10822c62c1d77b9f71401227b/contract';
import endContract from '../../snapshots/001a3b33f87264341a6e61912c7005a4cd93c7b10822c62c1d77b9f71401227b/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/b227f3e25dc244edade35acf0af628b7a8848a79925937e4b9502f9a75b6a585/contract';
import startContract from '../../snapshots/b227f3e25dc244edade35acf0af628b7a8848a79925937e4b9502f9a75b6a585/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col } from '@prisma/orm-postgres/migration';

// contrat "hydraté" de fin de migration (celui où passwordHash existe)
const contract = contractFromJson<End>(endContract);
const db = postgres({ contract, url: process.env['DATABASE_URL']! });

// bcrypt hash de "topsecret"
const DEMO_PASSWORD_HASH = '$2b$10$Uz3U4mBwsgUKte9bQKBNX.5LGJjYw1Z9Qvhxzy4gxdZrahpUU9/N2';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.addColumn({
        schema: 'public',
        table: 'user',
        column: col('passwordHash', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.dataTransform(contract, 'backfill-user-passwordHash', {
        backfillsColumn: { schema: 'public', table: 'user', column: 'passwordHash' },
        check: () =>
          db.sql.public.user.select('id').where((f, fns) => fns.eq(f.passwordHash, null)).limit(1),
        run: () =>
          db.sql.public.user
            .update({ passwordHash: DEMO_PASSWORD_HASH })
            .where((f, fns) => fns.eq(f.passwordHash, null)),
      }),
      this.setNotNull({ schema: 'public', table: 'user', column: 'passwordHash' }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);

