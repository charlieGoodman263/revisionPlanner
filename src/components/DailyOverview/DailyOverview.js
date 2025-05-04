import React, { useMemo } from 'react';
import { useRevision } from '../../contexts/RevisionContext';
import './DailyOverview.css';

const DailyOverview = () => {
  const { getTodaySessions, getWeekSessions, isLoading, error } = useRevision();
  
  // Get today's sessions
  const todaySessions = getTodaySessions();
  
  // Get current week's sessions
  const weekSessions = getWeekSessions();
  
  // Calculate statistics for today
  const todayStats = useMemo(() => {
    if (!todaySessions.length) return { total: 0, completed: 0, completionRate: 0, totalDuration: 0 };
    
    const completed = todaySessions.filter(session => session.completed).length;
    const total = todaySessions.length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    const totalDuration = todaySessions.reduce((sum, session) => sum + session.duration, 0);
    
    return { total, completed, completionRate, totalDuration };
  }, [todaySessions]);
  
  // Calculate statistics for the week
  const weekStats = useMemo(() => {
    if (!weekSessions.length) return { total: 0, completed: 0, completionRate: 0, totalDuration: 0 };
    
    const completed = weekSessions.filter(session => session.completed).length;
    const total = weekSessions.length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    const totalDuration = weekSessions.reduce((sum, session) => sum + session.duration, 0);
    
    return { total, completed, completionRate, totalDuration };
  }, [weekSessions]);
  
  // Group sessions by subject to show focus areas
  const subjectStats = useMemo(() => {
    const subjects = {};
    
    weekSessions.forEach(session => {
      if (!subjects[session.subject]) {
        subjects[session.subject] = {
          total: 0,
          completed: 0,
          duration: 0
        };
      }
      
      subjects[session.subject].total += 1;
      subjects[session.subject].duration += session.duration;
      
      if (session.completed) {
        subjects[session.subject].completed += 1;
      }
    });
    
    // Convert to array and sort by total sessions
    return Object.entries(subjects)
      .map(([subject, stats]) => ({
        subject,
        ...stats,
        completionRate: stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0
      }))
      .sort((a, b) => b.total - a.total);
  }, [weekSessions]);
  
  // Format minutes to hours and minutes
  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${mins > 0 ? `${mins}m` : ''}`;
    }
    
    return `${mins}m`;
  };
  
  if (isLoading) {
    return <div className="loading">Loading overview data...</div>;
  }
  
  if (error) {
    return <div className="error">{error}</div>;
  }
  
  return (
    <div className="daily-overview">
      <h2>Daily Overview</h2>
      
      <div className="overview-container">
        <div className="overview-section today-stats">
          <h3>Today's Progress</h3>
          
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">{todayStats.total}</div>
              <div className="stat-label">Sessions</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-value">{todayStats.completed}</div>
              <div className="stat-label">Completed</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-value">{todayStats.completionRate}%</div>
              <div className="stat-label">Completion Rate</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-value">{formatDuration(todayStats.totalDuration)}</div>
              <div className="stat-label">Total Duration</div>
            </div>
          </div>
          
          <div className="progress-bar-container">
            <div className="progress-label">Overall Progress</div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${todayStats.completionRate}%` }}
              ></div>
            </div>
            <div className="progress-value">{todayStats.completionRate}%</div>
          </div>
        </div>
        
        <div className="overview-section week-stats">
          <h3>Weekly Overview</h3>
          
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">{weekStats.total}</div>
              <div className="stat-label">Total Sessions</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-value">{weekStats.completed}</div>
              <div className="stat-label">Completed</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-value">{weekStats.completionRate}%</div>
              <div className="stat-label">Completion Rate</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-value">{formatDuration(weekStats.totalDuration)}</div>
              <div className="stat-label">Total Duration</div>
            </div>
          </div>
        </div>
        
        <div className="overview-section subjects-breakdown">
          <h3>Subject Breakdown</h3>
          
          {subjectStats.length > 0 ? (
            <div className="subjects-list">
              {subjectStats.map(subject => (
                <div key={subject.subject} className="subject-card">
                  <div className="subject-header">
                    <h4>{subject.subject}</h4>
                    <div className="subject-stats">
                      <span>{subject.completed}/{subject.total} sessions</span>
                      <span>{formatDuration(subject.duration)}</span>
                    </div>
                  </div>
                  
                  <div className="subject-progress-bar">
                    <div 
                      className="subject-progress-fill" 
                      style={{ width: `${subject.completionRate}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-data">No subject data available</div>
          )}
        </div>
        
        <div className="overview-section upcoming-sessions">
          <h3>Upcoming Sessions Today</h3>
          
          {todaySessions.filter(session => !session.completed).length > 0 ? (
            <div className="upcoming-list">
              {todaySessions
                .filter(session => !session.completed)
                .sort((a, b) => a.startTime.localeCompare(b.startTime))
                .map(session => (
                  <div key={session.id} className={`upcoming-card priority-${session.priority}`}>
                    <div className="upcoming-time">{session.startTime} - {session.endTime}</div>
                    <div className="upcoming-details">
                      <div className="upcoming-subject">{session.subject}</div>
                      <div className="upcoming-topic">{session.topic}</div>
                    </div>
                    <div className="upcoming-duration">{formatDuration(session.duration)}</div>
                  </div>
                ))
              }
            </div>
          ) : (
            <div className="no-data">All sessions for today completed!</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DailyOverview;