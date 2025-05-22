// client/src/components/TodoForm.js
import React, { useState } from 'react';
import './TodoForm.css';

const TodoForm = ({ onCreateTodo }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formVisible, setFormVisible] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    try {
      setIsSubmitting(true);
      const success = await onCreateTodo({ title, description });
      
      if (success) {
        // Reset form only on success
        setTitle('');
        setDescription('');
        setFormVisible(false);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="todo-form-container">
      <div className="todo-form-header">
        <h2>
          <span className="icon-add">+</span> 
          Tasks Management
        </h2>
        <button 
          className="btn btn-add" 
          onClick={() => setFormVisible(!formVisible)}
        >
          {formVisible ? 'Cancel' : 'New Task'}
        </button>
      </div>
      
      {formVisible && (
        <div className="form-wrapper">
          <form className="todo-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Task Title</label>
              <input
                id="title"
                type="text"
                placeholder="What do you need to do?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="form-control"
                required
                disabled={isSubmitting}
                autoFocus
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description (Optional)</label>
              <textarea
                id="description"
                placeholder="Add more details here..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="form-control"
                rows="3"
                disabled={isSubmitting}
              />
            </div>
            <div className="form-actions">
              <button 
                type="button" 
                className="btn btn-cancel"
                onClick={() => setFormVisible(false)}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={isSubmitting || !title.trim()}
              >
                {isSubmitting ? 'Adding...' : 'Add Task'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default TodoForm;