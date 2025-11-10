import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchTodos,
  addTodo as addTodoAction,
  toggleTodo as toggleTodoAction,
  deleteTodo as deleteTodoAction,
  updateTodo as updateTodoAction,
  clearError,
} from './store/todosSlice.js';
import TodoForm from './components/TodoForm.jsx';
import TodoItem from './components/TodoItem.jsx';

export default function App() {
  const dispatch = useDispatch();
  const { items: todos, loading, adding, error } = useSelector((s) => s.todos);

  const doneCount = useMemo(() => todos.filter((t) => t.done).length, [todos]);

  useEffect(() => {
    dispatch(fetchTodos());
  }, [dispatch]);

  async function handleAdd(payload) {
    dispatch(clearError());
    dispatch(addTodoAction(payload));
  }

  async function handleToggle(id) {
    dispatch(clearError());
    dispatch(toggleTodoAction(id));
  }

  async function handleDelete(id) {
    dispatch(clearError());
    dispatch(deleteTodoAction(id));
  }

  async function handleUpdate(id, payload) {
    dispatch(clearError());
    dispatch(updateTodoAction({ id, payload }));
  }

  return (
    <div className="container">
      <div className="app-card">
        <div className="header">
          <h1>📝 TODOs</h1>
          <span className="badge">
            {doneCount}/{todos.length} done
          </span>
        </div>

        {error && <div className="top-error" role="alert">{error}</div>}

        <TodoForm onAdd={handleAdd} loading={adding} />

        {loading ? (
          <div className="muted">Loading...</div>
        ) : todos.length === 0 ? (
          <div className="muted">No todos yet. Add your first one!</div>
        ) : (
          <div className="list" role="list">
            {todos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={handleToggle}
                onDelete={handleDelete}
                onUpdate={handleUpdate}
              />
            ))}
          </div>
        )}

        <div className="footer" style={{ marginTop: 12 }}>
          Backend: <code>/api/todos</code> • MySQL persistence
        </div>
      </div>
    </div>
  );
}
