import { useEffect, useState, type FormEvent } from 'react';
import { ApiError } from '../api/client';
import { fetchHealth } from '../api/health';
import { RolePicker } from '../components/RolePicker';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner } from '../components/LoadingSpinner';
import type { SignupRole } from '../lib/roles';

type AuthMode = 'login' | 'signup';

export function LoginPage() {
  const { login, signup } = useAuth();
  const [mode, setMode] = useState<AuthMode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<SignupRole>('customer');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [backendWarning, setBackendWarning] = useState('');

  useEffect(() => {
    fetchHealth()
      .then((health) => {
        if (!health.auth) {
          setBackendWarning(
            'The server on port 3001 is an old version (no login/signup). Close all backend terminals, kill the process on port 3001, then run: cd backend → npm run dev. You must see: "Auth routes: POST /auth/login, POST /auth/signup".',
          );
        } else {
          setBackendWarning('');
        }
      })
      .catch(() => {
        setBackendWarning(
          'Cannot reach the API at http://localhost:3001. Start the backend with: cd backend → npm run dev',
        );
      });
  }, []);

  function switchMode(next: AuthMode) {
    setMode(next);
    setError('');
    setFieldErrors({});
    setConfirmPassword('');
    setRole('customer');
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    if (mode === 'signup') {
      const clientErrors: Record<string, string> = {};
      if (!name.trim()) clientErrors.name = 'Name is required';
      if (!email.trim()) clientErrors.email = 'Email is required';
      if (!password) clientErrors.password = 'Password is required';
      else if (password.length < 6) {
        clientErrors.password = 'Password must be at least 6 characters';
      }
      if (password !== confirmPassword) {
        clientErrors.confirmPassword = 'Passwords do not match';
      }
      if (Object.keys(clientErrors).length > 0) {
        setFieldErrors(clientErrors);
        return;
      }
    }

    setIsSubmitting(true);
    try {
      if (mode === 'login') {
        await login(email.trim(), password);
      } else {
        await signup({
          name: name.trim(),
          email: email.trim(),
          password,
          role,
        });
      }
    } catch (err) {
      if (err instanceof ApiError && err.details && typeof err.details === 'object') {
        const errors = (err.details as { errors?: Record<string, string> }).errors;
        if (errors) {
          setFieldErrors(errors);
          return;
        }
      }
      if (err instanceof ApiError && err.status === 409) {
        setError('This email is already registered. Sign in or use a different email.');
        return;
      }
      setError(
        err instanceof ApiError ? err.message : 'Something went wrong. Please try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-card__brand">
          <span className="login-card__logo" aria-hidden="true" />
          <h1>Ticket Support</h1>
          <p>
            {mode === 'login'
              ? 'Sign in to manage customer tickets'
              : 'Sign up as an agent or customer'}
          </p>
        </div>

        {backendWarning && (
          <div className="login-warning" role="alert">
            {backendWarning}
          </div>
        )}

        <div className="auth-tabs" role="tablist" aria-label="Authentication">
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'login'}
            className={`auth-tabs__btn ${mode === 'login' ? 'auth-tabs__btn--active' : ''}`}
            onClick={() => switchMode('login')}
          >
            Sign in
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'signup'}
            className={`auth-tabs__btn ${mode === 'signup' ? 'auth-tabs__btn--active' : ''}`}
            onClick={() => switchMode('signup')}
          >
            Sign up
          </button>
        </div>

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          {mode === 'signup' && (
            <div className={`form-field ${fieldErrors.name ? 'form-field--error' : ''}`}>
              <label htmlFor="auth-name">Full name</label>
              <input
                id="auth-name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
              />
              {fieldErrors.name && <span className="field-error">{fieldErrors.name}</span>}
            </div>
          )}

          <div className={`form-field ${fieldErrors.email ? 'form-field--error' : ''}`}>
            <label htmlFor="auth-email">Email</label>
            <input
              id="auth-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@support.com"
            />
            {fieldErrors.email && <span className="field-error">{fieldErrors.email}</span>}
          </div>

          <div className={`form-field ${fieldErrors.password ? 'form-field--error' : ''}`}>
            <label htmlFor="auth-password">Password</label>
            <input
              id="auth-password"
              type="password"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
            {fieldErrors.password && (
              <span className="field-error">{fieldErrors.password}</span>
            )}
          </div>

          {mode === 'signup' && (
            <div
              className={`form-field ${fieldErrors.confirmPassword ? 'form-field--error' : ''}`}
            >
              <label htmlFor="auth-confirm">Confirm password</label>
              <input
                id="auth-confirm"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
              />
              {fieldErrors.confirmPassword && (
                <span className="field-error">{fieldErrors.confirmPassword}</span>
              )}
            </div>
          )}

          {mode === 'signup' && (
            <RolePicker
              value={role}
              onChange={setRole}
              error={fieldErrors.role}
            />
          )}

          {error && (
            <p className="login-form__error" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="btn btn--primary login-form__submit"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? mode === 'login'
                ? 'Signing in…'
                : 'Creating account…'
              : mode === 'login'
                ? 'Sign in'
                : 'Create account'}
          </button>
        </form>
      </div>
    </div>
  );
}

export function LoginLoading() {
  return (
    <div className="login-page">
      <LoadingSpinner label="Checking session…" />
    </div>
  );
}
