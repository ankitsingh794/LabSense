import 'dotenv/config.js';
import app from './app.js';
import connectDB from './config/db.js';
import http from 'http';

const PORT = process.env.PORT || 4000;

(async () => {
  try {
    await connectDB();

    const server = http.createServer(app);

    server.listen(PORT, () => {
      console.log(`✅ LabSense API running on http://localhost:${PORT}`);
    });

    const shutdown = (signal) => {
      console.log(`\n${signal} received: closing server...`);
      server.close(() => {
        console.log('🔴 Server closed.');
        process.exit(0);
      });
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);

  } catch (err) {
    console.error('❌ Server startup error:', err.message);
    process.exit(1);
  }
})();
