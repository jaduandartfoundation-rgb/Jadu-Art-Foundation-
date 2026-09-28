import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/api';
import { Lock, Mail, ShieldAlert } from 'lucide-react';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await authService.login({ email, password });
      if (res.data.success) {
        localStorage.setItem('adminToken', res.data.data.token);
        localStorage.setItem('adminUser', JSON.stringify(res.data.data));
        navigate('/admin/dashboard');
      } else {
        setError(res.data.message || 'Login failed');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary-navy flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-2xl space-y-6 border-4 border-primary-saffron">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-primary-navy text-white rounded-2xl flex items-center justify-center mx-auto font-black text-xl">
            J
          </div>
          <h2 className="text-2xl font-black text-primary-navy">Jadu & Art Admin Portal</h2>
          <p className="text-xs text-gray-500">Sign in to manage foundation operations</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-3.5 rounded-xl text-xs font-medium border border-red-200 flex items-center space-x-2">
            <ShieldAlert size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
                <Mail size={16} />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@jaduart.org"
                className="w-full pl-10 pr-3.5 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-navy font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
                <Lock size={16} />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3.5 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-navy font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-primary-saffron text-white py-3.5 rounded-xl font-bold text-sm shadow-md hover:bg-orange-600 transition-colors ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Authenticating...' : 'SIGN IN TO DASHBOARD'}
          </button>
        </form>

        <div className="text-center text-[11px] text-gray-400">
          Default seed credentials: <code className="text-primary-navy font-bold">admin@jaduart.org</code> / <code className="text-primary-navy font-bold">admin123</code>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
