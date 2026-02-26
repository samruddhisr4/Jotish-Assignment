import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Requirements: username "testuser", password "Test123"
    if (username === 'testuser' && password === 'Test123') {
      localStorage.setItem('isAuthenticated', 'true');
      navigate('/list');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin} className="login-card">
        <h1>Login</h1>

        {error && <p className="error-message" style={{ color: '#ff4d4d', marginBottom: '1rem' }}>{error}</p>}

        <div className="input-group">
          <User size={20} className="icon" />
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <Lock size={20} className="icon" />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="login-button">Login</button>
      </form>

      <style>{`
        .login-container {
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          font-family: 'Inter', sans-serif;
        }
        .login-card {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(10px);
          padding: 2.5rem;
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          width: 100%;
          max-width: 400px;
          text-align: center;
          color: white;
        }
        h1 { margin-bottom: 2rem; font-weight: 600; }
        .input-group {
          position: relative;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          padding: 0 1rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .icon { opacity: 0.7; margin-right: 10px; }
        input {
          background: transparent !important;
          border: none;
          padding: 1rem 0;
          color: white;
          width: 100%;
          outline: none;
          font-size: 1rem;
        }
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus {
          -webkit-text-fill-color: white;
          -webkit-box-shadow: 0 0 0px 1000px transparent inset;
          transition: background-color 5000s ease-in-out 0s;
        }
        input::placeholder { color: rgba(255, 255, 255, 0.6); }
        .login-button {
          width: 100%;
          padding: 1rem;
          border-radius: 10px;
          border: none;
          background: white;
          color: #764ba2;
          font-weight: bold;
          font-size: 1rem;
          cursor: pointer;
          transition: transform 0.2s, background 0.2s;
        }
        .login-button:hover {
          transform: translateY(-2px);
          background: #f0f0f0;
        }
      `}</style>
    </div>
  );
};

export default Login;
