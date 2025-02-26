import React from 'react';

function FeedbackMessage({ show, message }) {
  if (!show) return null;
  
  return (
    <div className="feedback-message">
      {message}
    </div>
  );
}

export default FeedbackMessage; 