import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import DailyView from './components/DailyView/DailyView.js';
import WeeklyView from './components/WeeklyView/WeeklyView.js';
import PomodoroTimer from './components/PomodoroTimer/PomodoroTimer.js';
import DailyOverview from './components/DailyOverview/DailyOverview.js';
import { RevisionProvider } from './contexts/RevisionContext.js';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('daily');

  return (
    <RevisionProvider>
      <div className="app-container">
        <header className="app-header">
          <h1>Revision Planner</h1>
        </header>
        
        <Router>
          <nav className="app-nav">
            <ul>
              <li className={activeTab === 'daily' ? 'active' : ''}>
                <Link to="/" onClick={() => setActiveTab('daily')}>Today</Link>
              </li>
              <li className={activeTab === 'weekly' ? 'active' : ''}>
                <Link to="/weekly" onClick={() => setActiveTab('weekly')}>Weekly View</Link>
              </li>
              <li className={activeTab === 'pomodoro' ? 'active' : ''}>
                <Link to="/pomodoro" onClick={() => setActiveTab('pomodoro')}>Pomodoro Timer</Link>
              </li>
              <li className={activeTab === 'overview' ? 'active' : ''}>
                <Link to="/overview" onClick={() => setActiveTab('overview')}>Daily Overview</Link>
              </li>
            </ul>
          </nav>

          <main className="app-content">
            <Routes>
              <Route path="/" element={<DailyView />} />
              <Route path="/weekly" element={<WeeklyView />} />
              <Route path="/pomodoro" element={<PomodoroTimer />} />
              <Route path="/overview" element={<DailyOverview />} />
            </Routes>
          </main>
        </Router>
      </div>
    </RevisionProvider>
  );
}

export default App;