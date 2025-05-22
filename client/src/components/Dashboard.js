import React from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = ({ todos }) => {
  const pendingTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);
  
  // Calculate completion rate
  const completionRate = todos.length > 0 
    ? Math.round((completedTodos.length / todos.length) * 100) 
    : 0;
    
  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Task Dashboard</h1>
      <p className="dashboard-description">Manage your tasks and get AI-powered summaries</p>
      
      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-title">Total Tasks</div>
          <div className="stat-value">{todos.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">Pending Tasks</div>
          <div className="stat-value">{pendingTodos.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">Completed Tasks</div>
          <div className="stat-value">{completedTodos.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">Completion Rate</div>
          <div className="stat-value">{completionRate}%</div>
        </div>
      </div>

      <div className="dashboard-actions">
        <Link to="/tasks" className="action-button primary">
          <span className="action-icon">📝</span>
          Manage Tasks
        </Link>
      </div>

      <div className="recent-activity">
        <h2>Recent Tasks</h2>
        
        {todos.length > 0 ? (
          <div className="recent-tasks-list">
            {todos.slice(0, 5).map(todo => (
              <div key={todo.id} className={`recent-task ${todo.completed ? 'completed' : 'pending'}`}>
                <div className="task-status-indicator"></div>
                <div className="task-info">
                  <h3>{todo.title}</h3>
                  {todo.description && <p>{todo.description}</p>}
                </div>
                <div className="task-badge">
                  {todo.completed ? 'Completed' : 'Pending'}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>No tasks yet</h3>
            <p>Start by creating your first task</p>
            <Link to="/tasks" className="create-task-btn">Create Task</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
