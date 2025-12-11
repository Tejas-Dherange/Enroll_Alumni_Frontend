import React, { useState } from 'react';
import '../styles/auth.css';
import LoginForm from '../pages/Login';
import SignupForm from '../pages/Signup';

type Props = { initialTab?: 'login' | 'signup' };
export default function AuthPage({ initialTab = 'login' }: Props) {
   const [isSignup, setIsSignup] = useState(initialTab === 'signup')

  return (
    <div className="auth-page-root">
      <div className={`wrapper ${isSignup ? 'signup-mode' : 'login-mode'}`} aria-live="polite">
        <div className="title-text" aria-hidden>
          <div className="title login">Login Form</div>
          <div className="title signup">Signup Form</div>
        </div>

        <div className="form-container">
          <div className="slide-controls" role="tablist" aria-label="Authentication choice">
            <button
              role="tab"
              aria-selected={!isSignup}
              className={`slide login ${!isSignup ? 'active' : ''}`}
              onClick={() => setIsSignup(false)}
            >
              Login
            </button>

            <button
              role="tab"
              aria-selected={isSignup}
              className={`slide signup ${isSignup ? 'active' : ''}`}
              onClick={() => setIsSignup(true)}
            >
              Signup
            </button>

            <div className="slider-tab" aria-hidden />
          </div>

          <div className="form-inner" aria-live="polite">
            {/* pass callbacks/props if needed */}
            <div className="form-panel">
              <LoginForm />
            </div>

            <div className="form-panel">
              <SignupForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
