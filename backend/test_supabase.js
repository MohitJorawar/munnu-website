import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Client } = pg;

// Try all common Supabase regions to find the right pooler host
const regions = [
  'ap-south-1',      // Mumbai
  'ap-southeast-1',  // Singapore
  'ap-southeast-2',  // Sydney
  'ap-northeast-1',  // Tokyo
  'ap-northeast-2',  // Seoul
  'us-east-1',       // N. Virginia
  'us-east-2',       // Ohio
  'us-west-1',       // N. California
  'us-west-2',       // Oregon
  'ca-central-1',    // Canada Central
  'eu-west-1',       // Ireland
  'eu-west-2',       // London
  'eu-west-3',       // Paris
  'eu-central-1',    // Frankfurt
  'eu-central-2',    // Zurich
  'eu-north-1',      // Stockholm
  'eu-south-1',      // Milan
  'sa-east-1',       // Sao Paulo
  'af-south-1',      // Cape Town
  'me-central-1',    // UAE
];

const projectRef = 'vrljomkxujenzmqidgvf';
const password = process.env.DB_PASSWORD;

async function tryRegion(region) {
  const clusters = ['aws-0', 'aws-1', 'aws-2'];
  for (const cluster of clusters) {
    const host = `${cluster}-${region}.pooler.supabase.com`;
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
      console.log(`✅ SUCCESS! Region: ${region}, Cluster: ${cluster}`);
      console.log(`   Host: ${host}`);
      console.log(`   Time: ${res.rows[0].now}`);
      await client.end();
      return { success: true, host, cluster };
    } catch (err) {
      console.log(`❌ ${cluster}-${region}: ${err.message.substring(0, 80)}`);
    }
  }
  return { success: false };
}

(async () => {
  console.log('Testing Supabase regions...\n');
  for (const region of regions) {
    const result = await tryRegion(region);
    if (result.success) {
      console.log(`\n🎯 Use these settings in .env:`);
      console.log(`DB_USER=postgres.${projectRef}`);
      console.log(`DB_HOST=${result.host}`);
      console.log(`DB_PORT=6543`);
      console.log(`DB_NAME=postgres`);
      break;
    }
  }
})();
