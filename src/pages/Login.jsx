import React, { useState } from 'react';
import { auth, isDemoMode } from '../lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Info } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { loginDemo } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (isDemoMode) {
      loginDemo(email);
      navigate('/');
      return;
    }

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '400px', padding: '2.5rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem', textAlign: 'center' }}>
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>
        
        {isDemoMode && (
          <div style={{ background: 'rgba(99, 102, 241, 0.1)', border: '1px solid var(--primary-color)', color: 'var(--primary-color)', padding: '0.75rem', borderRadius: '12px', marginBottom: '1.5rem', fontSize: '0.875rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <Info size={18} />
            <span><strong>Demo Mode:</strong> Any credentials will work.</span>
          </div>
        )}

        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '2rem' }}>
          {isLogin ? 'Enter your details to sign in' : 'Join us and start managing tasks'}
        </p>

        {error && (
          <div style={{ background: 'rgba(244, 63, 94, 0.1)', border: '1px solid var(--accent-color)', color: 'var(--accent-color)', padding: '0.75rem', borderRadius: '12px', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input 
                type="email" 
                className="input-field" 
                style={{ paddingLeft: '3rem' }}
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input 
                type="password" 
                className="input-field" 
                style={{ paddingLeft: '3rem' }}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
            <span>{isLogin ? 'Sign In' : 'Sign Up'}</span>
            <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <button 
            onClick={() => setIsLogin(!isLogin)} 
            style={{ background: 'none', border: 'none', color: 'var(--primary-color)', cursor: 'pointer', fontSize: '0.875rem' }}
          >
            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
