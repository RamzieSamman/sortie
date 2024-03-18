import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';

const client = createClient({ url: 'DATABASE_URL', authToken: process.env.DB_TOKEN });

const db = drizzle(client);

const result = await db.select().from(users).all()