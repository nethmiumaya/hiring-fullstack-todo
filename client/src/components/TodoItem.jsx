import { useState } from 'react';

export default function TodoItem({ todo, onToggle, onDelete, onUpdate }) {
  const [isEditing, setEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description ?? '');

  function reset() {
    setTitle(todo.title);
    setDescription(todo.description ?? '');
  }

  async function save() {
    if (!title.trim()) return;
    try {
      await onUpdate(todo.id, { title: title.trim(), description: description.trim() || null });
      setEditing(false);
    } catch {
    }
  }

  return (
    <div className={`item ${todo.done ? 'done' : ''}`}>
      <input
        id={`todo-checkbox-${todo.id}`}
        name={`done-${todo.id}`}
        type="checkbox"
        checked={todo.done}
        onChange={() => onToggle(todo.id)}
        title="Mark as done/undone"
      />
      <div className="content">
        {!isEditing ? (
          <>
            <div className="title">{todo.title}</div>
            {todo.description ? (
              <div className="description">{todo.description}</div>
            ) : (
              <div className="description muted">No description</div>
            )}
          </>
        ) : (
          <>
            <input
              id={`edit-title-${todo.id}`}
              name="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
            />
            <textarea
              id={`edit-desc-${todo.id}`}
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
            />
          </>
        )}
      </div>
      <div className="actions">
        {!isEditing ? (
          <>
            <button className="btn" onClick={() => setEditing(true)}>Edit</button>
            <button className="btn danger" onClick={() => onDelete(todo.id)}>Delete</button>
          </>
        ) : (
          <>
            <button className="btn success" onClick={save} disabled={!title.trim()}>Save</button>
            <button
              className="btn"
              onClick={() => {
                reset();
                setEditing(false);
              }}
            >
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
}
