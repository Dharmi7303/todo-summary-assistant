// client/src/components/SummaryPanel.js
import React from 'react';
import './SummaryPanel.css';

const SummaryPanel = ({ pendingCount, onSummarize, summary, isLoading }) => {
  return (
    <div className="summary-panel">
      <div className="summary-header">
        <h2>
          <span className="icon-summary">✨</span> 
          Smart Summary
        </h2>
        <div className="pending-badge">
          <span>{pendingCount}</span> pending
        </div>
      </div>
      
      <div className="summary-content-container">
        <button 
          className="summarize-btn"
          onClick={onSummarize}
          disabled={isLoading || pendingCount === 0}
        >
          {isLoading ? 
            <>
              <span className="btn-spinner"></span>
              Generating Summary...
            </> : 
            <>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
              </svg>
              Generate & Send Summary
            </>
          }
        </button>
        
        {isLoading && (
          <div className="summary-loading">
            <div className="summary-loader">
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
            </div>
            <p>Our AI is analyzing your tasks and generating a smart summary...</p>
          </div>
        )}
        
        {summary && !isLoading && (
          <div className="summary-result">
            <div className="summary-text">
              {summary.split('\n').map((line, index) => {
                if (line.startsWith('#')) {
                  return <h3 key={index}>{line.replace('# ', '')}</h3>;
                }
                if (line.startsWith('##')) {
                  return <h4 key={index}>{line.replace('## ', '')}</h4>;
                }
                return line ? <p key={index}>{line}</p> : <br key={index} />;
              })}
            </div>
            <div className="summary-footer">
              <div className="summary-status">
                <span className="status-icon success">✓</span>
                <span>Summary sent to Slack</span>
              </div>
              <button className="btn-link">Share</button>
            </div>
          </div>
        )}
        
        {!summary && !isLoading && (
          <div className="summary-placeholder">
            <div className="placeholder-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
            </div>
            <h3>Generate AI Summary</h3>
            <p>Click the button above to analyze your pending tasks and receive an organized summary with priority suggestions.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SummaryPanel;