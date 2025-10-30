import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <div className="container">
        {/* Navigation */}
        <nav className="home-nav">
          <h1>Let's Collab</h1>
          <div>
            <button onClick={() => navigate('/login')}>Login</button>
            <button onClick={() => navigate('/signup')}>Sign Up</button>
          </div>
        </nav>

        {/* Main Hero Section */}
        <div className="hero">
          <h2>Collaborate in Real-Time on Digital Whiteboards</h2>
          <p>Create, share, and collaborate on whiteboards with your team</p>
          <button onClick={() => navigate('/signup')}>Get Started</button>
        </div>

        {/* Features */}
        <div className="features">
          <div className="feature">
            <span>🎨</span>
            <h3>Drawing Tools</h3>
            <p>Pen, shapes, text and more</p>
          </div>
          <div className="feature">
            <span>⚡</span>
            <h3>Real-Time Sync</h3>
            <p>See changes instantly</p>
          </div>
          <div className="feature">
            <span>🔒</span>
            <h3>Secure</h3>
            <p>Control permissions</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
