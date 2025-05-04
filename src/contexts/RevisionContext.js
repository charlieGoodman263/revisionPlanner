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
    setIsLoading(true);
    
    // Create a reference to the collection
    const sessionsRef = collection(db, 'revisionSessions');
    
    // Set up real-time listener
    const unsubscribe = onSnapshot(sessionsRef, (querySnapshot) => {
      const sessions = [];
      querySnapshot.forEach((doc) => {
        // Convert Firestore timestamp to JS Date
        const data = doc.data();
        sessions.push({
          id: doc.id,
          ...data,
          date: data.date.toDate().toISOString() // Convert Timestamp to ISO string
        });
      });
      
      setRevisionSessions(sessions);
      setIsLoading(false);
    }, (error) => {
      setError(error.message);
      setIsLoading(false);
    });
    
    // Clean up the listener on unmount
    return () => unsubscribe();
  }, []); // No dependencies needed for a single user

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
  const getWeekSessions = (weekOffset) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Calculate the start of the week (Sunday)
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + (weekOffset * 7));
    
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
  const addSession = async (newSession) => {
    console.log("Adding new session:")
    console.log(JSON.stringify(newSession))
    try {
      // Convert date string to Firestore timestamp
      const sessionToAdd = {
        ...newSession,
        date: Timestamp.fromDate(new Date(newSession.date)),
        createdAt: Timestamp.now()
      };
      
      // Add to Firestore
      await addDoc(collection(db, 'revisionSessions'), sessionToAdd);
      // The onSnapshot listener will automatically update the local state
    } catch (err) {
      setError('Failed to add session: ' + err.message);
    }
  };

  // Function to update an existing session
  const updateSession = async (id, updatedSession) => {
    try {
      // If the update includes a date, convert it to a Timestamp
      const updates = {...updatedSession};
      if (updates.date) {
        updates.date = Timestamp.fromDate(new Date(updates.date));
      }
      
      // Update in Firestore
      const sessionRef = doc(db, 'revisionSessions', id);
      await updateDoc(sessionRef, updates);
      // The onSnapshot listener will automatically update the local state
    } catch (err) {
      setError('Failed to update session: ' + err.message);
    }
  };

  // Function to delete a session
  const deleteSession = async (id) => {
    try {
      // Delete from Firestore
      const sessionRef = doc(db, 'revisionSessions', id);
      await deleteDoc(sessionRef);
      // The onSnapshot listener will automatically update the local state
    } catch (err) {
      setError('Failed to delete session: ' + err.message);
    }
  };

  // Function to mark a session as completed
  const completeSession = async (id) => {
    try {
      // Mark as completed in Firestore
      const sessionRef = doc(db, 'revisionSessions', id);
      await updateDoc(sessionRef, {
        completed: true,
        completedAt: Timestamp.now()
      });
      // The onSnapshot listener will automatically update the local state
    } catch (err) {
      setError('Failed to mark session as completed: ' + err.message);
    }
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