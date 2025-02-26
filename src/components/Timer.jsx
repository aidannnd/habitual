import React from 'react';

function Timer({ 
  showTimer,
  selectedHabit,
  setSelectedHabit,
  selectedSubHabit,
  setSelectedSubHabit,
  habits,
  timerSeconds,
  isTimerRunning,
  handleStartTimer,
  handlePauseTimer,
  handleSaveTimer,
  handleCancelTimer
}) {
  if (!showTimer) return null;

  return (
    <div className="timer-form">
      <div className="habit-select-group">
        <select 
          className="habit-select"
          value={selectedHabit}
          onChange={(e) => setSelectedHabit(e.target.value)}
        >
          <option value="">Select habit</option>
          {Object.keys(habits).map(habit => (
            <option key={habit} value={habit}>{habit}</option>
          ))}
        </select>
        
        {selectedHabit && (
          <select
            className="habit-select"
            value={selectedSubHabit}
            onChange={(e) => setSelectedSubHabit(e.target.value)}
          >
            <option value="">Select sub-habit</option>
            {habits[selectedHabit].map(subHabit => (
              <option key={subHabit} value={subHabit}>{subHabit}</option>
            ))}
          </select>
        )}
      </div>

      <div className="timer-display">
        {Math.floor(timerSeconds / 3600).toString().padStart(2, '0')}:
        {Math.floor((timerSeconds % 3600) / 60).toString().padStart(2, '0')}:
        {(timerSeconds % 60).toString().padStart(2, '0')}
      </div>

      <div className="timer-buttons">
        {!isTimerRunning ? (
          <button 
            className="start-button"
            onClick={handleStartTimer}
            disabled={!selectedHabit || !selectedSubHabit}
          >
            Start
          </button>
        ) : (
          <button 
            className="pause-button"
            onClick={handlePauseTimer}
          >
            Pause
          </button>
        )}
        <button 
          className="save-button"
          onClick={handleSaveTimer}
          disabled={timerSeconds === 0}
        >
          Save Time
        </button>
        <button 
          className="back-button"
          onClick={handleCancelTimer}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default Timer; 