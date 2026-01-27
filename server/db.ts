import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

// Configure Neon for serverless environments with improved WebSocket handling
neonConfig.webSocketConstructor = ws;
neonConfig.useSecureWebSocket = true;
neonConfig.pipelineConnect = false;
neonConfig.pipelineTLS = false;

// Create pool only if DATABASE_URL is provided
const databaseUrl = process.env.DATABASE_URL;
export const pool = databaseUrl ? new Pool({ 
  connectionString: databaseUrl,
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 20000,
  max: 5,
  maxUses: 7500,
  allowExitOnIdle: false
}) : null;

// Handle pool errors gracefully
if (pool) {
  pool.on('error', (err) => {
    console.warn('Database pool error:', err.message);
  });
}

export const db = pool ? drizzle({ client: pool, schema }) : null;

// Test database connection on startup
export async function testConnection() {
  if (!pool) {
    console.log('⚠️  Database not configured (DATABASE_URL not set)');
    return false;
  }
  try {
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    console.log('✅ Database connection successful');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
}