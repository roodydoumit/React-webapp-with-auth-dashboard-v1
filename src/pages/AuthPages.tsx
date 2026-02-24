import { useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../services/mockApi';
import { useAuth } from '../components/AuthContext';
import type { Role } from '../types';

const Shell = ({ title, children }: { title: string; children: ReactNode }) => (
  <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100">
    <div className="mx-auto max-w-5xl">
      <Link className="text-cyan-300 hover:underline" to="/">
        ← Back to Home
      </Link>
      <div className="mt-4 grid overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl lg:grid-cols-2">
        <div className="bg-gradient-to-b from-cyan-700 to-indigo-800 p-8">
          <h1 className="text-3xl font-black">{title}</h1>
          <p className="mt-3 text-cyan-100">Secure freight operations portal for XOLOG sal teams and customers.</p>
        </div>
        <div className="p-8">{children}</div>
      </div>
    </div>
  </main>
);

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState('');

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    try {
      const user = await authApi.login(String(data.get('email')), String(data.get('password')));
      login(user);
      navigate('/dashboard');
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <Shell title="Secure Login">
      <form className="space-y-3" onSubmit={onSubmit}>
        <input className="w-full rounded bg-slate-800 p-3" name="email" placeholder="Email" required />
        <input className="w-full rounded bg-slate-800 p-3" name="password" placeholder="Password" required type="password" />
        {error && <p className="text-sm text-rose-400">{error}</p>}
        <button className="w-full rounded bg-cyan-500 p-3 font-bold text-slate-900">Login</button>
      </form>
      <div className="mt-4 flex justify-between text-sm text-cyan-300">
        <Link to="/forgot-password">Forgot password?</Link>
        <Link to="/register">Create account</Link>
      </div>
    </Shell>
  );
};

export const RegisterPage = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const user = await authApi.register(String(data.get('name')), String(data.get('email')), data.get('role') as Role);
    setMessage(`Account created for ${user.name}. Continue to login.`);
    event.currentTarget.reset();
  };

  return (
    <Shell title="Register Account">
      <form className="space-y-3" onSubmit={onSubmit}>
        <input className="w-full rounded bg-slate-800 p-3" name="name" placeholder="Full name" required />
        <input className="w-full rounded bg-slate-800 p-3" name="email" placeholder="Email" required type="email" />
        <select className="w-full rounded bg-slate-800 p-3" defaultValue="customer" name="role">
          <option value="customer">Customer</option>
          <option value="operator">Operator</option>
          <option value="admin">Admin</option>
        </select>
        <button className="w-full rounded bg-cyan-500 p-3 font-bold text-slate-900">Register</button>
      </form>
      {message && <p className="mt-3 text-sm text-emerald-300">{message}</p>}
      <button className="mt-4 text-sm text-cyan-300" onClick={() => navigate('/login')} type="button">
        Already have an account? Login
      </button>
    </Shell>
  );
};

export const ForgotPasswordPage = () => {
  const [message, setMessage] = useState('');

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const response = await authApi.forgotPassword(String(data.get('email')));
    setMessage(response.message);
  };

  return (
    <Shell title="Forgot Password">
      <form className="space-y-3" onSubmit={onSubmit}>
        <input className="w-full rounded bg-slate-800 p-3" name="email" placeholder="Email" required type="email" />
        <button className="w-full rounded bg-cyan-500 p-3 font-bold text-slate-900">Send reset link</button>
      </form>
      {message && <p className="mt-3 text-sm text-emerald-300">{message}</p>}
      <Link className="mt-4 inline-block text-sm text-cyan-300" to="/login">
        Back to Login
      </Link>
    </Shell>
  );
};
