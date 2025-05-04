import React, { useState, useEffect, useRef } from 'react';
import './PomodoroTimer.css';

const PomodoroTimer = () => {
  // Default Pomodoro settings
  const defaultWorkTime = 45 * 60; // 45 minutes in seconds
  const defaultShortBreak = 15 * 60; // 15 minutes in seconds
  const defaultLongBreak = 30 * 60; // 30 minutes in seconds
  const defaultCycles = 2; // Number of work sessions before a long break

  // Timer states
  const [workTime, setWorkTime] = useState(defaultWorkTime);
  const [shortBreak, setShortBreak] = useState(defaultShortBreak);
  const [longBreak, setLongBreak] = useState(defaultLongBreak);
  const [cyclesBeforeLongBreak, setCyclesBeforeLongBreak] = useState(defaultCycles);
  
  // Current timer state
  const [timeLeft, setTimeLeft] = useState(workTime);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('work'); // 'work', 'shortBreak', 'longBreak'
  const [currentCycle, setCurrentCycle] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  
  // Timer sound
  const alarmSound = useRef(null);
  
  // Effect to handle the timer countdown
  useEffect(() => {
    let interval = null;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      // Play sound when timer completes
      if (alarmSound.current) {
        alarmSound.current.play();
      }
      
      // Move to the next timer mode
      handleTimerComplete();
      
      clearInterval(interval);
    }
    
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  // Function to format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Function to toggle the timer
  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  // Function to reset the timer
  const resetTimer = () => {
    setIsActive(false);
    
    // Reset to the appropriate time based on current mode
    if (mode === 'work') {
      setTimeLeft(workTime);
    } else if (mode === 'shortBreak') {
      setTimeLeft(shortBreak);
    } else {
      setTimeLeft(longBreak);
    }
  };

  // Function to skip to the next timer
  const skipTimer = () => {
    setIsActive(false);
    handleTimerComplete();
  };

  // Function to handle timer completion and change modes
  const handleTimerComplete = () => {
    if (mode === 'work') {
      // After work session, check if we need a long break or short break
      if (currentCycle % cyclesBeforeLongBreak === 0) {
        setMode('longBreak');
        setTimeLeft(longBreak);
      } else {
        setMode('shortBreak');
        setTimeLeft(shortBreak);
      }
    } else {
      // After any break, go back to work and increment cycle if coming from a short break
      setMode('work');
      setTimeLeft(workTime);
      
      if (mode === 'shortBreak') {
        setCurrentCycle(currentCycle + 1);
      }
    }
  };

  // Function to manually set the timer mode
  const setTimerMode = (newMode) => {
    setIsActive(false);
    setMode(newMode);
    
    if (newMode === 'work') {
      setTimeLeft(workTime);
    } else if (newMode === 'shortBreak') {
      setTimeLeft(shortBreak);
    } else {
      setTimeLeft(longBreak);
    }
  };

  // Function to save settings
  const saveSettings = (e) => {
    e.preventDefault();
    setShowSettings(false);
    
    // If timer is inactive, update the current timer
    if (!isActive) {
      if (mode === 'work') {
        setTimeLeft(workTime);
      } else if (mode === 'shortBreak') {
        setTimeLeft(shortBreak);
      } else {
        setTimeLeft(longBreak);
      }
    }
  };

  // Function to handle input changes
  const handleInputChange = (e, setter) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value > 0) {
      setter(value * 60); // Convert minutes to seconds
    }
  };

  return (
    <div className="pomodoro-container">
      <h2>Pomodoro Timer</h2>
      
      <div className="timer-display">
        <div className={`timer-circle ${mode}`}>
          <div className="time">{formatTime(timeLeft)}</div>
          <div className="mode-label">
            {mode === 'work' ? 'Focus Time' : 
             mode === 'shortBreak' ? 'Short Break' : 'Long Break'}
          </div>
        </div>
      </div>
      
      <div className="cycle-indicator">
        Cycle: {currentCycle} / {cyclesBeforeLongBreak}
      </div>
      
      <div className="timer-controls">
        <button 
          className="timer-button start-stop" 
          onClick={toggleTimer}
        >
          {isActive ? 'Pause' : 'Start'}
        </button>
        <button 
          className="timer-button reset" 
          onClick={resetTimer}
        >
          Reset
        </button>
        <button 
          className="timer-button skip" 
          onClick={skipTimer}
        >
          Skip
        </button>
      </div>
      
      <div className="mode-selector">
        <button 
          className={`mode-button ${mode === 'work' ? 'active' : ''}`}
          onClick={() => setTimerMode('work')}
        >
          Work
        </button>
        <button 
          className={`mode-button ${mode === 'shortBreak' ? 'active' : ''}`}
          onClick={() => setTimerMode('shortBreak')}
        >
          Short Break
        </button>
        <button 
          className={`mode-button ${mode === 'longBreak' ? 'active' : ''}`}
          onClick={() => setTimerMode('longBreak')}
        >
          Long Break
        </button>
      </div>
      
      <button 
        className="settings-toggle"
        onClick={() => setShowSettings(!showSettings)}
      >
        {showSettings ? 'Hide Settings' : 'Show Settings'}
      </button>
      
      {showSettings && (
        <div className="timer-settings">
          <h3>Timer Settings</h3>
          <form onSubmit={saveSettings}>
            <div className="settings-row">
              <label>
                Work Time (minutes):
                <input 
                  type="number" 
                  min="1" 
                  max="60" 
                  value={Math.floor(workTime / 60)} 
                  onChange={(e) => handleInputChange(e, setWorkTime)}
                />
              </label>
            </div>
            
            <div className="settings-row">
              <label>
                Short Break (minutes):
                <input 
                  type="number" 
                  min="1" 
                  max="30" 
                  value={Math.floor(shortBreak / 60)} 
                  onChange={(e) => handleInputChange(e, setShortBreak)}
                />
              </label>
            </div>
            
            <div className="settings-row">
              <label>
                Long Break (minutes):
                <input 
                  type="number" 
                  min="1" 
                  max="60" 
                  value={Math.floor(longBreak / 60)} 
                  onChange={(e) => handleInputChange(e, setLongBreak)}
                />
              </label>
            </div>
            
            <div className="settings-row">
              <label>
                Cycles before Long Break:
                <input 
                  type="number" 
                  min="1" 
                  max="10" 
                  value={cyclesBeforeLongBreak} 
                  onChange={(e) => {
                    const value = parseInt(e.target.value, 10);
                    if (!isNaN(value) && value > 0) {
                      setCyclesBeforeLongBreak(value);
                    }
                  }}
                />
              </label>
            </div>
            
            <button type="submit" className="save-settings">Save Settings</button>
          </form>
        </div>
      )}
      
      {/* Audio for timer completion */}
      <audio ref={alarmSound} preload="auto">
        <source src="https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default PomodoroTimer;