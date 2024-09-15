import React, { useState, useEffect } from 'react';
import './App.css';
import { record, blob, inputPhoneme } from './audioRecorder';
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
  const [definition, setDefinition] = useState("Fetching...");  // Definition state
  const [word, setWord] = useState("Fetching word...");
  const [wordId, setWordId] = useState("0");

  // Fetch the word from backend
  useEffect(() => {
    const fetchWord = async () => {
      if (word !== "Fetching word...") {
        return
      }

      const errMsg = 'Error fetching word'
      try {
        const response = await fetch(`http://localhost:3001/api/nextPractice`);

        if (response.ok) {
          const data = await response.json();
          setWordId(data._id);
          setWord(data.word)
        } else {
          console.error(errMsg);
          setWord(errMsg)
        }
      } catch (error) {
        console.error(errMsg)
        setWord(errMsg)
      }
    }

    fetchWord() 
  })

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
  });

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
  });

  const fetchGeminiTips = async (user, correct) => {
    try {
      const response = await giveFeedback(correct, user);
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
  });

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
      fetchGeminiTips(pronunciation, inputPhoneme)
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

  // Play the fetched pronunciation audio
  const playPronunciationAudio = () => {
    if (pronunciationAudioData) {
      let audio = new Audio(pronunciationAudioData); 
      audio.play();
    }
  };

  const sendRating = async (rating) => {
    try {
      await fetch('http://localhost:3001/api/ratePractice', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ rating: rating, _id: wordId })
      });

      const nextWordData = await (await fetch("http://localhost:3001/api/nextPractice")).json();
      const nextWord = nextWordData.word;

      setWord(nextWord);
    } catch (error) {
      console.error('Error sending rating:', error);
    }
  };

  return (  
    <div className={`app-container ${isMoved ? 'moved' : ''}`}>
      <header className="app-header">
        <h1 className="main-title">Vocowbulary.courses</h1>
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
            <div className="back-left">
              {/* Left side of the content */}
              <div className="back-content-left">
                <button className="speaker-box" onClick={playPronunciationAudio}>
                  <i className="fas fa-volume-up"></i> {/* Speaker icon */}
                </button>
                <button className="mic-button" onClick={handleFlip}>
                  <i className="fas fa-undo"></i> {/* Undo icon */}
                </button>
                {/* Play Recording button */}
                <div className="rec-container">
                  <button className="play-button" onClick={playAudio}>
                    <i className="fas fa-play"></i> {/* Play button icon */}
                  </button>
                </div>

                {/* Pronunciation and word */}
                <h2 className="dynamic-pronunciation-back">{pronunciation}</h2>
                <h3>{word}</h3>
                <p className="definition">Definition: {definition}</p>
              </div>
            </div>

            {/* Right side container for feedback content */}
            <div className="back-right">
              <h2>{geminiTips}</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Rating container */}
      {isRatingContainerVisible && (
        <div className={`rating-container ${ratingVisible ? 'rating-container-visible' : ''}`}>
          <h2>Rate Your Pronunciation</h2>
          <div className="rating-buttons">
            <button className="rating-button bad" onClick={async () => {
              await sendRating(0)
            }}>Bad</button>
            <button className="rating-button ok" onClick={async () => {
              await sendRating(1)
            }}>Ok</button>
            <button className="rating-button average" onClick={async () => {
              await sendRating(2)
            }}>Average</button>
            <button className="rating-button good" onClick={async () => {
              await sendRating(3)
            }}>Good</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
