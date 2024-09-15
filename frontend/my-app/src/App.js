import React, { useState, useEffect } from 'react';
import './App.css';
import {record,blob} from './audioRecorder'

function App() {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isMoved, setIsMoved] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isRatingContainerVisible, setIsRatingContainerVisible] = useState(false);
  const [ratingVisible, setRatingVisible] = useState(false); // For rating transition
  const [isFeedbackContainerVisible, setIsFeedbackContainerVisible] = useState(false);
  const [feedbackVisible, setFeedbackVisible] = useState(false); // For feedback transition
  const [rating, setRating] = useState(null);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);

    if (!isFlipped) {
      setTimeout(() => {
        setIsExpanded(true);
        setTimeout(() => {
          setIsMoved(true);
          setTimeout(() => {
            setIsRatingContainerVisible(true);
            setTimeout(() => {
              setIsFeedbackContainerVisible(true);
            }, 600);
          }, 600);
        }, 600);
      }, 600);
    } else {
      setIsMoved(false);
      setIsExpanded(false);
      setIsRatingContainerVisible(false);
      setIsFeedbackContainerVisible(false);
      setRatingVisible(false); // Reset the visibility state for rating
      setFeedbackVisible(false); // Reset the visibility state for feedback
    }
  };

  // Delay adding the visible class for the rating container
  useEffect(() => {
    if (isRatingContainerVisible) {
      setTimeout(() => {
        setRatingVisible(true);
      }, 100); // Small delay before applying visibility
    }
  }, [isRatingContainerVisible]);

  // Delay adding the visible class for the feedback container
  useEffect(() => {
    if (isFeedbackContainerVisible) {
      setTimeout(() => {
        setFeedbackVisible(true);
      }, 100); // Small delay before applying visibility
    }
  }, [isFeedbackContainerVisible]);

  const handleRating = (rating) => {
    setRating(rating);
    console.log('Rating:', rating);
  };

  const playAudio = () => {
    if (blob) {
      const audio = new Audio();
      console.log(blob)
      audio.src = URL.createObjectURL(blob);
      audio.play();
    }
  };

  return (
    <div className={`app-container ${isMoved ? 'moved' : ''}`}>
      <header className="app-header">
        <h1 className="main-title">Pronunciation Training</h1>
      </header>
      <div className={`card-container ${isFlipped ? 'flipped' : ''}`}>
        <div className={`card ${isExpanded ? 'expanded' : ''}`}>
          <div className="card-front">
            <div className="pronunciation-container">
              <button className="speaker-box">
                <i className="fas fa-volume-up"></i> {/* Speaker icon */}
              </button>
              <h2 className="dynamic-pronunciation">at·luhs</h2>
            </div>
            <h3 className="dynamic-word">Atlas</h3>
            <button className="mic-button" onClick={handleFlip}>
              <i className="fas fa-microphone"></i> {/* Microphone icon */}
            </button>
          </div>

          <div className="card-back">
            <h2>at·luhs</h2>
            <h3>Atlas</h3>
            <button className="mic-button" onClick={handleFlip}>
              <i className="fas fa-microphone"></i> {/* Microphone icon for Go Back */}
            </button>
          </div>
        </div>
      </div>

      {isRatingContainerVisible && (
        <div className={`rating-container ${ratingVisible ? 'rating-container-visible' : ''}`}>
          <h2>Rate Your Pronunciation</h2>
          <div className="rating-buttons">
            <button className="rating-button bad" onClick={() => handleRating('Bad')}>Bad</button>
            <button className="rating-button ok" onClick={() => handleRating('Ok')}>Ok</button>
            <button className="rating-button average" onClick={() => handleRating('Average')}>Average</button>
            <button className="rating-button good" onClick={() => handleRating('Good')}>Good</button>
          </div>
        </div>
      )}

      {isFeedbackContainerVisible && (
        <div className={`feedback-container ${feedbackVisible ? 'feedback-container-visible' : ''}`}>
          <h2>Feedback Container</h2>
          <p>AI feedback goes here</p>
        </div>
      )}
      <div className="rec-container">
          <button className="rec-btn" onClick={() => record()}id="toggle-rec-btn">Record</button>
      </div>
      <div className="rec-container">
          <button className="rec-btn" onClick={() => playAudio()}id="toggle-rec-btn">Record</button>
      </div>
    </div>
  );
}

export default App;
