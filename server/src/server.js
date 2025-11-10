import dotenv from 'dotenv';
import app from './index.js';
import { initDb, closePool } from './db.js';

dotenv.config();

const DEFAULT_PORT = 5000;
const PORT = Number.parseInt(process.env.PORT, 10) || DEFAULT_PORT;
const HOST = process.env.HOST || '0.0.0.0';

let server;

function closeServer() {
    return new Promise((resolve) => {
        if (!server) return resolve();
        server.close(() => resolve());
    });
}

async function start() {
    await initDb();
    server = app.listen(PORT, HOST, () => {
        console.log(`Server listening on http://${HOST}:${PORT}`);
    });

    server.on('error', (err) => {
        console.error('Server error:', err && (err.code || err.message));
        process.exit(1);
    });
}

async function shutdown(reason) {
    console.log(`Shutting down (${reason})...`);
    try {
        await closeServer();
        await closePool();
        console.log('Shutdown complete.');
        process.exit(0);
    } catch (err) {
        console.error('Error during shutdown:', err);
        process.exit(1);
    }
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

process.on('unhandledRejection', (reason) => {
    console.error('Unhandled Rejection:', reason);
    shutdown('unhandledRejection');
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    shutdown('uncaughtException');
});

start().catch((err) => {
    console.error('Failed to start application:', err);
    process.exit(1);
});
