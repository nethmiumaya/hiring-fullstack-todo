import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import { randomUUID } from 'crypto';
import todosRouter from './routes/todos.js';

dotenv.config();

const app = express();

app.use(helmet());
app.use(cors());
app.set('trust proxy', process.env.TRUST_PROXY === 'true');

app.use((req, res, next) => {
    req.id = req.headers['x-request-id'] || randomUUID();
    res.setHeader('X-Request-Id', req.id);
    console.log(`${req.method} ${req.url} id=${req.id}`);
    next();
});

app.use(express.json());

app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
});

app.use('/api/todos', todosRouter);

app.use((_req, res) => {
    res.status(404).json({ message: 'Not found' });
});

app.use((err, _req, res, _next) => {
    console.error(err);
    const payload = { message: 'Internal server error' };
    if (process.env.NODE_ENV !== 'production' && err && err.stack) {
        payload.stack = err.stack;
    }
    res.status(500).json(payload);
});

export default app;
