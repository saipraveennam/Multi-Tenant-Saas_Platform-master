import { useState } from 'react';
import { loginUser } from '../api/auth';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [form, setForm] = useState({
    email: '',
    password: '',
    tenantSubdomain: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    setLoading(true);
    const res = await loginUser(form);
    setLoading(false);

    if (!res.success) {
      setError(res.message || 'Login failed');
      return;
    }

    // Store token (remember me optional)
    if (rememberMe) {
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
    } else {
      sessionStorage.setItem('token', res.data.token);
      sessionStorage.setItem('user', JSON.stringify(res.data.user));
    }

    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">

        <h2 className="text-2xl font-bold text-center mb-6">
          Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            required
            className="w-full border px-4 py-2 rounded-lg"
          />

          <div className="relative">
            <input
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              onChange={handleChange}
              required
              className="w-full border px-4 py-2 rounded-lg"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2 text-sm text-indigo-600"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          <input
            name="tenantSubdomain"
            placeholder="Tenant Subdomain"
            onChange={handleChange}
            required
            className="w-full border px-4 py-2 rounded-lg"
          />

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
            />
            Remember me
          </label>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg text-white font-medium
              ${loading ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'}
            `}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {error && <p className="text-red-600 text-sm mt-4">{error}</p>}

        <p className="text-center text-sm mt-6">
          New here?{' '}
          <Link to="/register" className="text-indigo-600 font-medium">
            Create new tenant
          </Link>
        </p>
      </div>
    </div>
  );
}
