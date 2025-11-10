import axios from 'axios';

const raw = import.meta.env.VITE_API_URL;
const baseURL = (raw && raw.replace(/\/$/, '')) || 'http://127.0.0.1:3000';

export const api = axios.create({ baseURL });

function normalizeError(err) {
  const serverMsg =
    err?.response?.data?.message ||
    err?.response?.data?.error ||
    err?.response?.data ||
    null;
  const msg = serverMsg || err?.message || 'Unknown error';
  return new Error(typeof msg === 'string' ? msg : JSON.stringify(msg));
}

export async function getTodos() {
  try {
    const { data } = await api.get('/api/todos');
    return data;
  } catch (err) {
    throw normalizeError(err);
  }
}

export async function createTodo(todo) {
  try {
    const { data } = await api.post('/api/todos', todo);
    return data;
  } catch (err) {
    throw normalizeError(err);
  }
}

export async function updateTodo(id, payload) {
  try {
    const { data } = await api.put(`/api/todos/${id}`, payload);
    return data;
  } catch (err) {
    throw normalizeError(err);
  }
}

export async function toggleTodoDone(id) {
  try {
    const { data } = await api.patch(`/api/todos/${id}/done`);
    return data;
  } catch (err) {
    throw normalizeError(err);
  }
}

export async function deleteTodo(id) {
  try {
    await api.delete(`/api/todos/${id}`);
  } catch (err) {
    throw normalizeError(err);
  }
}
