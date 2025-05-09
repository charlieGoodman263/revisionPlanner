import React, { useState, useEffect } from 'react';
import { useRevision } from '../../contexts/RevisionContext';
import './WeeklyView.css';

const WeeklyView = () => {
  const { getWeekSessions, addSession, isLoading, error } = useRevision();
  const [selectedDay, setSelectedDay] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [weekOffset, setWeekOffset] = useState(0); // 0 means current week
  const [newSession, setNewSession] = useState({
    subject: '',
    topic: '',
    date: '',
    startTime: '',
    endTime: '',
    duration: 0, // Changed default to 0
    priority: 'medium',
    completed: false,
    resources: []
  });
  const [newResource, setNewResource] = useState('');
  
  // Get all sessions for the current week
  const weekSessions = getWeekSessions(weekOffset);

  // Get the days of the week for display with week offset
  const getDaysOfWeek = () => {
    const days = [];
    const today = new Date();
    // Set to the beginning of the current week (Sunday) with offset
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - today.getDay() + (weekOffset * 7));
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      days.push({
        date: date,
        dayName: date.toLocaleDateString('en-GB', { weekday: 'short' }),
        dayNumber: date.getDate(),
        month: date.toLocaleDateString('en-GB', { month: 'short' }),
        isToday: date.setHours(0, 0, 0, 0) === today.setHours(0, 0, 0, 0)
      });
    }
    return days;
  };

  // Reset selected day when week changes
  useEffect(() => {
    setSelectedDay(null);
    setShowAddForm(false);
  }, [weekOffset]);

  const daysOfWeek = getDaysOfWeek();
  
  // Navigate to previous week
  const goToPreviousWeek = () => {
    setWeekOffset(prev => prev - 1);
  };
  
  // Navigate to next week
  const goToNextWeek = () => {
    setWeekOffset(prev => prev + 1);
  };
  
  // Navigate to current week
  const goToCurrentWeek = () => {
    setWeekOffset(0);
  };

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
    // Close the add form if we're changing days
    if (selectedDay === null || selectedDay.getTime() !== date.getTime()) {
      setShowAddForm(false);
    }
  };

  // Show the add session form
  const handleAddSessionClick = () => {
    if (selectedDay) {
      // Pre-populate the date
      const offset = selectedDay.getTimezoneOffset() * 60 * 1000; // Offset in milliseconds
      const adjustedDate = new Date(selectedDay.getTime() - offset);
      const formattedDate = adjustedDate.toISOString().split('T')[0];
      setNewSession(prev => ({
        ...prev,
        date: formattedDate
      }));
      setShowAddForm(true);
    }
  };

  // Calculate duration based on start and end time
  const calculateDuration = (startTime, endTime) => {
    if (startTime && endTime) {
      const start = new Date(`2000-01-01T${startTime}`);
      const end = new Date(`2000-01-01T${endTime}`);
      
      if (!isNaN(start) && !isNaN(end)) {
        // Calculate duration in minutes
        let duration = (end - start) / 1000 / 60;
        if (duration < 0) {
          duration = 0; // Prevent negative duration
        }
        return Math.round(duration);
      }
    }
    return 0;
  };

  // Handle input changes for the new session form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'startTime' || name === 'endTime') {
      // When time changes, update duration automatically
      const updatedStartTime = name === 'startTime' ? value : newSession.startTime;
      const updatedEndTime = name === 'endTime' ? value : newSession.endTime;
      const calculatedDuration = calculateDuration(updatedStartTime, updatedEndTime);
      
      setNewSession(prev => ({
        ...prev,
        [name]: value,
        duration: calculatedDuration
      }));
    } else {
      setNewSession(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Handle resource adding
  const handleAddResource = () => {
    if (newResource.trim()) {
      setNewSession(prev => ({
        ...prev,
        resources: [...prev.resources, newResource.trim()]
      }));
      setNewResource('');
    }
  };

  // Handle resource removal
  const handleRemoveResource = (index) => {
    setNewSession(prev => ({
      ...prev,
      resources: prev.resources.filter((_, i) => i !== index)
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Final check to ensure duration is calculated correctly
    const finalDuration = calculateDuration(newSession.startTime, newSession.endTime);
    const sessionToAdd = {
      ...newSession,
      duration: finalDuration
    };
    
    // Add the session
    // console.log("Adding session:")
    // console.log(JSON.stringify(sessionToAdd))
    addSession(sessionToAdd);
    
    // Reset the form
    setNewSession({
      subject: '',
      topic: '',
      date: selectedDay ? selectedDay.toISOString().split('T')[0] : '',
      startTime: '',
      endTime: '',
      duration: 0,
      priority: 'medium',
      completed: false,
      resources: []
    });
    
    // Close the form
    setShowAddForm(false);
  };

  // Cancel adding a session
  const handleCancel = () => {
    setShowAddForm(false);
    setNewSession({
      subject: '',
      topic: '',
      date: '',
      startTime: '',
      endTime: '',
      duration: 0,
      priority: 'medium',
      completed: false,
      resources: []
    });
  };

  if (isLoading) {
    return <div className="loading">Loading weekly sessions...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="weekly-view">
      <div className="weekly-header">
        <h2>Weekly Overview</h2>
        <div className="week-navigation">
          <button 
            className="nav-button" 
            onClick={goToPreviousWeek}
            title="Previous Week"
          >
            &lt;
          </button>
          
          <button 
            className="nav-button today-button" 
            onClick={goToCurrentWeek}
            disabled={weekOffset === 0}
            title="Current Week"
          >
            Today
          </button>
          
          <button 
            className="nav-button" 
            onClick={goToNextWeek}
            title="Next Week"
          >
            &gt;
          </button>
          
          <div className="week-indicator">
            {weekOffset === 0 ? 'Current Week' : 
             weekOffset > 0 ? `${weekOffset} ${weekOffset === 1 ? 'Week' : 'Weeks'} Ahead` : 
             `${Math.abs(weekOffset)} ${Math.abs(weekOffset) === 1 ? 'Week' : 'Weeks'} Ago`}
          </div>
        </div>
      </div>
      
      <div className="week-calendar">
        {daysOfWeek.map((day) => {
          const daySessions = getSessionsForDate(day.date);
          return (
            <div 
              key={day.date.toString()} 
              className={`day-column ${day.isToday ? 'today' : ''} ${selectedDay && selectedDay.getTime() === day.date.getTime() ? 'selected' : ''}`}
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
          <div className="selected-day-header">
            <h3>Sessions for {selectedDay.toLocaleDateString('en-GB', { weekday: 'long', month: 'long', day: 'numeric' })}</h3>
            <div className="day-header-actions">
              {weekOffset !== 0 && selectedDay < new Date() && (
                <div className="past-date-warning">
                  Note: You are adding a session for a past date
                </div>
              )}
              <button className="add-session-button" onClick={handleAddSessionClick}>
                Add New Session
              </button>
            </div>
          </div>
          
          {showAddForm ? (
            <div className="add-session-form">
              <h4>Add New Revision Session</h4>
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="subject">Subject</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={newSession.subject}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="topic">Topic</label>
                    <input
                      type="text"
                      id="topic"
                      name="topic"
                      value={newSession.topic}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="startTime">Start Time</label>
                    <input
                      type="time"
                      id="startTime"
                      name="startTime"
                      value={newSession.startTime}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="endTime">End Time</label>
                    <input
                      type="time"
                      id="endTime"
                      name="endTime"
                      value={newSession.endTime}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="duration">Duration (minutes)</label>
                    <input
                      type="text"
                      id="duration"
                      name="duration"
                      value={newSession.duration}
                      disabled
                      className="duration-display"
                    />
                    <div className="duration-hint">Calculated automatically</div>
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="priority">Priority</label>
                    <select
                      id="priority"
                      name="priority"
                      value={newSession.priority}
                      onChange={handleInputChange}
                    >
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Resources</label>
                  <div className="resources-input">
                    <input
                      type="text"
                      value={newResource}
                      onChange={(e) => setNewResource(e.target.value)}
                      placeholder="Add a resource"
                    />
                    <button type="button" onClick={handleAddResource}>Add</button>
                  </div>
                  
                  {newSession.resources.length > 0 && (
                    <div className="resources-list">
                      {newSession.resources.map((resource, index) => (
                        <div key={index} className="resource-item">
                          <span>{resource}</span>
                          <button type="button" onClick={() => handleRemoveResource(index)}>
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="form-actions">
                  <button type="button" className="cancel-button" onClick={handleCancel}>
                    Cancel
                  </button>
                  <button type="submit" className="submit-button">
                    Add Session
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="day-session-list">
              {getSessionsForDate(selectedDay).length > 0 ? (
                getSessionsForDate(selectedDay)
                  .sort((a, b) => a.startTime.localeCompare(b.startTime))
                  .map(session => (
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
                  ))
              ) : (
                <div className="no-sessions">
                  <p>No sessions scheduled for this day.</p>
                  <p>Click "Add New Session" to create one.</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WeeklyView;