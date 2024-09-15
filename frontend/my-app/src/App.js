import React, { useState, useEffect } from 'react';
import './App.css';
import { record, blob } from './audioRecorder';
import giveFeedback from './geminiLinguist';

function App() {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isMoved, setIsMoved] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isRatingContainerVisible, setIsRatingContainerVisible] = useState(false);
  const [ratingVisible, setRatingVisible] = useState(false); 
  const [isFeedbackContainerVisible, setIsFeedbackContainerVisible] = useState(false); 
  const [feedbackVisible, setFeedbackVisible] = useState(false); 

  const [geminiTips, setGeminiTips] = useState("Evaluating...");
  const [pronunciationAudioData, setPronunciationAudioData] = useState(null);

  const [pronunciation, setPronunciation] = useState("Fetching...");  
  const [definition, setDefinition] = useState("Fetching...");
  const [word] = useState("Atlas");  

  // Fetch the word pronunciation
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

  // Fetch word definition
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
  useEffect(() => {
    const fetchPronunciationAudioData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/word2aud/${word}`);
        if (response.ok) {
          const data = await response.json(); 
          setPronunciationAudioData(`data:audio/wav;base64,${data['audio_url']}`);  
        } else {
          console.error('Error fetching pronunciation sound after fetch:', response.status);
          setPronunciationAudioData("Error fetching pronunciation sound after fetch");
        }
      } catch (error) {
        console.error('Error fetching pronunciation sound before fetch:', error);
        setPronunciationAudioData("Error fetching pronunciation sound before fetch");
      }
    };

    fetchPronunciationAudioData();
  }, [word]);

  // Flip card and trigger animation sequence
  const handleFlip = () => {
    if (!isFlipped) {
      setTimeout(() => {
        setIsExpanded(true);
        setTimeout(() => {
          setIsMoved(true);
          setTimeout(() => {
            setIsRatingContainerVisible(true);
            setTimeout(() => {
              setRatingVisible(true); 
              setTimeout(() => {
                setIsFeedbackContainerVisible(true);
                setTimeout(() => {
                  setFeedbackVisible(true); 
                }, 100); 
              }, 600);
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

    setIsFlipped(!isFlipped); 
  };

  // Handle microphone click -> Start recording -> After recording, flip the card
  const handleMicClick = () => {
    console.log("Microphone clicked: Starting recording...");
    record(() => {
      console.log("Recording finished: Triggering flip...");
      handleFlip(); 
    });
  };

  // Play the recorded audio
  const playAudio = () => {
    if (blob) {
      const audio = new Audio();
      audio.src = URL.createObjectURL(blob);
      audio.play();
    }
  };

  const playPronunciationAudio = () => {
    if ([pronunciationAudioData]) {
      let audio = new Audio([pronunciationAudioData][0])
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
          {/* Front card */}
          <div className="card-front">
            <div className="pronunciation-container">
              <h2 className="dynamic-pronunciation">{pronunciation}</h2> {/* Fetched pronunciation */}
            </div>
            <h3 className="dynamic-word">{word}</h3> {/* Word */}
            {/* Microphone button triggers recording and flips after recording */}
            <button className="mic-button" onClick={handleMicClick}>
              <i className="fas fa-microphone"></i> {/* Microphone icon */}
            </button>
          </div>

          {/* Back card */}
          <div className="card-back">
            <button className="speaker-box">
              <i className="fas fa-volume-up"></i> {/* Speaker icon */}
            </button>
            <h2 className="dynamic-pronunciation">{pronunciation}</h2> {/* Fetched pronunciation */}
            <h3>{word}</h3> {/* Word */}
            <button className="mic-button" onClick={handleFlip}>
              <i className="fas fa-microphone"></i> {/* Microphone icon for Go Back */}
            </button>

            {/* Play Recording button styled similarly to other buttons */}
            <div className="rec-container">
              <button className="play-button" onClick={playAudio}>
                <i className="fas fa-play"></i> {/* Play button icon */}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Rating container */}
      {isRatingContainerVisible && (
        <div className={`rating-container ${ratingVisible ? 'rating-container-visible' : ''}`}>
          <h2>Rate Your Pronunciation</h2>
          <div className="rating-buttons">
            <button className="rating-button bad">Bad</button>
            <button className="rating-button ok">Ok</button>
            <button className="rating-button average">Average</button>
            <button className="rating-button good">Good</button>
          </div>
        </div>
      )}

      {/* Feedback container */}
      {isFeedbackContainerVisible && (
        <div className={`feedback-container ${feedbackVisible ? 'feedback-container-visible' : ''}`}>
          <h2>Feedback Container</h2>
          <button className="feedback" onClick={() => fetchGeminiTips()}>feedback</button>
          <p>{geminiTips}</p>
        </div>
      )}

      <div className="rec-container">
          <button className="rec-btn" onClick={() => playPronunciationAudio()} id="toggle-rec-btn">Play Proper Pronunciation</button>
      </div>
    </div>
  );
}

export default App;

