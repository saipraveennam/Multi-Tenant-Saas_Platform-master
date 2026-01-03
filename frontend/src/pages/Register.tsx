import { useState } from 'react';
import { registerTenant } from '../api/auth';
import { Link, useNavigate } from 'react-router-dom';

export default function Register() {
  const [form, setForm] = useState({
    organizationName: '',
    subdomain: '',
    adminEmail: '',
    adminFullName: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!agree) {
      setError('You must agree to Terms & Conditions');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    const res = await registerTenant(form);
    setLoading(false);

    if (!res.success) {
      setError(res.message || 'Registration failed');
      return;
    }

    setSuccess('Tenant registered successfully! Redirecting to login...');
    setTimeout(() => navigate('/login'), 1500);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">

        <h2 className="text-2xl font-bold text-center mb-6">
          Register Tenant
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            name="organizationName"
            placeholder="Organization Name"
            onChange={handleChange}
            required
            className="w-full border px-4 py-2 rounded-lg"
          />

          <div>
            <input
              name="subdomain"
              placeholder="Subdomain"
              onChange={handleChange}
              required
              className="w-full border px-4 py-2 rounded-lg"
            />
            {form.subdomain && (
              <p className="text-xs text-gray-500 mt-1">
                Preview: <b>{form.subdomain}.yourapp.com</b>
              </p>
            )}
          </div>

          <input
            name="adminEmail"
            type="email"
            placeholder="Admin Email"
            onChange={handleChange}
            required
            className="w-full border px-4 py-2 rounded-lg"
          />

          <input
            name="adminFullName"
            placeholder="Admin Full Name"
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
            name="confirmPassword"
            type={showPassword ? 'text' : 'password'}
            placeholder="Confirm Password"
            onChange={handleChange}
            required
            className="w-full border px-4 py-2 rounded-lg"
          />

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={agree}
              onChange={() => setAgree(!agree)}
            />
            I agree to Terms & Conditions
          </label>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg text-white font-medium
              ${loading ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'}
            `}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        {error && <p className="text-red-600 text-sm mt-4">{error}</p>}
        {success && <p className="text-green-600 text-sm mt-4">{success}</p>}

        <p className="text-center text-sm mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-600 font-medium">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
