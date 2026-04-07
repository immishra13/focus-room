import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase/config';
import { 
  CheckCircle, 
  User, 
  LogOut, 
  LayoutDashboard, 
  Trophy,
  Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <nav className="navbar-container glass-card">
      <div className="navbar-content">
        <Link to="/" className="navbar-logo">
          <div className="logo-box">
            <CheckCircle size={22} strokeWidth={3} />
          </div>
          <span>FocusRoom</span>
        </Link>

        <div className="navbar-links">
          {user ? (
            <>
              <Link to="/dashboard" className="nav-link">
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </Link>
              <div 
                className="user-profile-menu"
                onMouseEnter={() => setShowDropdown(true)}
                onMouseLeave={() => setShowDropdown(false)}
              >
                <div className="user-avatar">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName} />
                  ) : (
                    <User size={20} />
                  )}
                </div>
                
                <AnimatePresence>
                  {showDropdown && (
                    <motion.div 
                      className="dropdown-menu glass-card"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                    >
                      <div className="dropdown-header">
                        <p className="user-name">{user.displayName || user.email.split('@')[0]}</p>
                        <p className="user-email">{user.email}</p>
                      </div>
                      <div className="dropdown-divider" />
                      <button className="dropdown-item" onClick={handleLogout}>
                        <LogOut size={16} />
                        <span>Sign Out</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <Link to="/auth" className="btn-primary" style={{ padding: '8px 20px', fontSize: '0.9rem' }}>
              <span>Get Started</span>
            </Link>
          )}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .navbar-container {
          position: sticky;
          top: 0;
          z-index: 100;
          padding: 0 24px;
          height: 72px;
          display: flex;
          align-items: center;
          margin: 16px 24px;
          border-radius: 16px;
        }

        .navbar-content {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .navbar-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: 'Outfit', sans-serif;
          font-weight: 800;
          font-size: 1.25rem;
          color: var(--text-primary);
        }

        .logo-box {
          width: 36px;
          height: 36px;
          background: var(--accent-color);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
        }

        .navbar-links {
          display: flex;
          align-items: center;
          gap: 32px;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          font-size: 0.95rem;
          color: var(--text-secondary);
        }

        .nav-link:hover { color: var(--accent-color); }

        .user-profile-menu { position: relative; padding: 10px 0; }
        .user-avatar {
          width: 40px; height: 40px;
          background: var(--bg-tertiary);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          border: 2px solid white;
          box-shadow: var(--shadow-sm);
          overflow: hidden;
          cursor: pointer;
        }
        .user-avatar img { width: 100%; height: 100%; object-fit: cover; }

        .dropdown-menu {
          position: absolute;
          top: 100%; right: 0;
          width: 220px;
          margin-top: 8px;
          padding: 16px;
          border-radius: var(--radius-md);
        }

        .dropdown-header { margin-bottom: 12px; }
        .user-name { font-weight: 700; color: var(--text-primary); font-size: 0.95rem; }
        .user-email { font-size: 0.8rem; color: var(--text-tertiary); }

        .dropdown-divider { height: 1px; background: var(--border-color); margin: 8px 0; }

        .dropdown-item {
          width: 100%;
          display: flex; align-items: center; gap: 10px;
          padding: 8px;
          border-radius: 8px;
          color: var(--text-secondary);
          background: transparent;
          font-weight: 600;
          font-size: 0.9rem;
        }
        .dropdown-item:hover { background: var(--bg-secondary); color: var(--danger-color); }

        @media (max-width: 768px) {
          .nav-link span { display: none; }
          .navbar-links { gap: 16px; }
        }
      `}} />
    </nav>
  );
};

export default Navbar;
