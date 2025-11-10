import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../api.js';

export const fetchTodos = createAsyncThunk('todos/fetch', async () => {
  return await api.getTodos();
});

export const addTodo = createAsyncThunk('todos/add', async (payload, thunkAPI) => {
  const created = await api.createTodo(payload);
  return created;
});

export const toggleTodo = createAsyncThunk('todos/toggle', async (id, thunkAPI) => {
  const updated = await api.toggleTodoDone(id);
  return updated;
});

export const updateTodo = createAsyncThunk('todos/update', async ({ id, payload }, thunkAPI) => {
  const updated = await api.updateTodo(id, payload);
  return updated;
});

export const deleteTodo = createAsyncThunk('todos/delete', async (id, thunkAPI) => {
  await api.deleteTodo(id);
  return id;
});

const initialState = {
  items: [],
  loading: false,
  adding: false,
  error: null,
  lastRemoved: null,
};

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || 'Failed to load todos.';
      })

      .addCase(addTodo.pending, (state, action) => {
        state.adding = true;
        state.error = null;
        const tempId = `temp-${action.meta.requestId}`;
        const payload = action.meta.arg;
        const temp = {
          id: tempId,
          title: payload.title,
          description: payload.description ?? null,
          done: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          __temp: true,
        };
        state.items.unshift(temp);
      })
      .addCase(addTodo.fulfilled, (state, action) => {
        state.adding = false;
        const tempId = `temp-${action.meta.requestId}`;
        state.items = state.items.map((t) => (t.id === tempId ? action.payload : t));
      })
      .addCase(addTodo.rejected, (state, action) => {
        state.adding = false;
        const tempId = `temp-${action.meta.requestId}`;
        state.items = state.items.filter((t) => t.id !== tempId);
        state.error = action.error?.message || 'Failed to add todo.';
      })

      .addCase(toggleTodo.pending, (state, action) => {
        state.error = null;
        const id = action.meta.arg;
        state.items = state.items.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
      })
      .addCase(toggleTodo.fulfilled, (state, action) => {
        const updated = action.payload;
        state.items = state.items.map((t) => (t.id === updated.id ? updated : t));
      })
      .addCase(toggleTodo.rejected, (state, action) => {
        const id = action.meta.arg;
        state.items = state.items.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
        state.error = action.error?.message || 'Failed to toggle todo.';
      })

      .addCase(updateTodo.pending, (state, action) => {
        state.error = null;
        const { id, payload } = action.meta.arg;
        state.items = state.items.map((t) => (t.id === id ? { ...t, ...payload } : t));
      })
      .addCase(updateTodo.fulfilled, (state, action) => {
        const updated = action.payload;
        state.items = state.items.map((t) => (t.id === updated.id ? updated : t));
      })
      .addCase(updateTodo.rejected, (state, action) => {
        state.error = action.error?.message || 'Failed to update todo.';
      })
        .addCase(deleteTodo.pending, (state, action) => {
        state.error = null;
        const id = action.meta.arg;
        const toRemove = state.items.find((t) => t.id === id) || null;
        state.lastRemoved = toRemove;
        state.items = state.items.filter((t) => t.id !== id);
      })
      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.lastRemoved = null;
      })
      .addCase(deleteTodo.rejected, (state, action) => {
        if (state.lastRemoved) {
          state.items.unshift(state.lastRemoved);
          state.lastRemoved = null;
        }
        state.error = action.error?.message || 'Failed to delete todo.';
      });
  },
});

export const { clearError } = todosSlice.actions;
export default todosSlice.reducer;

