import React, { useEffect, useRef, useState } from 'react';
import backgroundMusic from './night-in-kyoto-avbe-main-version-21302-01-57.mp3';
import './Dinosoar.css';

function Dino() {
  // References for the dinosaur and cactus DOM elements
  const dinoRef = useRef(null);
  const cactusRef = useRef(null);

  // State hooks for game status and score
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false); // Tracks if the game is over
  const [countdown, setCountdown] = useState(3); // Countdown before game starts
  const [showModal, setShowModal] = useState(false); // Controls the visibility of the game over modal

  // Audio setup for background music
  const audio = new Audio(backgroundMusic);

  // Effect hook for playing and pausing background music based on game state
  useEffect(() => {
    if (gameStarted && !gameOver) {
      audio.play().catch((e) => console.error('Playback failed', e));
    } else {
      audio.pause();
    }
    
    // Cleanup function to pause music when component unmounts or game state changes
    return () => audio.pause();
  }, [gameStarted, gameOver]);

  // Function to restart the game
  const restartGame = () => {
    // Find all elements with 'animated' class and remove the 'paused-animation' class
    document.querySelectorAll('.animated').forEach(el => {
      el.classList.remove('paused-animation');
    });

    // Reset the state variables to their initial values
    setShowModal(false);
    setScore(0);
    setGameOver(false);
    setGameStarted(false);
    setCountdown(3);
  };

  // Effect hook for the game countdown logic
  useEffect(() => {
    let timerId;
    if (!gameStarted && countdown > 0) {
      timerId = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0 && !gameOver) {
      setGameStarted(true);
    }
    
    // Cleanup function to clear timeout if component unmounts
    return () => clearTimeout(timerId);
  }, [countdown, gameStarted, gameOver]);

  // Effect hook to set up and clean up the keydown event listener for the jump action
  useEffect(() => {
    const jumpEventListener = (event) => {
      jump();
    };
    
    document.addEventListener('keydown', jumpEventListener);
    
    return () => document.removeEventListener('keydown', jumpEventListener);
  }, []);

  // Effect hook for the main game loop
  useEffect(() => {
    let intervalId;
    if (gameStarted && !gameOver) {
      intervalId = setInterval(() => {
        // Get the current position of the dinosaur and cactus
        const dinoTop = parseInt(window.getComputedStyle(dinoRef.current).getPropertyValue('top'));
        let cactusLeft = parseInt(window.getComputedStyle(cactusRef.current).getPropertyValue('left'));

        // Check for collision and update the game state accordingly
        if (cactusLeft < 250 && cactusLeft > 200 && dinoTop >= 130) {
          setShowModal(true);
          setGameOver(true); // Stop the game loop
        } else {
          // Increment the score if no collision
          setScore((prevScore) => prevScore + 1);
        }
      }, 10);
    }
    
    // Cleanup function to clear interval when game state changes
    return () => clearInterval(intervalId);
  }, [gameStarted, gameOver, score]);

  // Function to handle the dinosaur jump
  const jump = () => {
    if (dinoRef.current && !dinoRef.current.classList.contains('jump')) {
      dinoRef.current.classList.add('jump');
      setTimeout(() => {
        if (dinoRef.current) {
          dinoRef.current.classList.remove('jump');
        }
      }, 300);
    }
  };

  // Render function for the component
  return (
    <div className="game">
      {/* Countdown or game elements based on game state */}
      {!gameStarted && !gameOver ? (
        <div className="countdown">{countdown}</div>
      ) : (
        <>
          <h2>Score: {score}</h2>
          <div id="dino" ref={dinoRef} className="animated"></div>
          <div id="cactus" ref={cactusRef} className="animated"></div>
        </>
      )}
      {/* Game over modal */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <p>Game Over! Your Score: {score}</p>
            <button onClick={restartGame}>Restart Game</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dino;