import React, { useState } from 'react';
import { useRevision } from '../../contexts/RevisionContext';
import './DailyView.css';

const DailyView = () => {
  const { getTodaySessions, completeSession, isLoading, error } = useRevision();
  const [selectedSession, setSelectedSession] = useState(null);
  
  // Get today's sessions
  const todaySessions = getTodaySessions();

  // Handle session selection for viewing details
  const handleSessionClick = (session) => {
    setSelectedSession(session === selectedSession ? null : session);
  };

  // Handle marking a session as complete
  const handleCompleteSession = (e, id) => {
    e.stopPropagation(); // Prevent triggering the session click event
    completeSession(id);
  };

  // Function to format time for display
  const formatTime = (timeString) => {
    return timeString; // For now, just return the string as-is
    // You can implement a more sophisticated time formatter if needed
  };

  if (isLoading) {
    return <div className="loading">Loading today's sessions...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (todaySessions.length === 0) {
    return (
      <div className="daily-view">
        <h2>Today's Revision Sessions</h2>
        <div className="no-sessions">No revision sessions scheduled for today.</div>
      </div>
    );
  }

  return (
    <div className="daily-view">
      <h2>Today's Revision Sessions</h2>
      
      <div className="session-list">
        {todaySessions.map(session => (
          <div 
            key={session.id} 
            className={`session-card ${session.completed ? 'completed' : ''} priority-${session.priority}`}
            onClick={() => handleSessionClick(session)}
          >
            <div className="session-header">
              <h3>{session.subject}: {session.topic}</h3>
              <div className="session-time">
                {formatTime(session.startTime)} - {formatTime(session.endTime)}
              </div>
            </div>
            
            <div className="session-actions">
              <button 
                className={`complete-btn ${session.completed ? 'completed' : ''}`}
                onClick={(e) => handleCompleteSession(e, session.id)}
                disabled={session.completed}
              >
                {session.completed ? 'Completed' : 'Mark Complete'}
              </button>
            </div>
            
            {selectedSession && selectedSession.id === session.id && (
              <div className="session-details">
                <div className="detail-item">
                  <span className="detail-label">Duration:</span>
                  <span className="detail-value">{session.duration} minutes</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Priority:</span>
                  <span className="detail-value priority-tag">{session.priority}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Resources:</span>
                  <ul className="resources-list">
                    {session.resources.map((resource, index) => (
                      <li key={index}>{resource}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DailyView;