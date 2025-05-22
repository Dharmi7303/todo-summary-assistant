// client/src/components/TodoItem.js
import React, { useState } from 'react';
import './TodoItem.css';

const TodoItem = ({ todo, onToggleComplete, onDeleteTodo, onUpdateTodo }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const [editedDescription, setEditedDescription] = useState(todo.description || '');
  
  const handleDelete = async () => {
    setIsDeleting(true);
    await onDeleteTodo(todo.id);
    // No need to set isDeleting false since component will unmount
  };

  const handleEdit = () => {
    setIsEditing(true);
  };
  
  const handleCancel = () => {
    setEditedTitle(todo.title);
    setEditedDescription(todo.description || '');
    setIsEditing(false);
  };
  
  const handleSave = async () => {
    if (!editedTitle.trim()) return;
    
    await onUpdateTodo(todo.id, {
      title: editedTitle,
      description: editedDescription || null
    });
    
    setIsEditing(false);
  };
  
  // Format date
  const formattedDate = new Date(todo.created_at).toLocaleDateString('en-US', {
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  // Show edit form when in editing mode
  if (isEditing) {
    return (
      <div className="todo-item editing">
        <div className="todo-edit-form">
          <div className="edit-form-group">
            <label htmlFor={`title-${todo.id}`}>Title</label>
            <input 
              id={`title-${todo.id}`}
              type="text" 
              value={editedTitle}
              onChange={e => setEditedTitle(e.target.value)}
              className="edit-form-control"
              autoFocus
            />
          </div>
          <div className="edit-form-group">
            <label htmlFor={`description-${todo.id}`}>Description (Optional)</label>
            <textarea 
              id={`description-${todo.id}`}
              value={editedDescription}
              onChange={e => setEditedDescription(e.target.value)}
              className="edit-form-control"
              rows="3"
            />
          </div>
          <div className="edit-form-actions">
            <button onClick={handleCancel} className="btn btn-cancel">
              Cancel
            </button>
            <button 
              onClick={handleSave} 
              className="btn btn-primary"
              disabled={!editedTitle.trim()}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  // Normal display mode
  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''} ${isDeleting ? 'deleting' : ''}`}>
      <div className="todo-content">
        <label className="checkbox-container">
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => onToggleComplete(todo.id, todo.completed)}
          />
          <span className="checkmark"></span>
        </label>
        <div className="todo-text">
          <div className="todo-title-row">
            <h3>{todo.title}</h3>
            <span className="todo-date">{formattedDate}</span>
          </div>
          {todo.description && <p className="todo-description">{todo.description}</p>}
        </div>
      </div>
      <div className="todo-actions">
        <button
          className="edit-btn"
          onClick={handleEdit}
          aria-label="Edit todo"
          disabled={isDeleting}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
        </button>
        <button
          className="delete-btn"
          onClick={handleDelete}
          aria-label="Delete todo"
          disabled={isDeleting}
        >
          {isDeleting ? 
            <span className="delete-spinner"></span> :
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M12 4.5L4 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M4 4.5L12 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          }
        </button>
      </div>
    </div>
  );
};

export default TodoItem;