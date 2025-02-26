import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Timer from './components/Timer';
import FeedbackMessage from './components/FeedbackMessage';
import './App.css';

function App() {
  // Move getLocalDate function to the top
  const getLocalDate = (date = new Date()) => {
    return date.getFullYear() + '-' + 
      String(date.getMonth() + 1).padStart(2, '0') + '-' + 
      String(date.getDate()).padStart(2, '0');
  };

  const [selectedHabit, setSelectedHabit] = useState('');
  const [selectedSubHabit, setSelectedSubHabit] = useState('');
  const [showTimeEntry, setShowTimeEntry] = useState(false);
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  
  const [habits, setHabits] = useState({});
  const [habitTimes, setHabitTimes] = useState({});
  const [habitDates, setHabitDates] = useState({});
  
  const [isCreateExpanded, setIsCreateExpanded] = useState(false);
  const [newHabit, setNewHabit] = useState('');
  const [newSubHabits, setNewSubHabits] = useState('');
  
  const [addingSubHabitTo, setAddingSubHabitTo] = useState(null);
  const [newSubHabit, setNewSubHabit] = useState('');
  
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [habitToDelete, setHabitToDelete] = useState(null);
  const [subHabitToDelete, setSubHabitToDelete] = useState(null);
  
  const [months, setMonths] = useState([]);
  const [gridDates, setGridDates] = useState([]);
  
  const [gridStyle, setGridStyle] = useState({});
  const [monthsStyle, setMonthsStyle] = useState({});
  
  const [selectedDate, setSelectedDate] = useState(getLocalDate());
  
  const [showTimer, setShowTimer] = useState(false);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerInterval, setTimerInterval] = useState(null);
  
  // Add new state for feedback
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  
  useEffect(() => {
    const savedHabits = localStorage.getItem('habits');
    const savedTimes = localStorage.getItem('habitTimes');
    const savedDates = localStorage.getItem('habitDates');
    
    if (savedHabits) {
      setHabits(JSON.parse(savedHabits));
    } else {
      setHabits({});
      localStorage.setItem('habits', JSON.stringify({}));
    }

    if (savedTimes) {
      setHabitTimes(JSON.parse(savedTimes));
    } else {
      setHabitTimes({});
      localStorage.setItem('habitTimes', JSON.stringify({}));
    }

    if (savedDates) {
      setHabitDates(JSON.parse(savedDates));
    } else {
      setHabitDates({});
      localStorage.setItem('habitDates', JSON.stringify({}));
    }
  }, []);

  // Add feedback display function
  const showTimeSavedFeedback = (time) => {
    const timeStr = time.endsWith('.0') ? time.slice(0, -2) : time;
    setFeedbackMessage(`${timeStr} hours saved`);
    setShowFeedback(true);
    setTimeout(() => setShowFeedback(false), 2000);
  };

  const handleSaveTime = () => {
    const hoursNum = parseFloat(hours) || 0;
    const minutesNum = parseFloat(minutes) || 0;
    const totalHours = hoursNum + (minutesNum / 60);

    const updatedTimes = { ...habitTimes };
    if (!updatedTimes[selectedHabit]) {
      updatedTimes[selectedHabit] = {};
    }
    
    const currentTime = updatedTimes[selectedHabit][selectedSubHabit] || 0;
    updatedTimes[selectedHabit][selectedSubHabit] = parseFloat((currentTime + totalHours).toFixed(2));

    const updatedDates = { ...habitDates };
    if (!updatedDates[selectedHabit]) {
      updatedDates[selectedHabit] = {};
    }
    if (!updatedDates[selectedHabit][selectedSubHabit]) {
      updatedDates[selectedHabit][selectedSubHabit] = {};
    }
    
    const currentDateTime = updatedDates[selectedHabit][selectedSubHabit][selectedDate] || 0;
    updatedDates[selectedHabit][selectedSubHabit][selectedDate] = parseFloat((currentDateTime + totalHours).toFixed(2));

    setHabitTimes(updatedTimes);
    setHabitDates(updatedDates);
    localStorage.setItem('habitTimes', JSON.stringify(updatedTimes));
    localStorage.setItem('habitDates', JSON.stringify(updatedDates));

    showTimeSavedFeedback(totalHours.toFixed(1));
    setShowTimeEntry(false);
    setHours('');
    setMinutes('');
    setSelectedDate(getLocalDate());
  };

  const getHabitTime = (habit, subHabit) => {
    const time = Number(habitTimes[habit]?.[subHabit] || 0).toFixed(1);
    return time.endsWith('.0') ? time.slice(0, -2) : time;
  };

  const handleExportData = () => {
    const exportData = {
      habits: habits,
      habitTimes: habitTimes,
      habitDates: habitDates
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.download = 'habits-data.json';
    link.href = url;
    link.click();
    
    URL.revokeObjectURL(url);
  };

  const handleImportData = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target.result);
          if (importedData.habits && importedData.habitTimes && importedData.habitDates) {
            setHabits(importedData.habits);
            setHabitTimes(importedData.habitTimes);
            setHabitDates(importedData.habitDates);
            localStorage.setItem('habits', JSON.stringify(importedData.habits));
            localStorage.setItem('habitTimes', JSON.stringify(importedData.habitTimes));
            localStorage.setItem('habitDates', JSON.stringify(importedData.habitDates));
          }
        } catch (error) {
          console.error('Error importing data:', error);
        }
      };
      reader.readAsText(file);
    }
    // Reset file input
    event.target.value = '';
  };

  const handleCreateHabit = () => {
    if (newHabit.trim()) {
      const subHabitsArray = newSubHabits
        .split(',')
        .map(h => h.trim())
        .filter(h => h.length > 0);
      
      const updatedHabits = {
        ...habits,
        [newHabit]: subHabitsArray
      };
      
      setHabits(updatedHabits);
      localStorage.setItem('habits', JSON.stringify(updatedHabits));
      
      // Reset form
      setNewHabit('');
      setNewSubHabits('');
      setIsCreateExpanded(false);
    }
  };

  const handleAddSubHabit = (habit) => {
    if (newSubHabit.trim()) {
      const updatedHabits = {
        ...habits,
        [habit]: [...habits[habit], newSubHabit.trim()]
      };
      
      setHabits(updatedHabits);
      localStorage.setItem('habits', JSON.stringify(updatedHabits));
      
      // Reset form
      setNewSubHabit('');
      setAddingSubHabitTo(null);
    }
  };

  const handleDeleteClick = (habit, subHabit = null) => {
    setHabitToDelete(habit);
    setSubHabitToDelete(subHabit);
    setShowConfirmDelete(true);
  };

  const handleConfirmDelete = () => {
    if (habitToDelete) {
      if (subHabitToDelete) {
        // Delete sub-habit
        const updatedHabits = {
          ...habits,
          [habitToDelete]: habits[habitToDelete].filter(h => h !== subHabitToDelete)
        };
        setHabits(updatedHabits);
        
        const updatedTimes = { ...habitTimes };
        if (updatedTimes[habitToDelete]) {
          delete updatedTimes[habitToDelete][subHabitToDelete];
        }
        setHabitTimes(updatedTimes);
        
        const updatedDates = { ...habitDates };
        if (updatedDates[habitToDelete]) {
          delete updatedDates[habitToDelete][subHabitToDelete];
        }
        setHabitDates(updatedDates);
        
        localStorage.setItem('habits', JSON.stringify(updatedHabits));
        localStorage.setItem('habitTimes', JSON.stringify(updatedTimes));
        localStorage.setItem('habitDates', JSON.stringify(updatedDates));
      } else {
        // Delete entire habit (existing code)
        const updatedHabits = { ...habits };
        delete updatedHabits[habitToDelete];
        setHabits(updatedHabits);
        
        const updatedTimes = { ...habitTimes };
        delete updatedTimes[habitToDelete];
        setHabitTimes(updatedTimes);
        
        const updatedDates = { ...habitDates };
        delete updatedDates[habitToDelete];
        setHabitDates(updatedDates);
        
        localStorage.setItem('habits', JSON.stringify(updatedHabits));
        localStorage.setItem('habitTimes', JSON.stringify(updatedTimes));
        localStorage.setItem('habitDates', JSON.stringify(updatedDates));
      }
      
      setShowConfirmDelete(false);
      setHabitToDelete(null);
      setSubHabitToDelete(null);
    }
  };

  const hasEntryOnDate = (habit, subHabit, date) => {
    return !!habitDates[habit]?.[subHabit]?.[date];
  };

  const getTimeForDate = (habit, subHabit, date) => {
    return habitDates[habit]?.[subHabit]?.[date] || 0;
  };

  const getMonthsArray = () => {
    const months = [];
    const date = new Date();
    date.setDate(1); // Set to 1st of month to avoid month skipping
    
    // Start from current month and go backwards
    for (let i = 0; i < 12; i++) {
      months.unshift(date.toLocaleString('en-US', { month: 'short' }));
      date.setMonth(date.getMonth() - 1);
    }
    
    return months;
  };

  const getDaysInYear = () => {
    const today = new Date();
    today.setHours(12, 0, 0, 0);
    const oneYearAgo = new Date(today);
    oneYearAgo.setFullYear(today.getFullYear() - 1);
    
    const dates = [];
    const current = new Date(today);
    
    while (current > oneYearAgo) {
      dates.unshift(getLocalDate(current));
      current.setDate(current.getDate() - 1);
    }
    
    return dates;
  };

  useEffect(() => {
    setMonths(getMonthsArray());
    setGridDates(getDaysInYear());
    
    setGridStyle({
      gridTemplateColumns: `repeat(${Math.ceil(getDaysInYear().length / 7)}, 1fr)`,
      gap: '2px'
    });
    
    setMonthsStyle({
      gridTemplateColumns: `repeat(12, 1fr)`,
      gap: '2px'
    });
  }, []); // Run once on component mount

  // Add helper function to format date
  const formatDate = (dateStr) => {
    // Create date and set to noon UTC
    const date = new Date(dateStr + 'T12:00:00Z');
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long', 
      day: 'numeric',
      timeZone: 'UTC'  // Force UTC timezone
    });
  };

  // Add helper function to calculate total hours for a habit
  const getTotalHabitTime = (habit) => {
    if (!habitTimes[habit]) return 0;
    const time = Number(Object.values(habitTimes[habit])
      .reduce((sum, time) => sum + time, 0))
      .toFixed(1);
    return time.endsWith('.0') ? time.slice(0, -2) : time;
  };

  // Add helper function to calculate past week's hours
  const getPastWeekTime = (habit, subHabit = null) => {
    const today = new Date();
    const monday = new Date(today);
    // Get most recent Monday (0 = Sunday, 1 = Monday, etc)
    monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));
    monday.setHours(0, 0, 0, 0);
    
    let weekTotal = 0;
    
    // Calculate from Monday through today
    for (let d = new Date(monday); d <= today; d.setDate(d.getDate() + 1)) {
      const dateStr = getLocalDate(d);
      if (subHabit) {
        weekTotal += habitDates[habit]?.[subHabit]?.[dateStr] || 0;
      } else {
        // For main habit, sum all sub-habits
        Object.values(habitDates[habit] || {}).forEach(subHabitDates => {
          weekTotal += subHabitDates[dateStr] || 0;
        });
      }
    }
    
    const timeStr = weekTotal.toFixed(1);
    return timeStr.endsWith('.0') ? timeStr.slice(0, -2) : timeStr;
  };

  const handleStartTimer = () => {
    const interval = setInterval(() => {
      setTimerSeconds(prev => prev + 1);
    }, 1000);
    setTimerInterval(interval);
    setIsTimerRunning(true);
  };

  const handlePauseTimer = () => {
    clearInterval(timerInterval);
    setTimerInterval(null);
    setIsTimerRunning(false);
  };

  const handleSaveTimer = () => {
    const hours = Math.floor(timerSeconds / 3600);
    const minutes = Math.floor((timerSeconds % 3600) / 60);
    const totalHours = hours + (minutes / 60);
    
    // Save time directly
    const updatedTimes = { ...habitTimes };
    if (!updatedTimes[selectedHabit]) {
      updatedTimes[selectedHabit] = {};
    }
    
    const currentTime = updatedTimes[selectedHabit][selectedSubHabit] || 0;
    updatedTimes[selectedHabit][selectedSubHabit] = parseFloat((currentTime + totalHours).toFixed(2));

    const updatedDates = { ...habitDates };
    if (!updatedDates[selectedHabit]) {
      updatedDates[selectedHabit] = {};
    }
    if (!updatedDates[selectedHabit][selectedSubHabit]) {
      updatedDates[selectedHabit][selectedSubHabit] = {};
    }
    
    const today = getLocalDate();
    const currentDateTime = updatedDates[selectedHabit][selectedSubHabit][today] || 0;
    updatedDates[selectedHabit][selectedSubHabit][today] = parseFloat((currentDateTime + totalHours).toFixed(2));

    // Update state and localStorage
    setHabitTimes(updatedTimes);
    setHabitDates(updatedDates);
    localStorage.setItem('habitTimes', JSON.stringify(updatedTimes));
    localStorage.setItem('habitDates', JSON.stringify(updatedDates));

    showTimeSavedFeedback(totalHours.toFixed(1));
    clearInterval(timerInterval);
    setTimerInterval(null);
    setIsTimerRunning(false);
    setTimerSeconds(0);
    setShowTimer(false);
    setSelectedHabit('');
    setSelectedSubHabit('');
  };

  // Timer handlers
  const handleCancelTimer = () => {
    clearInterval(timerInterval);
    setTimerInterval(null);
    setIsTimerRunning(false);
    setTimerSeconds(0);
    setShowTimer(false);
    setSelectedHabit('');
    setSelectedSubHabit('');
  };

  return (
    <div className="App">
      <FeedbackMessage 
        show={showFeedback} 
        message={feedbackMessage} 
      />
      
      <Header 
        handleExportData={handleExportData}
        handleImportData={handleImportData}
      />

      <div className="log-time-section">
        <div className="action-buttons">
          <button 
            className="start-timer-button"
            onClick={() => setShowTimer(true)}
          >
            <span>⏱️</span> Start Timer
          </button>
          <button 
            className="create-habit-button"
            onClick={() => setIsCreateExpanded(!isCreateExpanded)}
          >
            <span>✏️</span> Create Habit
          </button>
        </div>
        
        <Timer 
          showTimer={showTimer}
          selectedHabit={selectedHabit}
          setSelectedHabit={setSelectedHabit}
          selectedSubHabit={selectedSubHabit}
          setSelectedSubHabit={setSelectedSubHabit}
          habits={habits}
          timerSeconds={timerSeconds}
          isTimerRunning={isTimerRunning}
          handleStartTimer={handleStartTimer}
          handlePauseTimer={handlePauseTimer}
          handleSaveTimer={handleSaveTimer}
          handleCancelTimer={handleCancelTimer}
        />
        
        {isCreateExpanded && (
          <div className="create-habit-form">
            <div className="habit-input-group">
              <input
                type="text"
                value={newHabit}
                onChange={(e) => setNewHabit(e.target.value)}
                placeholder="Enter habit name"
                className="habit-input"
              />
              <input
                type="text"
                value={newSubHabits}
                onChange={(e) => setNewSubHabits(e.target.value)}
                placeholder="Enter comma-separated sub-habits (optional)"
                className="habit-input"
              />
            </div>
            <div className="button-group">
              <button 
                className="back-button"
                onClick={() => {
                  setIsCreateExpanded(false);
                  setNewHabit('');
                  setNewSubHabits('');
                }}
              >
                Cancel
              </button>
              <button 
                className="save-button"
                onClick={handleCreateHabit}
              >
                Save
              </button>
            </div>
          </div>
        )}
      </div>
      
      <div className="habit-container">
        {Object.entries(habits).map(([habit, subHabits]) => (
          <div key={habit} className="goal-section">
            <div className="goal-header">
              <div className="goal-title">
                <div className="goal-name">{habit}</div>
                <div className="habit-hours">
                  {getTotalHabitTime(habit)} hours
                  <span className="week-hours">
                    ({getPastWeekTime(habit)} this week)
                  </span>
                </div>
              </div>
              <div className="goal-actions">
                <button 
                  className="add-sub-habit-button"
                  onClick={() => setAddingSubHabitTo(habit)}
                >
                  +
                </button>
                <button 
                  className="delete-habit-button"
                  onClick={() => handleDeleteClick(habit)}
                >
                  ×
                </button>
              </div>
            </div>
            
            {addingSubHabitTo === habit && (
              <div className="add-sub-habit-form">
                <input
                  type="text"
                  value={newSubHabit}
                  onChange={(e) => setNewSubHabit(e.target.value)}
                  placeholder="Enter new sub-habit"
                  className="habit-input"
                />
                <div className="button-group">
                  <button 
                    className="back-button"
                    onClick={() => {
                      setAddingSubHabitTo(null);
                      setNewSubHabit('');
                    }}
                  >
                    Cancel
                  </button>
                  <button 
                    className="save-button"
                    onClick={() => handleAddSubHabit(habit)}
                  >
                    Save
                  </button>
                </div>
              </div>
            )}
            
            {subHabits.map(subHabit => (
              <div key={subHabit} className="habit-row">
                <div className="sub-habit-header">
                  <div className="habit-header">
                    <div className="habit-name">{subHabit}</div>
                    <div className="habit-hours">
                      {getHabitTime(habit, subHabit)} hours
                      <span className="week-hours">
                        ({getPastWeekTime(habit, subHabit)} this week)
                      </span>
                    </div>
                  </div>
                  <div className="sub-habit-actions">
                    <button 
                      className="log-time-button"
                      onClick={() => {
                        setSelectedHabit(habit);
                        setSelectedSubHabit(subHabit);
                        setShowTimeEntry(true);
                      }}
                    >
                      +
                    </button>
                    <button 
                      className="delete-habit-button"
                      onClick={() => handleDeleteClick(habit, subHabit)}
                    >
                      ×
                    </button>
                  </div>
                </div>

                {showTimeEntry && selectedHabit === habit && selectedSubHabit === subHabit && (
                  <div className="time-entry">
                    <div className="time-inputs">
                      <div className="time-input-group">
                        <input
                          type="number"
                          value={hours}
                          onChange={(e) => setHours(e.target.value)}
                          placeholder="hours"
                          min="0"
                          className="time-input"
                        />
                      </div>
                      <div className="time-input-group">
                        <input
                          type="number"
                          value={minutes}
                          onChange={(e) => setMinutes(e.target.value)}
                          placeholder="minutes"
                          min="0"
                          max="59"
                          className="time-input"
                        />
                      </div>
                    </div>
                    <div className="date-input">
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        max={getLocalDate()}
                        className="date-input-field"
                        placeholder={getLocalDate()}
                      />
                    </div>
                    <div className="button-group">
                      <button 
                        className="back-button"
                        onClick={() => {
                          setShowTimeEntry(false);
                          setSelectedHabit('');
                          setSelectedSubHabit('');
                          setSelectedDate(getLocalDate());
                        }}
                      >
                        Cancel
                      </button>
                      <button 
                        className="save-button"
                        onClick={handleSaveTime}
                      >
                        Log Time
                      </button>
                    </div>
                  </div>
                )}

                <div className="habit-grid">
                  <div className="months-row" style={monthsStyle}>
                    {months.map(month => (
                      <div key={month} className="month">{month}</div>
                    ))}
                  </div>
                  <div className="grid-squares" style={gridStyle}>
                    {gridDates.map((date, index) => {
                      const timeOnDate = getTimeForDate(habit, subHabit, date);
                      let intensity = '';
                      if (timeOnDate > 0) {
                        if (timeOnDate <= 1) intensity = 'low';
                        else if (timeOnDate <= 2) intensity = 'medium-low';
                        else if (timeOnDate <= 3) intensity = 'medium-high';
                        else intensity = 'high';
                      }
                      
                      const isToday = date === getLocalDate();
                      
                      const tooltipText = timeOnDate 
                        ? `${formatDate(date)}\n${Number(timeOnDate).toFixed(1).endsWith('.0') 
                            ? Number(timeOnDate).toFixed(1).slice(0, -2) 
                            : Number(timeOnDate).toFixed(1)} hours logged`
                        : formatDate(date);

                      return (
                        <div 
                          key={index} 
                          className={`grid-square ${intensity} ${isToday ? 'today' : ''}`}
                          title={tooltipText}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {showConfirmDelete && (
        <div className="modal-overlay">
          <div className="confirm-dialog">
            <p>Delete {subHabitToDelete ? "sub-habit" : "habit"} "{subHabitToDelete || habitToDelete}" and all its data?</p>
            <div className="button-group">
              <button 
                className="back-button"
                onClick={() => {
                  setShowConfirmDelete(false);
                  setHabitToDelete(null);
                  setSubHabitToDelete(null);
                }}
              >
                Cancel
              </button>
              <button 
                className="delete-button"
                onClick={handleConfirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;