import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  CheckCircle, 
  Target,
  ShieldCheck,
  Clock 
} from 'lucide-react';
import { auth, db, googleProvider } from '../firebase/config';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  updateProfile,
  signInWithPopup 
} from 'firebase/auth';
import { setDoc, doc, getDoc } from 'firebase/firestore';

const AuthPage = () => {
  const [searchParams] = useSearchParams();
  const isSignupInit = searchParams.get('mode') === 'signup';
  const [isLogin, setIsLogin] = useState(!isSignupInit);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    displayName: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, formData.email, formData.password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        const user = userCredential.user;
        
        await updateProfile(user, { displayName: formData.displayName });
        
        // Create user doc in Firestore
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          displayName: formData.displayName,
          email: formData.email,
          createdAt: new Date().toISOString(),
          focusMinutes: 0,
          sessionsCompleted: 0
        });
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Sync with Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userDocRef);

      if (!userSnap.exists()) {
        await setDoc(userDocRef, {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          createdAt: new Date().toISOString(),
          focusMinutes: 0,
          sessionsCompleted: 0,
          provider: 'google'
        });
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-content-box glass-card">
        <div className="auth-sidebar">
          <div className="sidebar-brand">
            <CheckCircle size={24} />
            <span>FocusRoom</span>
          </div>
          
          <div className="sidebar-benefits">
            <BenefitItem 
              icon={<Target size={20} />} 
              title="Goal Oriented" 
              desc="Set study goals and achieve them with the community."
            />
            <BenefitItem 
              icon={<Clock size={20} />} 
              title="Time Management" 
              desc="Master your schedule with integrated Pomodoro."
            />
            <BenefitItem 
              icon={<ShieldCheck size={20} />} 
              title="Secure Progress" 
              desc="Your study data is encrypted and synced safely."
            />
          </div>

          <div className="sidebar-footer">
            Join 12,000+ students worldwide.
          </div>
        </div>

        <div className="auth-form-section">
          <div className="form-header">
            <h2>{isLogin ? 'Welcome Back' : 'Get Started'}</h2>
            <p>{isLogin ? 'Enter your details to resume your study journey.' : 'Create an account to join global study rooms.'}</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div 
                  className="input-group"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <label>Full Name</label>
                  <div className="input-wrapper">
                    <User size={18} className="input-icon" />
                    <input 
                      type="text" 
                      name="displayName"
                      placeholder="John Doe"
                      required
                      value={formData.displayName}
                      onChange={handleChange}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="input-group">
              <label>Email Address</label>
              <div className="input-wrapper">
                <Mail size={18} className="input-icon" />
                <input 
                  type="email" 
                  name="email"
                  placeholder="name@university.com"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="input-group">
              <label>Password</label>
              <div className="input-wrapper">
                <Lock size={18} className="input-icon" />
                <input 
                  type="password" 
                  name="password"
                  placeholder="••••••••"
                  required
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
              {!loading && <ArrowRight size={18} />}
            </button>

            <div className="auth-divider">
              <span>Or continue with</span>
            </div>

            <button 
              type="button" 
              className="btn-google" 
              onClick={handleGoogleSignIn}
              disabled={loading}
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/hf/google.svg" alt="Google" />
              Sign in with Google
            </button>

            <p className="toggle-text">
              {isLogin ? "New to FocusRoom?" : "Already have an account?"}{' '}
              <button type="button" onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? 'Sign Up' : 'Log In'}
              </button>
            </p>
          </form>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .auth-content-box {
          width: 100%;
          max-width: 1000px;
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          border-radius: 32px;
          overflow: hidden;
          background: white;
          box-shadow: 0 50px 100px -20px rgba(0,0,0,0.1);
        }

        .auth-sidebar {
          background: var(--accent-color);
          padding: 48px;
          color: white;
          display: flex;
          flex-direction: column;
        }

        .sidebar-brand { display: flex; align-items: center; gap: 12px; font-weight: 800; font-size: 1.5rem; font-family: 'Outfit', sans-serif; margin-bottom: 60px; }
        .sidebar-benefits { display: flex; flex-direction: column; gap: 32px; flex: 1; }
        .sidebar-footer { font-size: 0.85rem; color: rgba(255,255,255,0.7); font-weight: 600; }

        .auth-form-section { padding: 64px; }
        .form-header { margin-bottom: 40px; }
        .form-header h2 { font-size: 2rem; margin-bottom: 8px; color: var(--text-primary); }
        .form-header p { color: var(--text-tertiary); line-height: 1.6; }

        .auth-form { display: flex; flex-direction: column; gap: 24px; }
        .input-group { display: flex; flex-direction: column; gap: 8px; }
        .input-group label { font-size: 0.85rem; font-weight: 700; color: var(--text-secondary); }
        
        .input-wrapper { position: relative; display: flex; align-items: center; }
        .input-icon { position: absolute; left: 16px; color: var(--text-tertiary); }
        .input-wrapper input {
          width: 100%;
          padding: 14px 16px 14px 48px;
          background: #f8fafc;
          border: 1px solid var(--border-color);
          border-radius: 12px;
          font-size: 1rem;
        }
        .input-wrapper input:focus { outline: none; border-color: var(--accent-color); background: white; }

        .error-message { 
          padding: 12px; background: #fff1f2; color: var(--danger-color); 
          border-radius: 10px; font-size: 0.85rem; font-weight: 600; border: 1px solid #fee2e2;
        }

        .toggle-text { text-align: center; margin-top: 24px; font-size: 0.9rem; color: var(--text-tertiary); }
        .toggle-text button { background: none; border: none; color: var(--accent-color); font-weight: 700; cursor: pointer; }

        .auth-divider {
          position: relative;
          text-align: center;
          margin: 10px 0;
        }
        .auth-divider::before {
          content: "";
          position: absolute;
          top: 50%; left: 0; right: 0;
          height: 1px; background: var(--border-color);
          z-index: 0;
        }
        .auth-divider span {
          position: relative;
          z-index: 1;
          background: white;
          padding: 0 16px;
          font-size: 0.85rem;
          color: var(--text-tertiary);
        }

        .btn-google {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 12px;
          background: white;
          border: 1px solid var(--border-color);
          border-radius: 12px;
          font-weight: 700;
          color: var(--text-primary);
          cursor: pointer;
          transition: 0.2s;
        }
        .btn-google:hover {
          background: #f8fafc;
          border-color: var(--text-tertiary);
        }
        .btn-google img {
          width: 18px;
          height: 18px;
        }

        @media (max-width: 900px) {
          .auth-content-box { grid-template-columns: 1fr; max-width: 500px; }
          .auth-sidebar { display: none; }
          .auth-form-section { padding: 40px; }
        }
      `}} />
    </div>
  );
};

const BenefitItem = ({ icon, title, desc }) => (
  <div className="benefit-item" style={{ display: 'flex', gap: 16 }}>
    <div className="benefit-icon" style={{ 
      width: 40, height: 40, background: 'rgba(255,255,255,0.2)', 
      borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      {icon}
    </div>
    <div className="benefit-text">
      <h4 style={{ fontSize: '1.1rem', marginBottom: 4 }}>{title}</h4>
      <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.5 }}>{desc}</p>
    </div>
  </div>
);

export default AuthPage;
