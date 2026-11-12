const path = require('path');
const { runner } = require('node-pg-migrate');

const config = require('./config');
const dryRun = process.argv.includes('--dry-run');

runner({
  databaseUrl: config.database,
  dir: path.join(__dirname, 'migrations'),
  migrationsTable: 'pgmigrations',
  direction: 'up',
  singleTransaction: true,
  dryRun
}).then((migrations) => {
  const action = dryRun ? 'would be applied' : 'applied';
  console.info(`${migrations.length} migration(s) ${action}`);
}).catch((error) => {
  console.error('Migration run failed', { code: error.code || 'unknown' });
  process.exitCode = 1;
});
