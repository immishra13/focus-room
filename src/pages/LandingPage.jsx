import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Target, Users, ShieldCheck, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="landing-page">
      <section className="hero-section">
        <div className="hero-content animate-fade-in">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="hero-badge"
          >
            <Zap size={16} />
            <span>Productivity Redefined</span>
          </motion.div>
          
          <h1 className="hero-title">
            Focus Better, <span className="text-gradient">Together.</span>
          </h1>
          
          <p className="hero-subtitle">
            Join virtual study rooms, set group pomodoro timers, and track your focus sessions with students worldwide.
          </p>

          <div className="hero-actions">
            <Link to="/auth" className="btn-primary-large">
              Start Focusing Now
              <ArrowRight size={20} />
            </Link>
            <Link to="/auth?mode=signup" className="btn-secondary-large">
              Create an Account
            </Link>
          </div>

          <div className="hero-stats">
            <div className="stat">
              <h4>12k+</h4>
              <p>Active Students</p>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <h4>450k+</h4>
              <p>Focus Minutes</p>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <h4>98%</h4>
              <p>Success Rate</p>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="main-visual-card glass-card">
            <div className="mock-room-header">
              <div className="mock-dots"><span/><span/><span/></div>
              <div className="mock-title">Deep Work Session #42</div>
            </div>
            <div className="mock-body">
              <div className="mock-timer">24:59</div>
              <div className="mock-pills">
                <span className="pill">Pomodoro</span>
                <span className="pill">4 Participants</span>
              </div>
            </div>
          </div>
          <div className="decoration-circle circle-1" />
          <div className="decoration-circle circle-2" />
        </div>
      </section>

      <section className="features-section">
        <div className="section-header">
          <h2>Why Study With Us?</h2>
          <p>Features designed to keep you in the zone.</p>
        </div>

        <div className="features-grid">
          <FeatureCard 
            icon={<Target size={24} />}
            title="Shared Pomodoro"
            description="Sync your timer with every user in the room for collective focus."
          />
          <FeatureCard 
            icon={<Users size={24} />}
            title="Study Groups"
            description="Private or public rooms tailored to your specific study needs."
          />
          <FeatureCard 
            icon={<ShieldCheck size={24} />}
            title="Session Tracking"
            description="Automatically log every completed session to analyze your progress."
          />
          <FeatureCard 
            icon={<Clock size={24} />}
            title="Real-time Sync"
            description="Seamless synchronization across all devices and participants."
          />
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        .landing-page { padding: 40px 24px; max-width: 1200px; margin: 0 auto; }
        
        .hero-section {
          padding: 80px 0;
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 60px;
          align-items: center;
        }

        .hero-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: #eff6ff;
          color: var(--accent-color);
          border-radius: 100px;
          font-weight: 700;
          font-size: 0.85rem;
          margin-bottom: 24px;
          width: fit-content;
        }

        .hero-title {
          font-size: 4.5rem;
          line-height: 1.1;
          margin-bottom: 24px;
          color: var(--text-primary);
        }

        .text-gradient {
          background: linear-gradient(135deg, #2563eb, #7c3aed);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-subtitle {
          font-size: 1.25rem;
          color: var(--text-secondary);
          max-width: 500px;
          line-height: 1.6;
          margin-bottom: 40px;
        }

        .hero-actions { display: flex; gap: 16px; margin-bottom: 60px; }

        .btn-primary-large {
          background: var(--accent-color);
          color: white;
          padding: 16px 32px;
          border-radius: 16px;
          font-weight: 700;
          font-size: 1.1rem;
          display: flex;
          align-items: center;
          gap: 12px;
          box-shadow: 0 10px 25px -5px rgba(37, 99, 235, 0.4);
        }

        .btn-secondary-large {
          background: white;
          border: 1px solid var(--border-color);
          padding: 16px 32px;
          border-radius: 16px;
          font-weight: 700;
          font-size: 1.1rem;
          color: var(--text-primary);
        }

        .hero-stats { display: flex; align-items: center; gap: 32px; }
        .stat h4 { font-size: 1.5rem; color: var(--text-primary); }
        .stat p { font-size: 0.85rem; color: var(--text-tertiary); font-weight: 600; }
        .stat-divider { width: 1px; height: 30px; background: var(--border-color); }

        .hero-visual { position: relative; display: flex; justify-content: center; }

        .main-visual-card {
          width: 320px;
          padding: 24px;
          border-radius: 32px;
          z-index: 2;
          background: white;
        }

        .mock-room-header { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; }
        .mock-dots { display: flex; gap: 4px; }
        .mock-dots span { width: 6px; height: 6px; border-radius: 50%; background: #e5e7eb; }
        .mock-title { font-size: 0.8rem; font-weight: 700; color: #94a3b8; }
        
        .mock-timer { 
          font-size: 3.5rem; 
          font-family: 'Outfit', sans-serif; 
          font-weight: 800; 
          text-align: center; 
          margin-bottom: 20px;
          color: var(--accent-color);
        }

        .mock-pills { display: flex; gap: 8px; justify-content: center; }
        .mock-pills .pill { 
          padding: 4px 10px; 
          background: var(--bg-tertiary); 
          border-radius: 6px; 
          font-size: 0.7rem; 
          font-weight: 700; 
          color: var(--text-secondary); 
        }

        .decoration-circle { position: absolute; border-radius: 50%; z-index: 1; filter: blur(50px); }
        .circle-1 { width: 300px; height: 300px; background: rgba(37, 99, 235, 0.1); top: -50px; right: 0; }
        .circle-2 { width: 200px; height: 200px; background: rgba(124, 58, 237, 0.1); bottom: -50px; left: 0; }

        .features-section { padding: 100px 0; }
        .section-header { text-align: center; margin-bottom: 60px; }
        .section-header h2 { font-size: 2.5rem; margin-bottom: 12px; }
        .section-header p { font-size: 1.1rem; color: var(--text-secondary); }

        .features-grid { 
          display: grid; 
          grid-template-columns: repeat(4, 1fr); 
          gap: 24px; 
        }

        @media (max-width: 1000px) {
          .hero-title { font-size: 3.5rem; }
          .hero-section { grid-template-columns: 1fr; }
          .features-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 600px) {
          .hero-title { font-size: 2.8rem; }
          .hero-actions { flex-direction: column; }
          .features-grid { grid-template-columns: 1fr; }
        }
      `}} />
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <motion.div 
    className="feature-card glass-card"
    whileHover={{ y: -8 }}
    transition={{ type: 'spring', stiffness: 300 }}
  >
    <div className="feature-icon">{icon}</div>
    <h3>{title}</h3>
    <p>{description}</p>
    <style dangerouslySetInnerHTML={{ __html: `
      .feature-card { padding: 32px; border-radius: 24px; background: white; border: 1px solid var(--border-color); }
      .feature-icon { 
        width: 48px; height: 48px; 
        background: #f8fafc; 
        color: var(--accent-color); 
        border-radius: 12px; 
        display: flex; align-items: center; justify-content: center; 
        margin-bottom: 20px;
        border: 1px solid #f1f5f9;
      }
      .feature-card h3 { font-size: 1.25rem; margin-bottom: 12px; color: var(--text-primary); }
      .feature-card p { font-size: 0.95rem; color: var(--text-secondary); line-height: 1.6; }
    `}} />
  </motion.div>
);

export default LandingPage;
