// server/controllers/todoController.js
const { supabase } = require('../config/supabaseClient');

exports.getAllTodos = async (req, res) => {
  try {
    console.log('📝 Fetching all todos...');
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error(' Supabase error in getAllTodos:', error);
      throw error;
    }
    
    console.log(` Successfully fetched ${data.length} todos`);
    res.status(200).json(data);
  } catch (error) {
    console.error(' Error fetching todos:', error);
    res.status(500).json({ 
      error: error.message,
      details: 'Failed to fetch todos from database'
    });
  }
};

exports.createTodo = async (req, res) => {
  try {
    console.log('📝 Creating new todo with data:', req.body);
    const { title, description } = req.body;
    
    if (!title || title.trim() === '') {
      console.log(' Validation failed: Title is required');
      return res.status(400).json({ error: 'Title is required' });
    }
    
    const todoData = {
      title: title.trim(),
      description: description ? description.trim() : null,
      completed: false
    };
    
    console.log('📝 Inserting todo data:', todoData);
    
    const { data, error } = await supabase
      .from('todos')
      .insert([todoData])
      .select();
      
    if (error) {
      console.error(' Supabase error in createTodo:', error);
      throw error;
    }
    
    console.log(' Successfully created todo:', data[0]);
    res.status(201).json(data[0]);
  } catch (error) {
    console.error(' Error creating todo:', error);
    res.status(500).json({ 
      error: error.message,
      details: 'Failed to create todo in database'
    });
  }
};

exports.updateTodo = async (req, res) => {
  try {
    console.log(`📝 Updating todo ${req.params.id} with data:`, req.body);
    const { id } = req.params;
    const { title, description, completed } = req.body;
    
    const updateData = {};
    if (title !== undefined) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description ? description.trim() : null;
    if (completed !== undefined) updateData.completed = completed;
    
    const { data, error } = await supabase
      .from('todos')
      .update(updateData)
      .eq('id', id)
      .select();
      
    if (error) {
      console.error(' Supabase error in updateTodo:', error);
      throw error;
    }
    
    if (data.length === 0) {
      console.log(` Todo with id ${id} not found`);
      return res.status(404).json({ error: 'Todo not found' });
    }
    
    console.log(' Successfully updated todo:', data[0]);
    res.status(200).json(data[0]);
  } catch (error) {
    console.error(' Error updating todo:', error);
    res.status(500).json({ 
      error: error.message,
      details: 'Failed to update todo in database'
    });
  }
};

exports.deleteTodo = async (req, res) => {
  try {
    console.log(`📝 Deleting todo ${req.params.id}`);
    const { id } = req.params;
    
    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error(' Supabase error in deleteTodo:', error);
      throw error;
    }
    
    console.log(` Successfully deleted todo ${id}`);
    res.status(200).json({ message: 'Todo deleted successfully' });
  } catch (error) {
    console.error(' Error deleting todo:', error);
    res.status(500).json({ 
      error: error.message,
      details: 'Failed to delete todo from database'
    });
  }
};