import React, { createContext, useState, useEffect, useContext } from 'react';
import { mockRevisionSessions } from '../data/mockData';
import { db, auth } from '../data/firebaseConfig';
import { 
  collection, query, where, onSnapshot, 
  addDoc, updateDoc, deleteDoc, doc, 
  Timestamp, getDocs
} from 'firebase/firestore';

// Create the context
const RevisionContext = createContext();

// Custom hook for using the revision context
export const useRevision = () => useContext(RevisionContext);

export const RevisionProvider = ({ children }) => {
  const [revisionSessions, setRevisionSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // This is where you would fetch data from Firebase or another backend
    // For now, we'll use the mock data
    const fetchData = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setRevisionSessions(mockRevisionSessions);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load revision sessions');
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Function to get today's sessions
  const getTodaySessions = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return revisionSessions.filter(session => {
      const sessionDate = new Date(session.date);
      sessionDate.setHours(0, 0, 0, 0);
      return sessionDate.getTime() === today.getTime();
    });
  };

  // Function to get sessions for a specific date
  const getSessionsByDate = (date) => {
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);
    
    return revisionSessions.filter(session => {
      const sessionDate = new Date(session.date);
      sessionDate.setHours(0, 0, 0, 0);
      return sessionDate.getTime() === targetDate.getTime();
    });
  };

  // Function to get sessions for the current week
  const getWeekSessions = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Calculate the start of the week (Sunday)
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    
    // Calculate the end of the week (Saturday)
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);
    
    return revisionSessions.filter(session => {
      const sessionDate = new Date(session.date);
      return sessionDate >= startOfWeek && sessionDate <= endOfWeek;
    });
  };

  // Function to add a new session
  const addSession = (newSession) => {
    const updatedSessions = [...revisionSessions, { ...newSession, id: Date.now().toString() }];
    setRevisionSessions(updatedSessions);
    
    // Here you would also save to Firebase or your backend
  };

  // Function to update an existing session
  const updateSession = (id, updatedSession) => {
    const updatedSessions = revisionSessions.map(session => 
      session.id === id ? { ...session, ...updatedSession } : session
    );
    setRevisionSessions(updatedSessions);
    
    // Here you would also update in Firebase or your backend
  };

  // Function to delete a session
  const deleteSession = (id) => {
    const updatedSessions = revisionSessions.filter(session => session.id !== id);
    setRevisionSessions(updatedSessions);
    
    // Here you would also delete from Firebase or your backend
  };

  // Function to mark a session as completed
  const completeSession = (id) => {
    const updatedSessions = revisionSessions.map(session => 
      session.id === id ? { ...session, completed: true } : session
    );
    setRevisionSessions(updatedSessions);
    
    // Here you would also update in Firebase or your backend
  };

  return (
    <RevisionContext.Provider
      value={{
        revisionSessions,
        isLoading,
        error,
        getTodaySessions,
        getSessionsByDate,
        getWeekSessions,
        addSession,
        updateSession,
        deleteSession,
        completeSession
      }}
    >
      {children}
    </RevisionContext.Provider>
  );
};

export default RevisionContext;