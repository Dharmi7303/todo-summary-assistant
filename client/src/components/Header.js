// client/src/components/Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="container header-container">
        <div className="logo-area">
          <div className="logo">
            <span className="logo-icon">✓</span>
            <h1>TaskSumm</h1>
          </div>
          <p className="tagline">Smart task management with AI-powered summaries</p>
        </div>
        <nav className="nav">
          <Link to="/" className="nav-button">
            <span className="nav-icon">📊</span> Dashboard
          </Link>
          <Link to="/tasks" className="nav-button">
            <span className="nav-icon">📝</span> Tasks
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;