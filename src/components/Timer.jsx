import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Clock, Coffee, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Timer = ({ initialMinutes = 25, onComplete }) => {
  const [seconds, setSeconds] = useState(initialMinutes * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('focus'); // 'focus' or 'break'

  useEffect(() => {
    let interval = null;
    
    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds(seconds => seconds - 1);
      }, 1000);
    } else if (seconds === 0) {
      setIsActive(false);
      onComplete?.();
      handleToggleMode();
    }
    
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  const handleToggleMode = () => {
    if (mode === 'focus') {
      setMode('break');
      setSeconds(5 * 60);
    } else {
      setMode('focus');
      setSeconds(25 * 60);
    }
  };

  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = () => {
    setIsActive(false);
    setSeconds(mode === 'focus' ? initialMinutes * 60 : 5 * 60);
  };

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = (seconds / (mode === 'focus' ? initialMinutes * 60 : 5 * 60)) * 100;

  return (
    <div className="timer-container glass-card">
      <div className="timer-header">
        <div className={`mode-badge ${mode}`}>
          {mode === 'focus' ? <Zap size={16} /> : <Coffee size={16} />}
          <span>{mode === 'focus' ? 'Focus Session' : 'Short Break'}</span>
        </div>
      </div>

      <div className="timer-display">
        <div className="progress-ring">
          <svg viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" className="ring-bg" />
            <motion.circle 
              cx="50" cy="50" r="45" 
              className="ring-progress"
              strokeDasharray="283"
              strokeDashoffset={283 - (283 * progress) / 100}
              style={{ stroke: mode === 'focus' ? '#2563eb' : '#10b981' }}
            />
          </svg>
          <div className="time-text">
            <h1>{formatTime(seconds)}</h1>
            <p>{isActive ? 'Keep pushing!' : 'Ready?'}</p>
          </div>
        </div>
      </div>

      <div className="timer-controls">
        <button className="btn-icon" onClick={resetTimer}>
          <RotateCcw size={24} />
        </button>
        <button className="btn-main-action" onClick={toggleTimer}>
          {isActive ? <Pause size={32} /> : <Play size={32} />}
        </button>
        <div className="btn-icon placeholder" />
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .timer-container {
          padding: 48px;
          border-radius: 40px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 40px;
          width: 100%;
          max-width: 450px;
          background: white;
          border: 1px solid var(--border-color);
        }

        .mode-badge {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 20px;
          border-radius: 100px;
          font-weight: 700;
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .mode-badge.focus {
          background: #eff6ff;
          color: #2563eb;
        }

        .mode-badge.break {
          background: #ecfdf5;
          color: #10b981;
        }

        .timer-display {
          position: relative;
          width: 280px;
          height: 280px;
        }

        .progress-ring {
          width: 100%;
          height: 100%;
          transform: rotate(-90deg);
        }

        svg { width: 100%; height: 100%; }

        .ring-bg {
          fill: none;
          stroke: #f3f4f6;
          stroke-width: 6;
        }

        .ring-progress {
          fill: none;
          stroke-width: 6;
          stroke-linecap: round;
          transition: stroke-dashoffset 0.3s ease;
        }

        .time-text {
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%) rotate(90deg);
          text-align: center;
        }

        .time-text h1 {
          font-size: 4rem;
          margin: 0;
          line-height: 1;
          color: var(--text-primary);
        }

        .time-text p {
          font-weight: 600;
          color: var(--text-tertiary);
          margin-top: 4px;
        }

        .timer-controls {
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .btn-icon {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-tertiary);
          background: var(--bg-tertiary);
        }

        .btn-icon:hover {
          color: var(--text-primary);
          background: var(--border-color);
        }

        .btn-main-action {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--accent-color);
          color: white;
          box-shadow: 0 12px 24px rgba(37, 99, 235, 0.3);
        }

        .btn-main-action:hover {
          transform: scale(1.05);
          background: var(--accent-hover);
        }

        .placeholder { background: transparent; pointer-events: none; }
      `}} />
    </div>
  );
};

export default Timer;
