const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config();

console.log(' Gemini API Key:', process.env.GEMINI_API_KEY ? 'Present' : 'Missing');

let genAI;
let model;

try {
  if (process.env.GEMINI_API_KEY) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    console.log('Gemini client initialized');
  } else {
    console.warn('⚠️ No Gemini API key provided');
  }
} catch (error) {
  console.error(' Failed to initialize Gemini client:', error.message);
}

// Add a custom AI endpoint fallback option
const useCustomEndpoint = async (prompt) => {
  try {
    console.log('Attempting to use custom AI endpoint...');
    
    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent', 
      {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 800,
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.GEMINI_API_KEY}`
        },
        timeout: 30000 // 30 second timeout
      }
    );
    
    console.log(' Custom endpoint response received');
    
    if (response.data && 
        response.data.candidates && 
        response.data.candidates[0] && 
        response.data.candidates[0].content &&
        response.data.candidates[0].content.parts &&
        response.data.candidates[0].content.parts[0]) {
      return response.data.candidates[0].content.parts[0].text;
    } else {
      throw new Error('Invalid response format from custom endpoint');
    }
  } catch (error) {
    console.error(' Custom endpoint error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', JSON.stringify(error.response.data));
    }
    throw error;
  }
};

exports.generateSummary = async (todos) => {
  // Check for internet connectivity first
  try {
    console.log('🌐 Checking internet connectivity...');
    await axios.get('https://www.google.com', { timeout: 5000 });
    console.log(' Internet connection is working');
  } catch (error) {
    console.error(' Internet connectivity check failed:', error.message);
    console.log('⚠️ Using offline fallback due to connectivity issue');
    return generateEnhancedFallbackSummary(todos);
  }

  console.log(' Generating summary with Gemini for', todos.length, 'todos');
  
  if (!process.env.GEMINI_API_KEY) {
    console.error(' Gemini API key is not configured');
    console.log('⚠️ Using enhanced local fallback summary');
    return generateEnhancedFallbackSummary(todos);
  }

  // Format the todo list for the prompt
  const todoList = todos.map((todo, index) => 
    `${index + 1}. ${todo.title}${todo.description ? ': ' + todo.description : ''}`
  ).join('\n');
  
  const prompt = `Here are my pending tasks:

${todoList}

Please provide a detailed summary that includes:
1. Group similar tasks into logical categories
2. Suggest which tasks should be completed first based on urgency and importance
3. Recommend an efficient order for completing these tasks

Make your analysis detailed and insightful. Format your response with clear headings and bullet points.`;

  // Try multiple approaches in sequence
  try {
    console.log('Attempt 1: Using standard Gemini client...');
    if (model) {
      try {
        const result = await model.generateContent({
          contents: [{ parts: [{ text: prompt }] }]
        });
        const summary = result.response.text();
        console.log(' Standard Gemini client succeeded');
        return summary;
      } catch (standardError) {
        console.error(' Standard Gemini client failed:', standardError.message);
      }
    }
    
    console.log('Attempt 2: Using direct API endpoint...');
    try {
      const summary = await useCustomEndpoint(prompt);
      console.log(' Direct API endpoint succeeded');
      return summary;
    } catch (endpointError) {
      console.error(' Direct API endpoint failed:', endpointError.message);
    }
    
    // If all attempts failed, use the enhanced fallback
    console.log('⚠️ All API attempts failed, using enhanced local fallback');
    return generateEnhancedFallbackSummary(todos);
    
  } catch (error) {
    console.error(' Unexpected error in generateSummary:', error);
    return generateEnhancedFallbackSummary(todos);
  }
};

// Enhanced local fallback function that doesn't require API access
const generateEnhancedFallbackSummary = (todos) => {
  console.log('Using enhanced local fallback summary generation');
  
  // Group by categories if possible (simple algorithm)
  const categories = {};
  
  todos.forEach(todo => {
    const title = todo.title.toLowerCase();
    const description = (todo.description || '').toLowerCase();
    let category = 'General Tasks';
    
    // Try to determine category from keywords
    if (title.includes('meeting') || title.includes('call') || title.includes('discuss') ||
        description.includes('meeting') || description.includes('call')) {
      category = 'Meetings & Discussions';
    } else if (title.includes('email') || title.includes('message') || title.includes('reply') ||
               description.includes('email') || description.includes('message')) {
      category = 'Communications';
    } else if (title.includes('report') || title.includes('document') || title.includes('write') ||
               description.includes('report') || description.includes('document')) {
      category = 'Documentation';
    } else if (title.includes('bug') || title.includes('fix') || title.includes('code') || 
               title.includes('develop') || title.includes('app') || title.includes('create') ||
               title.includes('learn') || title.includes('project') ||
               description.includes('bug') || description.includes('code') || 
               description.includes('develop') || description.includes('app')) {
      category = 'Development & Coding';
    } else if (title.includes('review') || title.includes('check') || title.includes('test') ||
               description.includes('review') || description.includes('test')) {
      category = 'Review & Testing';
    }
    
    if (!categories[category]) {
      categories[category] = [];
    }
    categories[category].push(todo);
  });
  
  // Generate summary text
  let summary = `# Task Summary (${todos.length} pending items)\n\n`;
  
  // Calculate estimated completion times and identify priorities
  const estimatedTimes = {};
  const priorities = {};
  
  todos.forEach(todo => {
    const title = todo.title.toLowerCase();
    const description = (todo.description || '').toLowerCase();
    
    // Determine priority (high/medium/low)
    if (title.includes('asap') || title.includes('urgent') || title.includes('immediately') ||
        description.includes('asap') || description.includes('urgent')) {
      priorities[todo.id] = 'high';
    } else if (title.includes('soon') || title.includes('important') || 
               description.includes('soon') || description.includes('important')) {
      priorities[todo.id] = 'medium';
    } else {
      priorities[todo.id] = 'low';
    }
    
    // Estimate completion time based on title length and complexity words
    let estimatedMinutes = 30; // Default time
    
    if (title.length > 50 || description?.length > 200) estimatedMinutes += 30;
    if (title.includes('create') || description?.includes('create')) estimatedMinutes += 45;
    if (title.includes('complete') || description?.includes('complete')) estimatedMinutes += 60;
    if (title.includes('learn') || description?.includes('learn')) estimatedMinutes += 90;
    
    estimatedTimes[todo.id] = estimatedMinutes;
  });
  
  // Add categories with estimated times
  Object.keys(categories).forEach(category => {
    summary += `## ${category}\n`;
    categories[category].forEach(todo => {
      const priority = priorities[todo.id];
      const estimatedTime = estimatedTimes[todo.id];
      const priorityTag = priority === 'high' ? ' - **HIGH PRIORITY**' : 
                         (priority === 'medium' ? ' - *Medium Priority*' : '');
      
      summary += `- ${todo.title}${priorityTag} (Est: ${estimatedTime} min)${todo.description ? '\n  ' + todo.description : ''}\n`;
    });
    summary += '\n';
  });
  
  // Add recommended action plan
  summary += `## Recommended Action Plan\n\n`;
  
  // Sort todos by priority
  const highPriority = todos.filter(todo => priorities[todo.id] === 'high');
  const mediumPriority = todos.filter(todo => priorities[todo.id] === 'medium');
  const lowPriority = todos.filter(todo => priorities[todo.id] === 'low');
  
  // Create a suggested schedule
  summary += "### Suggested Schedule\n\n";
  
  if (highPriority.length > 0) {
    summary += "**Do First (High Priority)**\n";
    highPriority.forEach((todo, i) => {
      summary += `${i+1}. ${todo.title} - ${estimatedTimes[todo.id]} min\n`;
    });
    summary += "\n";
  }
  
  if (mediumPriority.length > 0) {
    summary += "**Do Next (Medium Priority)**\n";
    mediumPriority.forEach((todo, i) => {
      summary += `${i+1}. ${todo.title} - ${estimatedTimes[todo.id]} min\n`;
    });
    summary += "\n";
  }
  
  if (lowPriority.length > 0) {
    summary += "**Do Later (Lower Priority)**\n";
    lowPriority.forEach((todo, i) => {
      summary += `${i+1}. ${todo.title} - ${estimatedTimes[todo.id]} min\n`;
    });
    summary += "\n";
  }
  
  // Calculate total estimated time
  const totalMinutes = todos.reduce((total, todo) => total + estimatedTimes[todo.id], 0);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  
  summary += `### Time Estimate\n`;
  summary += `Total estimated time: ${hours > 0 ? `${hours} hour${hours > 1 ? 's' : ''}` : ''}${hours > 0 && minutes > 0 ? ' and ' : ''}${minutes > 0 ? `${minutes} minute${minutes > 1 ? 's' : ''}` : ''}\n\n`;
  
  // Add motivational note
  summary += `### Final Notes\n`;
  summary += `- Break down larger tasks into smaller steps for easier management\n`;
  summary += `- Consider using the Pomodoro technique (25 min work, 5 min break)\n`;
  summary += `- Celebrate your progress as you complete each task!\n\n`;
  
  summary += `*This is an automated summary based on your task list. For a more detailed AI analysis, please check that your internet connection and Gemini API key are working correctly.*`;
  
  return summary;
};
