import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Users, 
  ArrowLeft, 
  MessageSquare, 
  Shield, 
  Settings,
  MoreVertical,
  CheckCircle,
  Zap,
  Target
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { db, auth } from '../firebase/config';
import { 
  doc, 
  onSnapshot, 
  updateDoc, 
  setDoc, 
  collection, 
  addDoc, 
  increment,
  getDoc,
  deleteDoc,
  arrayUnion,
  arrayRemove,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import Timer from '../components/Timer';

const FocusRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    if (!id) return;

    // Listen for room updates
    const roomRef = doc(db, "rooms", id);
    const unsubscribeRoom = onSnapshot(roomRef, (snapshot) => {
      if (snapshot.exists()) {
        setRoom({ id: snapshot.id, ...snapshot.data() });
        setLoading(false);
      } else {
        navigate('/dashboard');
      }
    });

    // Handle presence (Selfjoining)
    const handleJoin = async () => {
      await updateDoc(roomRef, {
        participants: arrayUnion({
          uid: auth.currentUser.uid,
          name: auth.currentUser.displayName || auth.currentUser.email.split('@')[0],
          photo: auth.currentUser.photoURL
        }),
        participantCount: increment(1)
      });
    };

    handleJoin();

    // Cleanup on leave
    return () => {
      unsubscribeRoom();
      const handleLeave = async () => {
        await updateDoc(roomRef, {
          participants: arrayRemove({
            uid: auth.currentUser.uid,
            name: auth.currentUser.displayName || auth.currentUser.email.split('@')[0],
            photo: auth.currentUser.photoURL
          }),
          participantCount: increment(-1)
        });
      };
      handleLeave();
    };
  }, [id]);

  const handleSessionComplete = async () => {
    // Record session in Firestore
    try {
      await addDoc(collection(db, "sessions"), {
        userId: auth.currentUser.uid,
        roomId: id,
        roomName: room.name,
        sessionDuration: 25,
        completedAt: new Date().toISOString()
      });

      // Update user stats
      const userRef = collection(db, "users");
      const qUser = query(userRef, where("uid", "==", auth.currentUser.uid));
      const userSnap = await getDocs(qUser);
      
      if (!userSnap.empty) {
        const userDocRef = doc(db, "users", userSnap.docs[0].id);
        await updateDoc(userDocRef, {
          focusMinutes: increment(25),
          sessionsCompleted: increment(1)
        });
      }
    } catch (error) {
      console.error("Error saving session:", error);
    }
  };

  if (loading) return <div className="loading-container"><div className="spinner"></div></div>;

  return (
    <div className="focus-room-container">
      <header className="room-header">
        <div className="header-left">
          <button className="btn-back" onClick={() => navigate('/dashboard')}>
            <ArrowLeft size={20} />
          </button>
          <div className="room-info">
            <div className="room-meta">
              <span className="room-id">ROOM ID: {id.slice(0, 8)}</span>
              <span className="dot" />
              <span className="room-status">ACTIVE SESSION</span>
            </div>
            <h2>{room?.name}</h2>
          </div>
        </div>
        
        <div className="header-right">
          <button className="btn-icon-round"><MessageSquare size={20} /></button>
          <button className="btn-icon-round"><Settings size={20} /></button>
          <button className="btn-icon-round"><MoreVertical size={20} /></button>
        </div>
      </header>

      <div className="room-grid">
        <div className="timer-section">
          <Timer initialMinutes={room?.timerMinutes || 25} onComplete={handleSessionComplete} />
          
          <div className="room-objectives">
            <h3>Current Objective</h3>
            <div className="objective-card glass-card">
              <CheckCircle size={20} color="#2563eb" />
              <p>Common Goal: Finish at least one deep work cycle with no distractions.</p>
            </div>
          </div>
        </div>

        <aside className="room-sidebar">
          <div className="sidebar-section">
            <div className="section-title">
              <Users size={18} />
              <span>Participants ({room?.participantCount || 0})</span>
            </div>
            
            <div className="participant-list">
              {room?.participants?.map((p, i) => (
                <div key={i} className="participant-item">
                  <div className="p-avatar">
                    {p.name.charAt(0).toUpperCase()}
                    {p.uid === room.creatorUid && <Shield size={10} className="owner-badge" />}
                  </div>
                  <div className="p-info">
                    <p>{p.name}</p>
                    <span>{p.uid === auth.currentUser.uid ? 'You' : 'Focusing...'}</span>
                  </div>
                  {p.uid === auth.currentUser.uid && <div className="online-indicator" />}
                </div>
              ))}
            </div>
          </div>

          <div className="sidebar-section">
            <div className="section-title">
              <Zap size={18} />
              <span>Session Stats</span>
            </div>
            <div className="mini-stats">
              <div className="mini-stat-card">
                <p>Room Total</p>
                <h4>154m</h4>
              </div>
              <div className="mini-stat-card">
                <p>Sessions</p>
                <h4>06</h4>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .focus-room-container { padding: 32px 48px; max-width: 1400px; margin: 0 auto; min-height: calc(100vh - 100px); }
        
        .room-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; }
        .header-left { display: flex; align-items: center; gap: 24px; }
        
        .btn-back { width: 44px; height: 44px; border-radius: 12px; background: white; border: 1px solid var(--border-color); display: flex; align-items: center; justify-content: center; }
        .btn-back:hover { background: #f9fafb; color: var(--accent-color); }

        .room-meta { display: flex; align-items: center; gap: 10px; margin-bottom: 4px; }
        .room-id { font-size: 0.75rem; font-weight: 700; color: var(--text-tertiary); letter-spacing: 0.05em; }
        .room-status { font-size: 0.75rem; font-weight: 800; color: var(--success-color); }
        .dot { width: 4px; height: 4px; background: var(--text-tertiary); border-radius: 50%; }
        .room-header h2 { font-size: 1.75rem; color: var(--text-primary); }

        .header-right { display: flex; gap: 12px; }
        .btn-icon-round { width: 44px; height: 44px; border-radius: 50%; background: white; border: 1px solid var(--border-color); display: flex; align-items: center; justify-content: center; color: var(--text-secondary); }
        .btn-icon-round:hover { color: var(--accent-color); border-color: var(--accent-color); }

        .room-grid { display: grid; grid-template-columns: 1fr 320px; gap: 48px; height: 100%; }
        
        .timer-section { display: flex; flex-direction: column; align-items: center; gap: 60px; padding: 40px; }
        
        .room-objectives { width: 100%; max-width: 450px; }
        .room-objectives h3 { font-size: 1.1rem; margin-bottom: 16px; color: var(--text-primary); }
        .objective-card { padding: 20px; border-radius: 20px; display: flex; gap: 16px; align-items: flex-start; background: white; border: 1px solid var(--border-color); }
        .objective-card p { font-size: 0.95rem; color: var(--text-secondary); line-height: 1.5; font-weight: 500; }

        .room-sidebar { display: flex; flex-direction: column; gap: 32px; }
        .sidebar-section { background: white; padding: 24px; border-radius: 24px; border: 1px solid var(--border-color); }
        .section-title { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; color: var(--text-primary); font-weight: 700; font-size: 0.95rem; }
        
        .participant-list { display: flex; flex-direction: column; gap: 16px; }
        .participant-item { display: flex; align-items: center; gap: 12px; position: relative; }
        .p-avatar { width: 36px; height: 36px; background: var(--bg-tertiary); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.9rem; position: relative; }
        .owner-badge { position: absolute; bottom: -2px; right: -2px; background: #fbbf24; border-radius: 50%; padding: 2px; color: white; }
        
        .p-info p { font-size: 0.9rem; font-weight: 700; color: var(--text-primary); }
        .p-info span { font-size: 0.75rem; color: var(--text-tertiary); font-weight: 600; }
        .online-indicator { width: 8px; height: 8px; background: var(--success-color); border-radius: 50%; margin-left: auto; }

        .mini-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .mini-stat-card { background: var(--bg-secondary); padding: 12px; border-radius: 16px; text-align: center; }
        .mini-stat-card p { font-size: 0.75rem; font-weight: 700; color: var(--text-tertiary); margin-bottom: 4px; text-transform: uppercase; }
        .mini-stat-card h4 { font-size: 1.1rem; color: var(--text-primary); }

        .loading-container { height: 80vh; display: flex; align-items: center; justify-content: center; }

        @media (max-width: 1100px) {
          .room-grid { grid-template-columns: 1fr; }
          .room-sidebar { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        }
        @media (max-width: 768px) {
          .room-header { flex-direction: column; align-items: flex-start; gap: 24px; }
          .room-sidebar { grid-template-columns: 1fr; }
        }
      `}} />
    </div>
  );
};

export default FocusRoom;
