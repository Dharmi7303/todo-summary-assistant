import React from 'react';
import TodoForm from './TodoForm';
import TodoList from './TodoList';
import SummaryPanel from './SummaryPanel';
import './TasksPage.css';

const TasksPage = ({ 
  todos, 
  isLoading, 
  onCreateTodo, 
  onToggleComplete, 
  onDeleteTodo,
  onUpdateTodo,
  onSummarize,
  summary,
  isSummarizing
}) => {
  const pendingTodos = todos.filter(todo => !todo.completed);
  
  return (
    <div className="tasks-page">
      <h1 className="page-title">Task Management</h1>
      
      <div className="tasks-content">
        <div className="todo-section">
          <TodoForm onCreateTodo={onCreateTodo} />
          <TodoList 
            todos={todos}
            isLoading={isLoading}
            onToggleComplete={onToggleComplete}
            onDeleteTodo={onDeleteTodo}
            onUpdateTodo={onUpdateTodo}
          />
        </div>
        
        <SummaryPanel 
          pendingCount={pendingTodos.length}
          onSummarize={onSummarize}
          summary={summary}
          isLoading={isSummarizing}
        />
      </div>
    </div>
  );
};

export default TasksPage;
