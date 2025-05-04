// Helper function to get dates relative to today
const getRelativeDate = (dayOffset) => {
    const date = new Date();
    date.setDate(date.getDate() + dayOffset);
    return date.toISOString();
  };
  
  // Mock data for revision sessions
  export const mockRevisionSessions = [
    {
      id: '1',
      subject: 'Mathematics',
      topic: 'Calculus - Derivatives',
      date: getRelativeDate(0), // Today
      startTime: '09:00',
      endTime: '10:30',
      duration: 90, // in minutes
      priority: 'high',
      completed: false,
      resources: ['Calculus Textbook Ch 4', 'Online Tutorial Video']
    },
    {
      id: '2',
      subject: 'Physics',
      topic: 'Quantum Mechanics',
      date: getRelativeDate(0), // Today
      startTime: '11:00',
      endTime: '12:30',
      duration: 90,
      priority: 'medium',
      completed: false,
      resources: ['Physics Notes', 'Practice Problems Set A']
    },
    {
      id: '3',
      subject: 'Computer Science',
      topic: 'Data Structures - Trees',
      date: getRelativeDate(0), // Today
      startTime: '14:00',
      endTime: '15:30',
      duration: 90,
      priority: 'high',
      completed: false,
      resources: ['Algorithm Book', 'Lecture Slides']
    },
    {
      id: '4',
      subject: 'Further Mathematics',
      topic: 'test test',
      date: getRelativeDate(1), // Tomorrow
      startTime: '09:00',
      endTime: '10:30',
      duration: 90,
      priority: 'medium',
      completed: false,
      resources: ['FM Textbook', 'Lab Notes']
    },
    {
      id: '5',
      subject: 'Mathematics',
      topic: 'Linear Algebra',
      date: getRelativeDate(1), // Tomorrow
      startTime: '11:00',
      endTime: '12:30',
      duration: 90,
      priority: 'high',
      completed: false,
      resources: ['Linear Algebra Notes', 'Problem Set 3']
    },
    {
      id: '6',
      subject: 'Computer Science',
      topic: 'Algorithms - Sorting',
      date: getRelativeDate(3), // 3 days from now
      startTime: '14:00',
      endTime: '15:30',
      duration: 90,
      priority: 'medium',
      completed: false,
      resources: ['Algorithm Notes', 'CodeLab Practice']
    },
    {
      id: '7',
      subject: 'Physics',
      topic: 'Electromagnetism',
      date: getRelativeDate(4), // 4 days from now
      startTime: '09:00',
      endTime: '10:30',
      duration: 90,
      priority: 'high',
      completed: false,
      resources: ['Physics Textbook Ch 12', 'Problem Set 5']
    },
    {
      id: '8',
      subject: 'Mathematics',
      topic: 'Statistics',
      date: getRelativeDate(5), // 5 days from now
      startTime: '11:00',
      endTime: '12:30',
      duration: 90,
      priority: 'medium',
      completed: false,
      resources: ['Statistics Notes', 'Data Analysis Problems']
    },
    {
      id: '9',
      subject: 'Computer Science',
      topic: 'Databases - SQL',
      date: getRelativeDate(6), // 6 days from now
      startTime: '14:00',
      endTime: '15:30',
      duration: 90,
      priority: 'low',
      completed: false,
      resources: ['Database Systems Book', 'SQL Practice Exercises']
    }
  ];