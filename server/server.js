const app = require('./app');
const config = require('./config');
const db = require('./db_connection');

async function startServer() {
  await db.query('SELECT 1');

  return new Promise((resolve, reject) => {
    const server = app.listen(config.port, () => {
      console.info(`BidBazaar API listening on port ${config.port}`);
      resolve(server);
    });

    server.once('error', reject);
  });
}

if (require.main === module) {
  startServer().catch(async (error) => {
    console.error('Server startup failed; PostgreSQL connectivity is required', {
      code: error.code || 'unknown'
    });
    try {
      await db.end();
    } catch {
      // Preserve the original startup failure.
    }
    process.exitCode = 1;
  });
}

module.exports = { startServer };
