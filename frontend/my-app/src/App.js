import React, { useState, useEffect } from 'react';
import './App.css';  // Assuming you have styles in place

function App() {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isMoved, setIsMoved] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isRatingContainerVisible, setIsRatingContainerVisible] = useState(false);
  const [ratingVisible, setRatingVisible] = useState(false);
  const [isFeedbackContainerVisible, setIsFeedbackContainerVisible] = useState(false);
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [rating, setRating] = useState(null);

  const [word, setWord] = useState("Computer");  // Hardcoded word for now
  const [pronunciation, setPronunciation] = useState("Fetching...");  

  // Fetch pronunciation from Flask API when the component loads
  useEffect(() => {
    const fetchPronunciation = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/word2ipa/${word}`);
        console.log(response);
        if (response.ok) {
          const data = await response.text();  // Assuming the API returns plain text pronunciation
          setPronunciation(data);  // Update the state with the fetched pronunciation
        } else {
          console.error('Error fetching pronunciation after fetch:', response.status);
          setPronunciation("Error fetching pronunciation after fetch");
        }
      } catch (error) {
        console.error('Error fetching pronunciation before fetch:', error);
        setPronunciation("Error fetching pronunciation before fetch");
      }
    };

    // Call the API when the component is first loaded
    fetchPronunciation();
  }, [word]);  // Only run this effect when the word changes (or on initial render)

  // Handle the flip and UI changes without calling the API
  const handleFlip = () => {
    setIsFlipped(!isFlipped);

    if (!isFlipped) {
      // Card is flipped, start expanding and moving it
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
      // Reset states when flipping back
      setIsMoved(false);
      setIsExpanded(false);
      setIsRatingContainerVisible(false);
      setIsFeedbackContainerVisible(false);
      setRatingVisible(false);
      setFeedbackVisible(false);
    }
  };

  useEffect(() => {
    if (isRatingContainerVisible) {
      setTimeout(() => {
        setRatingVisible(true);
      }, 100);
    }
  }, [isRatingContainerVisible]);

  useEffect(() => {
    if (isFeedbackContainerVisible) {
      setTimeout(() => {
        setFeedbackVisible(true);
      }, 100);
    }
  }, [isFeedbackContainerVisible]);

  const handleRating = (rating) => {
    setRating(rating);
    console.log('Rating:', rating);
  };

  return (
    <div className={`app-container ${isMoved ? 'moved' : ''}`}>
      <header className="app-header">
        <h1 className="main-title">Pronunciation Training</h1>
      </header>
      <div className={`card-container ${isFlipped ? 'flipped' : ''}`}>
        <div className={`card ${isExpanded ? 'expanded' : ''}`}>
          {/* Front of the card */}
          <div className="card-front">
            <div className="pronunciation-container">
              <h2 className="dynamic-pronunciation">{pronunciation}</h2> {/* Pronunciation displayed above */}
              <h3 className="dynamic-word">{word}</h3> {/* Word displayed below pronunciation */}
            </div>
            <button className="mic-button" onClick={handleFlip}>
              <i className="fas fa-microphone"></i> {/* Microphone icon */}
            </button>
          </div>

          {/* Back of the card */}
          <div className="card-back">
            <button className="speaker-box">
              <i className="fas fa-volume-up"></i> {/* Speaker icon moved to the back */}
            </button>
            <h2 className="dynamic-pronunciation">{pronunciation}</h2> {/* Pronunciation on the back */}
            <h3>{word}</h3> {/* Word on the back */}
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
    </div>
  );
}

export default App;
