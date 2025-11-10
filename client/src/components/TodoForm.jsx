import { useState } from 'react';

export default function TodoForm({ onAdd, loading }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) return;
    await onAdd({ title: title.trim(), description: description.trim() || null });
    setTitle('');
    setDescription('');
  }

  return (
    <form className="form" onSubmit={handleSubmit} noValidate aria-labelledby="add-todo-heading">
      <label id="add-todo-heading" className="visually-hidden">Add todo</label>

      <input
        id="new-title"
        name="title"
        type="text"
        placeholder="Title *"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={loading}
        required
        autoComplete="off"
      />
      <textarea
        id="new-description"
        name="description"
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        disabled={loading}
      />
      <button type="submit" disabled={loading || !title.trim()}>
        {loading ? 'Adding...' : 'Add'}
      </button>
    </form>
  );
}
