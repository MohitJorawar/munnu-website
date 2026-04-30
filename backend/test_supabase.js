import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Client } = pg;

// Try all common Supabase regions to find the right pooler host
const regions = [
  'ap-south-1',      // Mumbai
  'ap-southeast-1',  // Singapore
  'us-east-1',       // N. Virginia
  'us-west-1',       // N. California
  'eu-west-1',       // Ireland
  'eu-central-1',    // Frankfurt
  'ap-northeast-1',  // Tokyo
  'us-east-2',       // Ohio
];

const projectRef = 'qepownbslotgeshrazfy';
const password = process.env.DB_PASSWORD;

async function tryRegion(region) {
  const host = `aws-0-${region}.pooler.supabase.com`;
  const client = new Client({
    user: `postgres.${projectRef}`,
    host,
    database: 'postgres',
    password,
    port: 6543,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 8000,
  });

  try {
    await client.connect();
    const res = await client.query('SELECT NOW()');
    console.log(`✅ SUCCESS! Region: ${region}`);
    console.log(`   Host: ${host}`);
    console.log(`   Time: ${res.rows[0].now}`);
    await client.end();
    return true;
  } catch (err) {
    console.log(`❌ ${region}: ${err.message.substring(0, 80)}`);
    return false;
  }
}

(async () => {
  console.log('Testing Supabase regions...\n');
  for (const region of regions) {
    const success = await tryRegion(region);
    if (success) {
      console.log(`\n🎯 Use these settings in .env:`);
      console.log(`DB_USER=postgres.${projectRef}`);
      console.log(`DB_HOST=aws-0-${region}.pooler.supabase.com`);
      console.log(`DB_PORT=6543`);
      console.log(`DB_NAME=postgres`);
      break;
    }
  }
})();
