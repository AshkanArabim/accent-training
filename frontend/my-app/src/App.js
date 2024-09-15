import React, { useState, useEffect } from 'react';
import giveFeedback from './geminiLinguist';
import './App.css';
import { record, blob } from './audioRecorder';

function App() {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isMoved, setIsMoved] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isRatingContainerVisible, setIsRatingContainerVisible] = useState(false);
  const [ratingVisible, setRatingVisible] = useState(false); 
  const [isFeedbackContainerVisible, setIsFeedbackContainerVisible] = useState(false);
  const [feedbackVisible, setFeedbackVisible] = useState(false); 
  const [rating, setRating] = useState(null);

  const [geminiTips, setGeminiTips] = useState("Evaluating...");
  const [pronunciation, setPronunciation] = useState("Fetching...");  
  const [definition, setDefinition] = useState("Fetching...");
  const [word] = useState("Atlas");  

  useEffect(() => {
    const fetchPronunciation = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/word2ipa/${word}`);
        if (response.ok) {
          const data = await response.text();  
          setPronunciation(data);  
        } else {
          console.error('Error fetching pronunciation:', response.status);
          setPronunciation("Error fetching pronunciation");
        }
      } catch (error) {
        console.error('Error fetching pronunciation:', error);
        setPronunciation("Error fetching pronunciation");
      }
    };

    fetchPronunciation();
  }, [word]);

  useEffect(() => {
    const fetchDefinition = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/word2def/${word}`);
        if (response.ok) {
          const data = await response.text();  
          setDefinition(data);  
        } else {
          console.error('Error fetching definition:', response.status);
          setDefinition("Error fetching definition");
        }
      } catch (error) {
        console.error('Error fetching definition:', error);
        setDefinition("Error fetching definition");
      }
    };

    fetchDefinition();
  }, [word]);

  const fetchGeminiTips = async () => {
    try {
      const response = await giveFeedback("osteoporosis", "oseoupourosie");
      if (response) {
        setGeminiTips(response); // Handle the result
      }
    } catch (error) {
      console.error('Error fetching Gemini Tips:', error);
        setDefinition("Error fetching Gemini Tips");
    }
  };

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

  const playAudio = () => {
    if (blob) {
      const audio = new Audio();
      console.log(blob);
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
              <h2 className="dynamic-pronunciation">{pronunciation}</h2> {/* Fetched pronunciation */}
            </div>
            <h3 className="dynamic-word">{word}</h3> {/* Word */}
            <button className="mic-button" onClick={handleFlip}>
              <i className="fas fa-microphone"></i> {/* Microphone icon */}
            </button>
          </div>

          <div className="card-back">
            <button className="speaker-box">
              <i className="fas fa-volume-up"></i> {/* Speaker icon */}
            </button>
            <h2 className="dynamic-pronunciation">{pronunciation}</h2> {/* Fetched pronunciation */}
            <h3>{word}</h3> {/* Word */}
            <button className="mic-button" onClick={handleFlip}>
              <i className="fas fa-microphone"></i> {/* Microphone icon for Go Back */}
            </button>

            {/* Recording buttons inside the back card */}
            <div className="rec-container">
              <button className="rec-btn" onClick={() => record()} id="toggle-rec-btn">Record</button>
            </div>
            <div className="rec-container">
              <button className="rec-btn" onClick={() => playAudio()} id="toggle-rec-btn">Play Recording</button>
            </div>
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
          <button className="feedback" onClick={() => fetchGeminiTips()}>feedback</button>
          <p>{geminiTips}</p>
        </div>
      )}
    </div>
  );
}

export default App;
