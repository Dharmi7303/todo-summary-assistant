import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import TasksPage from './components/TasksPage';
import Notification from './components/Notification';
import { getAllTodos, createTodo, updateTodo, deleteTodo, summarizeTodos } from './services/api';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [summary, setSummary] = useState('');
  const [isSummarizing, setIsSummarizing] = useState(false);

  const fetchTodos = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getAllTodos();
      setTodos(data || []);
    } catch (error) {
      console.error('Fetch todos error:', error);
      showNotification(`Error fetching todos: ${error.message}`, 'error');
      setTodos([]); 
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const handleCreateTodo = async (todo) => {
    try {
      const newTodo = await createTodo(todo);
      setTodos([newTodo, ...todos]);
      showNotification('Task added successfully ✓', 'success');
      return true;
    } catch (error) {
      console.error('Error in handleCreateTodo:', error);
      showNotification(`Failed to create task: ${error.message}`, 'error');
      return false;
    }
  };

  const handleUpdateTodo = async (id, updatedTodo) => {
    try {
      const updated = await updateTodo(id, updatedTodo);
      setTodos(todos.map(todo => todo.id === id ? updated : todo));
      showNotification('Task updated successfully ✓', 'success');
    } catch (error) {
      showNotification('Failed to update task', 'error');
    }
  };

  const handleToggleComplete = async (id, completed) => {
    const todoToUpdate = todos.find(todo => todo.id === id);
    if (todoToUpdate) {
      await handleUpdateTodo(id, { ...todoToUpdate, completed: !completed });
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      await deleteTodo(id);
      setTodos(todos.filter(todo => todo.id !== id));
      showNotification('Task deleted successfully ✓', 'success');
    } catch (error) {
      showNotification('Failed to delete task', 'error');
    }
  };

  const handleSummarize = async () => {
    setIsSummarizing(true);
    setSummary('');
    try {
      const response = await summarizeTodos();
      if (response.success) {
        setSummary(response.summary);
        showNotification('Summary generated and sent to Slack ✓', 'success');
      } else {
        showNotification('Failed to generate summary', 'error');
      }
    } catch (error) {
      showNotification(`Error generating summary: ${error.message}`, 'error');
    } finally {
      setIsSummarizing(false);
    }
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  return (
    <Router>
      <div className="app">
        <Header />
        <div className="container">
          {notification && <Notification message={notification.message} type={notification.type} />}
          
          <Routes>
            <Route path="/" element={<Dashboard todos={todos} />} />
            <Route path="/tasks" element={
              <TasksPage 
                todos={todos}
                isLoading={isLoading}
                onCreateTodo={handleCreateTodo}
                onToggleComplete={handleToggleComplete}
                onDeleteTodo={handleDeleteTodo}
                onUpdateTodo={handleUpdateTodo}
                onSummarize={handleSummarize}
                summary={summary}
                isSummarizing={isSummarizing}
              />
            } />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
