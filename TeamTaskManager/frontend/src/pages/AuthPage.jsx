import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const demoCredentials = [
  { label: 'Admin', email: 'admin@example.com', password: 'Admin123!' },
  { label: 'Member', email: 'member@example.com', password: 'Member123!' }
];

export function AuthPage({ mode }) {
  const navigate = useNavigate();
  const { login, signup } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isSignup = mode === 'signup';
  const title = useMemo(() => (isSignup ? 'Create your account' : 'Welcome back'), [isSignup]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      if (isSignup) {
        await signup(form);
      } else {
        await login(form);
      }
      navigate('/');
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setSubmitting(false);
    }
  }

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  return (
    <div className="auth-layout">
      <section className="auth-hero panel">
        <span className="eyebrow">Team Task Manager</span>
        <h1>{title}</h1>
        <p>
          A minimal project and task workspace with JWT auth, admin/member access, and a dashboard you can scan in seconds.
        </p>
        <div className="demo-box">
          <strong>Demo credentials</strong>
          {demoCredentials.map((item) => (
            <div key={item.label} className="demo-row">
              <span>{item.label}</span>
              <code>{item.email}</code>
              <code>{item.password}</code>
            </div>
          ))}
        </div>
      </section>

      <section className="auth-form panel">
        <form onSubmit={handleSubmit} className="stack">
          {isSignup && (
            <label>
              <span>Name</span>
              <input value={form.name} onChange={(event) => updateField('name', event.target.value)} placeholder="Ada Lovelace" required />
            </label>
          )}
          <label>
            <span>Email</span>
            <input type="email" value={form.email} onChange={(event) => updateField('email', event.target.value)} placeholder="you@example.com" required />
          </label>
          <label>
            <span>Password</span>
            <input type="password" value={form.password} onChange={(event) => updateField('password', event.target.value)} placeholder="********" required />
          </label>
          {error ? <div className="notice notice-error">{error}</div> : null}
          <button className="button button-primary" type="submit" disabled={submitting}>
            {submitting ? 'Please wait...' : isSignup ? 'Create account' : 'Sign in'}
          </button>
        </form>
        <div className="auth-footer">
          {isSignup ? (
            <Link to="/login">Already have an account? Sign in</Link>
          ) : (
            <Link to="/signup">Need an account? Sign up</Link>
          )}
        </div>
      </section>
    </div>
  );
}
