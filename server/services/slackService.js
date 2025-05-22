// server/services/slackService.js
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;

console.log('Slack Webhook URL:', slackWebhookUrl ? 'Present' : 'Missing');
if (slackWebhookUrl) {
  // Check if the webhook URL looks valid
  if (!slackWebhookUrl.startsWith('https://hooks.slack.com/')) {
    console.warn('⚠️ Warning: Slack webhook URL does not appear to be valid. It should start with https://hooks.slack.com/');
  }
} else {
  console.warn('⚠️ Missing Slack webhook URL. Slack integration will not work.');
}

exports.sendToSlack = async (summary, todoCount) => {
  if (!slackWebhookUrl) {
    console.log('ℹ️ Slack integration disabled - webhook URL not configured');
    return false;
  }
  
  try {
    console.log(`Sending summary of ${todoCount} todos to Slack...`);
    
    // Check if summary is too long for Slack (max 3000 characters)
    let finalSummary = summary;
    if (summary && summary.length > 2900) {
      console.log('⚠️ Summary exceeds Slack\'s safe message limit. Truncating...');
      finalSummary = summary.substring(0, 2900) + '... [truncated due to length]';
    }
    
    const message = {
      blocks: [
        {
          type: "header",
          text: {
            type: "plain_text",
            text: `Todo Summary (${todoCount} pending items)`,
            emoji: true
          }
        },
        {
          type: "divider"
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: finalSummary || "No summary available."
          }
        },
        {
          type: "context",
          elements: [
            {
              type: "mrkdwn",
              text: `*Generated on:* ${new Date().toLocaleString()}`
            }
          ]
        }
      ]
    };
    
    console.log('About to send Slack message:');
    console.log('Webhook URL:', slackWebhookUrl);
    console.log('Message blocks:', message.blocks.length);
    
    const response = await axios.post(slackWebhookUrl, message, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 30000 // 30 second timeout - increased from 10 seconds
    });
    
    console.log('Slack API response status:', response.status);
    console.log('Slack API response data:', response.data);
    
    if (response.status !== 200) {
      throw new Error(`Slack returned status code ${response.status}`);
    }
    
    console.log(' Message successfully sent to Slack');
    return true;
  } catch (error) {
    console.error(' Error sending to Slack:', error.message);
    
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', JSON.stringify(error.response.data));
    }
    
    // More specific error diagnostics
    if (error.code === 'ETIMEDOUT' || error.code === 'ECONNABORTED') {
      console.error(' Slack request timed out. The webhook might be incorrect or your network connection is slow.');
    } else if (error.code === 'ENOTFOUND') {
      console.error(' Could not resolve Slack host. Check your internet connection.');
    } else if (error.response && error.response.status === 400) {
      console.error(' Slack webhook rejected the request. The payload might be invalid.');
    } else if (error.response && error.response.status === 404) {
      console.error(' Slack webhook URL not found. The webhook might be expired or incorrectly formatted.');
    } else if (error.response && error.response.status === 410) {
      console.error(' Slack webhook has been deleted or revoked. Please create a new webhook.');
    } else if (error.response && error.response.status === 429) {
      console.error(' Rate limit hit for Slack webhook. Try again later.');
    } 
    
    console.error('📝 Debug tips:');
    console.error('1. Verify your Slack webhook URL is correct and active');
    console.error('2. Ensure your network allows outbound HTTPS connections');
    console.error('3. Try creating a new webhook in your Slack app settings');
    console.error('4. Check if your Slack workspace still exists');
    
    // Return false instead of throwing to prevent disruption of the summary flow
    return false;
  }
};

// Add a test method to verify Slack configuration
exports.testSlackConnection = async () => {
  if (!slackWebhookUrl) {
    return { success: false, message: 'No webhook URL configured' };
  }
  
  try {
    const testMessage = {
      text: "🧪 Test message from Todo Summary Assistant"
    };
    
    const response = await axios.post(slackWebhookUrl, testMessage, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 10000
    });
    
    return { 
      success: response.status === 200,
      status: response.status,
      data: response.data
    };
  } catch (error) {
    return { 
      success: false, 
      error: error.message,
      status: error.response?.status,
      data: error.response?.data
    };
  }
};