import React, { useState } from 'react';
import { useRevision } from '../../contexts/RevisionContext';
import './WeeklyView.css';

const WeeklyView = () => {
  const { getWeekSessions, isLoading, error } = useRevision();
  const [selectedDay, setSelectedDay] = useState(null);
  
  // Get all sessions for the current week
  const weekSessions = getWeekSessions();

  // Get the days of the week for display
  const getDaysOfWeek = () => {
    const days = [];
    const today = new Date();
    // Set to the beginning of the current week (Sunday)
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - today.getDay());
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      days.push({
        date: date,
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNumber: date.getDate(),
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        isToday: date.setHours(0, 0, 0, 0) === today.setHours(0, 0, 0, 0)
      });
    }
    return days;
  };

  const daysOfWeek = getDaysOfWeek();

  // Get sessions for a specific date
  const getSessionsForDate = (date) => {
    return weekSessions.filter(session => {
      const sessionDate = new Date(session.date);
      return sessionDate.setHours(0, 0, 0, 0) === date.setHours(0, 0, 0, 0);
    });
  };

  // Handle day selection
  const handleDayClick = (date) => {
    setSelectedDay(selectedDay && selectedDay.getTime() === date.getTime() ? null : date);
  };

  if (isLoading) {
    return <div className="loading">Loading weekly sessions...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="weekly-view">
      <h2>Weekly Overview</h2>
      
      <div className="week-calendar">
        {daysOfWeek.map((day) => {
          const daySessions = getSessionsForDate(day.date);
          return (
            <div 
              key={day.date.toString()} 
              className={`day-column ${day.isToday ? 'today' : ''}`}
              onClick={() => handleDayClick(day.date)}
            >
              <div className="day-header">
                <div className="day-name">{day.dayName}</div>
                <div className="day-number">{day.dayNumber}</div>
                <div className="day-month">{day.month}</div>
              </div>
              
              <div className="day-sessions">
                <div className="session-count">
                  {daySessions.length} {daySessions.length === 1 ? 'session' : 'sessions'}
                </div>
                
                {daySessions.length > 0 && (
                  <div className="session-indicators">
                    {daySessions.map(session => (
                      <div 
                        key={session.id}
                        className={`session-indicator priority-${session.priority} ${session.completed ? 'completed' : ''}`}
                        title={`${session.subject}: ${session.topic}`}
                      ></div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {selectedDay && (
        <div className="selected-day-sessions">
          <h3>Sessions for {selectedDay.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</h3>
          
          <div className="day-session-list">
            {getSessionsForDate(selectedDay).map(session => (
              <div 
                key={session.id} 
                className={`day-session-card ${session.completed ? 'completed' : ''} priority-${session.priority}`}
              >
                <div className="session-time">
                  {session.startTime} - {session.endTime}
                </div>
                <div className="session-title">
                  <h4>{session.subject}</h4>
                  <div className="session-topic">{session.topic}</div>
                </div>
                <div className="session-duration">{session.duration} min</div>
                <div className={`session-status ${session.completed ? 'completed' : 'pending'}`}>
                  {session.completed ? 'Completed' : 'Pending'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeeklyView;