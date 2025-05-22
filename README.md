# Todo Summary Assistant

An AI-powered task management application that helps organize and summarize your tasks using Google's Gemini AI, with Slack integration for team updates.

![Todo Summary Assistant Screenshot](./screenshots/dashboard.png)

## Table of Contents
- [Features](#features)
- [Architecture](#architecture)
- [Setup Instructions](#setup-instructions)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Configuration](#environment-configuration)
- [LLM Integration](#llm-integration)
  - [Google Gemini Setup](#google-gemini-setup)
  - [Fallback Mechanism](#fallback-mechanism)
- [Slack Integration](#slack-integration)
- [Development](#development)
- [Design Decisions](#design-decisions)
- [License](#license)

## Features

- Create, edit, delete, and mark tasks as complete
- Dashboard with task statistics and completion rates
- AI-powered task summarization using Google's Gemini
- Categories and priority suggestions for your tasks
- Slack integration to share task summaries with your team
- Responsive design for mobile and desktop

## Architecture

The application follows a modern client-server architecture:

- **Frontend**: React single-page application with responsive components
- **Backend**: Express.js RESTful API server
- **Database**: Supabase PostgreSQL database for data storage
- **AI Integration**: Google Gemini for task analysis and summarization
- **Notifications**: Slack webhook integration for team updates

## Setup Instructions

### Prerequisites

- Node.js 16.x or higher
- npm or yarn
- Supabase account (for database)
- Google Generative AI API key
- Slack workspace with permissions to create webhooks

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Dharmi7303/todo-summary-assistant.git
   cd todo-summary-assistant
   ```

2. Install dependencies for both client and server:
   ```bash
   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   ```

3. Create the necessary configuration files as detailed in the next section.

### Environment Configuration

1. Create a `.env` file in the `/server` directory with the following variables:

   ```
   PORT=5000
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_key
   GEMINI_API_KEY=your_gemini_api_key
   SLACK_WEBHOOK_URL=your_slack_webhook_url
   ```

2. Create Supabase database with the following structure:

   **Table: todos**
   - id: uuid (primary key)
   - title: text
   - description: text (nullable)
   - completed: boolean (default: false)
   - created_at: timestamp (default: now())
   - updated_at: timestamp (nullable)

3. Configure client proxy in `/client/package.json`:
   ```json
   "proxy": "http://localhost:5000",
   ```

## LLM Integration

### Google Gemini Setup

1. Go to [Google AI Studio](https://makersuite.google.com/)
2. Create or sign in to your Google account
3. Go to "Get API key" and create a new API key
4. Copy the API key to your `.env` file as `GEMINI_API_KEY`
5. Test the Gemini connection:
   ```bash
   cd server
   npm run test-gen-lang
   ```

The application uses Gemini's AI capabilities to:
- Group similar tasks into categories
- Suggest task priorities
- Create a logical workflow for task completion
- Provide estimated completion times

### Fallback Mechanism

The application includes a sophisticated fallback system if the AI service is unavailable:

1. First attempts with the standard Gemini client
2. If that fails, tries a direct API request
3. Finally uses a built-in algorithm for basic task categorization and prioritization

## Slack Integration

1. Create a new Slack app at [api.slack.com](https://api.slack.com/apps)
2. Enable "Incoming Webhooks" for your app
3. Create a new webhook URL for the channel where you want to receive summaries
4. Add this URL to your `.env` file as `SLACK_WEBHOOK_URL`
5. Test the Slack connection:
   ```bash
   cd server
   npm run test-slack
   ```

The Slack integration automatically:
- Formats your task summary with proper Markdown
- Includes task counts and priorities
- Sends notifications when tasks are summarized
- Handles errors gracefully if Slack is unavailable

## Development

1. Start the development server:
   ```bash
   # Start the backend (from server directory)
   npm run dev

   # Start the frontend (from client directory)
   npm start
   ```

2. Access the application:
   - Client: http://localhost:3000
   - Backend API: http://localhost:5000

## Design Decisions

### Architecture

- **Separation of Concerns**: The application strictly separates frontend and backend logic, allowing each to evolve independently.
  
- **RESTful API Design**: Clear, resource-focused endpoints make the API intuitive and maintainable.
  
- **Responsive Design**: Mobile-first approach ensures the app works well on all devices.

### AI Integration

- **Graceful Degradation**: Multiple fallback mechanisms ensure the app remains functional even when AI services are unavailable.
  
- **Enhanced Local Processing**: When AI is unavailable, sophisticated local algorithms provide meaningful task categorization and prioritization.
  
- **Optimized Prompts**: Carefully crafted AI prompts ensure high-quality, consistent summaries.

### State Management

- **React Hooks Pattern**: Using React's built-in hooks for state management keeps the codebase clean and understandable.
  
- **Optimistic UI Updates**: Operations like marking tasks complete happen instantly in the UI, then sync with the server.

### Database

- **Supabase Integration**: Combines the power of PostgreSQL with the ease of a modern API, simplifying database operations.
  
- **Timestamped Records**: Automatic created_at and updated_at fields track task history.

### Error Handling

- **Comprehensive Error Capture**: Detailed error logging with specific messages for different failure modes.
  
- **User-Friendly Notifications**: Clear, non-technical error messages shown to users.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Created by Dharmi Javiya - feel free to contact me with any questions!
