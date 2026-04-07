import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  LayoutGrid, 
  Trophy, 
  Clock, 
  Zap,
  ArrowRight,
  TrendingUp,
  Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { db, auth } from '../firebase/config';
import { collection, query, onSnapshot, addDoc, getDocs, where } from 'firebase/firestore';
import RoomCard from '../components/RoomCard';

const Dashboard = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [stats, setStats] = useState({ focusMinutes: 0, sessions: 0 });

  useEffect(() => {
    // Listen for active rooms
    const q = query(collection(db, "rooms"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const roomData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRooms(roomData);
      setLoading(false);
    });

    // Fetch user stats
    const fetchUserStats = async () => {
      const userRef = collection(db, "users");
      const qUser = query(userRef, where("uid", "==", auth.currentUser.uid));
      const querySnapshot = await getDocs(qUser);
      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        setStats({ 
          focusMinutes: userData.focusMinutes || 0, 
          sessions: userData.sessionsCompleted || 0 
        });
      }
    };

    fetchUserStats();
    return () => unsubscribe();
  }, []);

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    if (!newRoomName.trim()) return;

    try {
      await addDoc(collection(db, "rooms"), {
        name: newRoomName,
        createdBy: auth.currentUser.displayName || auth.currentUser.email.split('@')[0],
        creatorUid: auth.currentUser.uid,
        createdAt: new Date().toISOString(),
        participantCount: 1,
        timerMinutes: 25
      });
      setNewRoomName('');
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error creating room:", error);
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-info">
          <h1>Welcome, {auth.currentUser?.displayName?.split(' ')[0] || 'User'}!</h1>
          <p>Ready for another productive session? Let's get to work.</p>
        </div>
        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={20} />
          Create Room
        </button>
      </header>

      <div className="stats-row">
        <StatCard icon={<Clock size={22} />} label="Total Focus Time" value={`${stats.focusMinutes} min`} color="#2563eb" />
        <StatCard icon={<Trophy size={22} />} label="Sessions Completed" value={stats.sessions} color="#10b981" />
        <StatCard icon={<Users size={22} />} label="Active Rooms" value={rooms.length} color="#7c3aed" />
        <StatCard icon={<Award size={22} />} label="Rank" value="Novice" color="#f59e0b" />
      </div>

      <div className="dashboard-content">
        <div className="content-header">
          <div className="header-tabs">
            <button className="tab active">
              <LayoutGrid size={18} />
              Explore Rooms
            </button>
          </div>
          <div className="search-wrapper">
            <Search size={18} />
            <input type="text" placeholder="Search for rooms..." />
          </div>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="spinner" />
            <p>Loading rooms...</p>
          </div>
        ) : (
          <div className="rooms-grid">
            {rooms.length > 0 ? (
              rooms.map(room => (
                <RoomCard key={room.id} room={room} />
              ))
            ) : (
              <div className="empty-state glass-card">
                <Users size={48} />
                <h3>No rooms available</h3>
                <p>Be the first to create a study room and invite others!</p>
                <button className="btn-outline" onClick={() => setIsModalOpen(true)}>Create First Room</button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Create Room Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div 
              className="modal-content glass-card"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
            >
              <h3>Create New Focus Room</h3>
              <p>Define your space and start focusing with others.</p>
              
              <form onSubmit={handleCreateRoom}>
                <div className="input-group">
                  <label>Room Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Deep Work Session" 
                    value={newRoomName}
                    onChange={e => setNewRoomName(e.target.value)}
                    required
                  />
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn-outline" onClick={() => setIsModalOpen(false)}>Cancel</button>
                  <button type="submit" className="btn-primary">Create Room</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: `
        .dashboard-container { padding: 40px; max-width: 1200px; margin: 0 auto; }
        .dashboard-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 40px; }
        .header-info h1 { font-size: 2.2rem; margin-bottom: 4px; color: var(--text-primary); }
        .header-info p { color: var(--text-tertiary); font-weight: 500; font-size: 1rem; }

        .stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; margin-bottom: 60px; }
        
        .dashboard-content { position: relative; }
        .content-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; }
        .header-tabs { display: flex; gap: 8px; }
        .tab { 
          display: flex; align-items: center; gap: 8px; padding: 10px 20px; 
          border-radius: 100px; background: white; border: 1px solid var(--border-color);
          font-weight: 600; color: var(--text-secondary);
        }
        .tab.active { background: var(--text-primary); color: white; border-color: var(--text-primary); }

        .search-wrapper { position: relative; display: flex; align-items: center; }
        .search-wrapper svg { position: absolute; left: 16px; color: var(--text-tertiary); }
        .search-wrapper input { 
          padding: 10px 16px 10px 48px; border-radius: 100px; border: 1px solid var(--border-color); 
          width: 300px; font-weight: 500;
        }

        .rooms-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
        
        .loading-state { text-align: center; padding: 100px; }
        .spinner { 
          width: 40px; height: 40px; border: 4px solid #f3f4f6; border-top-color: var(--accent-color); 
          border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 16px;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .empty-state {
          grid-column: span 3; text-align: center; padding: 60px; border-radius: 32px;
          display: flex; flex-direction: column; align-items: center; gap: 16px;
        }
        .empty-state svg { color: var(--text-tertiary); margin-bottom: 12px; }
        .empty-state h3 { font-size: 1.5rem; color: var(--text-primary); }
        .empty-state p { color: var(--text-tertiary); max-width: 400px; margin-bottom: 12px; }

        .modal-overlay { 
          position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.4); 
          backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 1000;
        }
        .modal-content { width: 100%; max-width: 450px; padding: 40px; border-radius: 32px; background: white; }
        .modal-content h3 { font-size: 1.5rem; margin-bottom: 8px; }
        .modal-content p { color: var(--text-tertiary); margin-bottom: 32px; font-weight: 500; }
        
        .modal-content .input-group { display: flex; flex-direction: column; gap: 8px; margin-bottom: 32px; }
        .modal-content input { padding: 14px 16px; border-radius: 12px; border: 1px solid var(--border-color); background: #f8fafc; }
        
        .modal-actions { display: flex; gap: 12px; }
        .modal-actions button { flex: 1; padding: 14px; font-weight: 700; border-radius: 12px; }

        @media (max-width: 1000px) {
          .stats-row { grid-template-columns: repeat(2, 1fr); }
          .rooms-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 600px) {
          .rooms-grid { grid-template-columns: 1fr; }
          .stats-row { grid-template-columns: 1fr; }
          .dashboard-header { flex-direction: column; align-items: flex-start; gap: 24px; }
        }
      `}} />
    </div>
  );
};

const StatCard = ({ icon, label, value, color }) => (
  <div className="stat-card glass-card">
    <div className="stat-icon" style={{ background: `${color}15`, color: color }}>{icon}</div>
    <div className="stat-info">
      <p className="stat-label">{label}</p>
      <h3 className="stat-value">{value}</h3>
    </div>
    <style dangerouslySetInnerHTML={{ __html: `
      .stat-card { padding: 24px; border-radius: 24px; background: white; display: flex; align-items: center; gap: 16px; border: 1px solid var(--border-color); }
      .stat-icon { width: 48px; height: 48px; border-radius: 16px; display: flex; align-items: center; justify-content: center; }
      .stat-label { font-size: 0.85rem; font-weight: 600; color: var(--text-tertiary); margin-bottom: 4px; }
      .stat-value { font-size: 1.25rem; font-weight: 800; color: var(--text-primary); font-family: 'Outfit', sans-serif; }
    `}} />
  </div>
);

export default Dashboard;
