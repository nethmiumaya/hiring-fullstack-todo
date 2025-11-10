import { useState, useEffect, useRef } from 'react';

export default function TodoItem({ todo, onToggle, onDelete, onUpdate }) {
  const [isEditing, setEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description ?? '');

  const firstInputRef = useRef(null);

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

  // lock body scroll and focus first input when modal opens
  useEffect(() => {
    if (isEditing) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      setTimeout(() => firstInputRef.current?.focus(), 0);
      function onKey(e) {
        if (e.key === 'Escape') {
          reset();
          setEditing(false);
        }
      }
      window.addEventListener('keydown', onKey);
      return () => {
        window.removeEventListener('keydown', onKey);
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [isEditing]);

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
        <div className="title">{todo.title}</div>
        {todo.description ? (
          <div className="description">{todo.description}</div>
        ) : (
          <div className="description muted">No description</div>
        )}
      </div>
      <div className="actions">
        <button className="btn" onClick={() => setEditing(true)}>Edit</button>
        <button className="btn danger" onClick={() => onDelete(todo.id)}>Delete</button>
      </div>

      {isEditing && (
        <div
          className="modal-overlay"
          role="dialog"
          aria-modal="true"
          onMouseDown={(e) => {
            // close when clicking overlay (not the modal content)
            if (e.target.classList.contains('modal-overlay')) {
              reset();
              setEditing(false);
            }
          }}
        >
          <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
            <h2>Edit todo</h2>
            <input
              ref={firstInputRef}
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
            <div className="modal-actions">
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
