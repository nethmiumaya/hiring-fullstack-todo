// javascript
import { Router } from 'express';
import { getPool } from '../db.js';

const router = Router();

const mapRow = (row) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    done: !!row.done,
    createdAt: row.created_at,
    updatedAt: row.updated_at
});

async function fetchTodoById(id) {
    const pool = getPool();
    const [rows] = await pool.execute(
        'SELECT id, title, description, done, created_at, updated_at FROM todos WHERE id = ?',
        [id]
    );
    return rows[0] || null;
}

router.get('/', async (req, res, next) => {
    try {
        const pool = getPool();
        const [rows] = await pool.query(
            'SELECT id, title, description, done, created_at, updated_at FROM todos ORDER BY created_at DESC'
        );
        res.json(rows.map(mapRow));
    } catch (err) {
        next(err);
    }
});

router.post('/', async (req, res, next) => {
    try {
        const title = (req.body && req.body.title || '').trim();
        const description = req.body?.description ?? null;

        if (!title) return res.status(400).json({ message: 'Title is required' });

        const pool = getPool();
        const [result] = await pool.execute(
            'INSERT INTO todos (title, description, done) VALUES (?, ?, ?)',
            [title, description, 0]
        );

        const todo = await fetchTodoById(result.insertId);
        res.status(201).json(mapRow(todo));
    } catch (err) {
        next(err);
    }
});

router.put('/:id', async (req, res, next) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (Number.isNaN(id)) return res.status(400).json({ message: 'Invalid id' });

        const updates = [];
        const values = [];

        if (typeof req.body.title === 'string') {
            const t = req.body.title.trim();
            if (!t) return res.status(400).json({ message: 'Title cannot be empty' });
            updates.push('title = ?');
            values.push(t);
        }

        if ('description' in (req.body || {})) {
            updates.push('description = ?');
            values.push(req.body.description ?? null);
        }

        if (updates.length === 0) return res.status(400).json({ message: 'Nothing to update' });

        values.push(id);
        const pool = getPool();
        const [result] = await pool.execute(
            `UPDATE todos SET ${updates.join(', ')} WHERE id = ?`,
            values
        );

        if (result.affectedRows === 0) return res.status(404).json({ message: 'Not found' });

        const todo = await fetchTodoById(id);
        res.json(mapRow(todo));
    } catch (err) {
        next(err);
    }
});

router.patch('/:id/done', async (req, res, next) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (Number.isNaN(id)) return res.status(400).json({ message: 'Invalid id' });

        const pool = getPool();
        const [result] = await pool.execute(
            'UPDATE todos SET done = NOT done WHERE id = ?',
            [id]
        );

        if (result.affectedRows === 0) return res.status(404).json({ message: 'Not found' });

        const todo = await fetchTodoById(id);
        res.json(mapRow(todo));
    } catch (err) {
        next(err);
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (Number.isNaN(id)) return res.status(400).json({ message: 'Invalid id' });

        const pool = getPool();
        const [result] = await pool.execute('DELETE FROM todos WHERE id = ?', [id]);

        if (result.affectedRows === 0) return res.status(404).json({ message: 'Not found' });

        res.status(204).send();
    } catch (err) {
        next(err);
    }
});

export default router;
