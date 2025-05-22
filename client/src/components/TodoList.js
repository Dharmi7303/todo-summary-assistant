// client/src/components/TodoList.js
import React, { useState } from 'react';
import TodoItem from './TodoItem';
import './TodoList.css';

const TodoList = ({ todos, isLoading, onToggleComplete, onDeleteTodo, onUpdateTodo }) => {
  const [filter, setFilter] = useState('all'); // 'all', 'active', 'completed'

  if (isLoading) {
    return (
      <div className="todo-list">
        <div className="todo-list-header">
          <h2>Your Tasks</h2>
        </div>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your tasks...</p>
        </div>
      </div>
    );
  }

  // Filter todos
  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true; // 'all'
  });

  // Sort: incomplete first, then by most recent
  const sortedTodos = [...filteredTodos].sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    return new Date(b.created_at) - new Date(a.created_at);
  });

  // Count for each category
  const counts = {
    all: todos.length,
    active: todos.filter(t => !t.completed).length,
    completed: todos.filter(t => t.completed).length
  };

  return (
    <div className="todo-list">
      <div className="todo-list-header">
        <h2>
          <span className="icon-list">📋</span> 
          Your Tasks
        </h2>
        <div className="todo-filters">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All <span className="count">{counts.all}</span>
          </button>
          <button 
            className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
            onClick={() => setFilter('active')}
          >
            Active <span className="count">{counts.active}</span>
          </button>
          <button 
            className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            Completed <span className="count">{counts.completed}</span>
          </button>
        </div>
      </div>
      
      {sortedTodos.length > 0 ? (
        <div className="list-container">
          {sortedTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggleComplete={onToggleComplete}
              onDeleteTodo={onDeleteTodo}
              onUpdateTodo={onUpdateTodo}
            />
          ))}
        </div>
      ) : (
        <div className="empty-list">
          <div className="empty-icon">🔍</div>
          <h3>No tasks found</h3>
          <p>
            {filter === 'all' 
              ? "You haven't created any tasks yet." 
              : filter === 'active' 
                ? "You don't have any active tasks."
                : "You don't have any completed tasks."}
          </p>
        </div>
      )}
    </div>
  );
};

export default TodoList;