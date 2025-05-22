// client/src/services/api.js
// Use the port that your server is actually running on
const API_URL = 'http://localhost:5001/api';  // Update this if needed

// Log configuration on startup
console.log('API Service initialized with direct URL:', API_URL);

// Get all todos
export const getAllTodos = async () => {
  try {
    console.log('Fetching todos from:', `${API_URL}/todos`);
    
    const response = await fetch(`${API_URL}/todos`, {
      method: 'GET',
      mode: 'cors', // Explicitly request CORS mode
      headers: {
        'Accept': 'application/json'
        // Do not set Origin header manually, browser will set it
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch todos');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching todos:', error);
    throw error;
  }
};

// Create a new todo
export const createTodo = async (todoData) => {
  try {
    const response = await fetch(`${API_URL}/todos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Origin': 'http://localhost:3000'
      },
      mode: 'cors',
      body: JSON.stringify(todoData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create todo');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating todo:', error);
    throw error;
  }
};

// Update a todo
export const updateTodo = async (id, todoData) => {
  const response = await fetch(`${API_URL}/todos/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(todoData),
  });
  
  if (!response.ok) {
    throw new Error('Failed to update todo');
  }
  
  return await response.json();
};

// Delete a todo
export const deleteTodo = async (id) => {
  const response = await fetch(`${API_URL}/todos/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error('Failed to delete todo');
  }
  
  return true;
};

// Summarize todos and send to Slack
export const summarizeTodos = async () => {
  const response = await fetch(`${API_URL}/summarize`, {
    method: 'POST',
  });
  
  if (!response.ok) {
    throw new Error('Failed to summarize todos');
  }
  
  return await response.json();
};