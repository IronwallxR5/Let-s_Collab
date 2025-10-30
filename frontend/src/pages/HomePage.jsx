import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <div className="container">
        <nav className="home-nav">
          <h1 className="home-logo">Let's Collab</h1>
          <div className="nav-buttons">
            <button
              onClick={() => navigate('/login')}
              className="btn-login"
            >
              Login
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="btn-signup"
            >
              Sign Up
            </button>
          </div>
        </nav>

        <div className="hero-section">
          <h2 className="hero-title">
            Collaborate in Real-Time on
            <span className="hero-title-highlight"> Digital Whiteboards</span>
          </h2>
          <p className="hero-description">
            Create, share, and collaborate on infinite whiteboards with your team.
            Draw, sketch, and brainstorm together in real-time.
          </p>
          <button
            onClick={() => navigate('/signup')}
            className="btn-cta"
          >
            Get Started for Free
          </button>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🎨</div>
            <h3 className="feature-title">Powerful Drawing Tools</h3>
            <p className="feature-description">
              Pen, shapes, text, sticky notes, and more. Everything you need to bring your ideas to life.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3 className="feature-title">Real-Time Collaboration</h3>
            <p className="feature-description">
              See changes instantly as your team collaborates. Track cursors and chat in real-time.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3 className="feature-title">Secure & Private</h3>
            <p className="feature-description">
              Control who can view and edit your boards with granular permission settings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
