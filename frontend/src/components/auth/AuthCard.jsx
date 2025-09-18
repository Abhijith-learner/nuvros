import React from 'react';

const AuthCard = ({
  authView,
  setAuthView,
  authError,
  authLoading,
  authForm,
  onAuthChange,
  onLogin,
  onSignup,
}) => (
  <div className="auth-card">
    <div className="auth-toggle">
      <button className={authView === 'login' ? 'active' : ''} onClick={() => setAuthView('login')}>Sign In</button>
      <button className={authView === 'signup' ? 'active' : ''} onClick={() => setAuthView('signup')}>Sign Up</button>
    </div>
    {authError && <div className="error">{authError}</div>}
    {authView === 'login' ? (
      <form onSubmit={onLogin} className="auth-form">
        <label>
          Username
          <input name="username" value={authForm.username} onChange={onAuthChange} required />
        </label>
        <label>
          Password
          <input type="password" name="password" value={authForm.password} onChange={onAuthChange} required />
        </label>
        <button type="submit" disabled={authLoading} className="refresh-btn">{authLoading ? 'Signing in...' : 'Sign In'}</button>
      </form>
    ) : (
      <form onSubmit={onSignup} className="auth-form">
        <label>
          Username
          <input name="username" value={authForm.username} onChange={onAuthChange} required />
        </label>
        <label>
          Email
          <input type="email" name="email" value={authForm.email} onChange={onAuthChange} />
        </label>
        <label>
          Full name
          <input name="full_name" value={authForm.full_name} onChange={onAuthChange} />
        </label>
        <label>
          Password
          <input type="password" name="password" value={authForm.password} onChange={onAuthChange} required />
        </label>
        <button type="submit" disabled={authLoading} className="refresh-btn">{authLoading ? 'Creating...' : 'Create Account'}</button>
      </form>
    )}
  </div>
);

export default AuthCard;


