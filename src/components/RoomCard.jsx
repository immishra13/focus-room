import React from 'react';
import { Users, Clock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const RoomCard = ({ room }) => {
  const navigate = useNavigate();

  return (
    <motion.div 
      className="room-card glass-card"
      whileHover={{ y: -5, boxShadow: '0 12px 24px -10px rgba(0,0,0,0.1)' }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="room-card-header">
        <div className="category-badge">Study Session</div>
        <h3 className="room-title">{room.name || 'General Study Room'}</h3>
      </div>
      
      <div className="room-card-stats">
        <div className="stat-item">
          <Users size={16} />
          <span>{room.participantCount || 0} online</span>
        </div>
        <div className="stat-item">
          <Clock size={16} />
          <span>{room.timerMinutes || 25}m session</span>
        </div>
      </div>

      <div className="room-card-footer">
        <div className="creator-info">
          <div className="mini-avatar">
            {room.createdBy?.charAt(0).toUpperCase() || 'A'}
          </div>
          <span>{room.createdBy || 'Anonymous'}</span>
        </div>
        <button 
          className="btn-join"
          onClick={() => navigate(`/room/${room.id}`)}
        >
          Join Room
          <ArrowRight size={16} />
        </button>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .room-card {
          padding: 24px;
          border-radius: var(--radius-lg);
          display: flex;
          flex-direction: column;
          gap: 20px;
          transition: all 0.3s ease;
          background: white;
          border: 1px solid var(--border-color);
        }

        .category-badge {
          display: inline-block;
          padding: 4px 12px;
          background: #eff6ff;
          color: var(--accent-color);
          font-size: 0.75rem;
          font-weight: 700;
          border-radius: 100px;
          margin-bottom: 12px;
          text-transform: uppercase;
        }

        .room-title {
          font-size: 1.25rem;
          color: var(--text-primary);
        }

        .room-card-stats {
          display: flex;
          gap: 16px;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.85rem;
          color: var(--text-secondary);
          font-weight: 500;
        }

        .room-card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 10px;
          padding-top: 16px;
          border-top: 1px solid var(--border-color);
        }

        .creator-info {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.85rem;
          color: var(--text-secondary);
        }

        .mini-avatar {
          width: 24px;
          height: 24px;
          background: var(--bg-tertiary);
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.7rem;
        }

        .btn-join {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: transparent;
          color: var(--accent-color);
          font-weight: 700;
          font-size: 0.85rem;
          border-radius: 8px;
        }

        .btn-join:hover {
          background: #f0f7ff;
        }
      `}} />
    </motion.div>
  );
};

export default RoomCard;
