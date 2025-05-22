// server/controllers/summaryController.js
const { supabase } = require('../config/supabaseClient');
const geminiService = require('../services/geminiService'); // Changed from openaiService
const slackService = require('../services/slackService');

exports.summarizeAndSend = async (req, res) => {
  try {
    console.log('Starting summarize and send process...');
    
    // Get all incomplete todos
    console.log('Fetching incomplete todos...');
    const { data: todos, error } = await supabase
      .from('todos')
      .select('*')
      .eq('completed', false);
      
    if (error) {
      console.error(' Supabase error in summarizeAndSend:', error);
      throw error;
    }
    
    console.log(`Found ${todos.length} pending todos`);
    
    if (todos.length === 0) {
      console.log('No pending todos to summarize');
      return res.status(200).json({ 
        message: 'No pending todos to summarize',
        summary: 'You have no pending tasks! Great job staying on top of things! 🎉',
        success: true
      });
    }
    
    // Generate summary using Gemini
    console.log(' Generating summary with Gemini...');
    let summary;
    let usedFallback = false;
    
    try {
      summary = await geminiService.generateSummary(todos);
      console.log(' Summary generated successfully');
      
    } catch (geminiError) {
      console.error(' Gemini error:', geminiError);
      usedFallback = true;
      
      // Fallback to a simple summary if Gemini fails
      summary = `**Your Task Summary (Fallback Mode)**

We couldn't connect to our AI service, but here's a simple summary of your tasks:

You have ${todos.length} pending task${todos.length > 1 ? 's' : ''}:

${todos.map((todo, index) => 
  `${index + 1}. ${todo.title}${todo.description ? ' - ' + todo.description : ''}`
).join('\n')}

**Suggested approach:**
- Start with the most urgent tasks first
- Break larger tasks into smaller steps  
- Set realistic deadlines
- Celebrate your progress! 🎉

You've got this! 💪

*Note: This is a simplified summary as we couldn't reach our AI service. Please try again later for a more detailed analysis.*`;
      
      console.log('Using fallback summary due to Gemini error');
    }
    
    // Send summary to Slack
    console.log('Sending summary to Slack...');
    let slackSuccess = false;
    let slackError = null;
    try {
      slackSuccess = await slackService.sendToSlack(summary, todos.length);
      if (slackSuccess) {
        console.log(' Summary sent to Slack successfully');
      } else {
        console.warn('⚠️ Failed to send to Slack but continued execution');
      }
    } catch (error) {
      slackError = error.message;
      console.error(' Slack error:', error.message);
      console.log('⚠️ Continuing despite Slack error...');
    }
    
    res.status(200).json({ 
      message: usedFallback 
        ? 'Summary generated using fallback mode due to AI service unavailability'
        : 'Summary generated successfully',
      summary,
      success: true,
      usedFallback,
      slackDelivered: slackSuccess,
      slackError: slackError,
      todoCount: todos.length
    });
  } catch (error) {
    console.error(' Error in summarize and send:', error);
    res.status(500).json({ 
      error: error.message,
      success: false,
      details: 'Failed to generate summary'
    });
  }
};