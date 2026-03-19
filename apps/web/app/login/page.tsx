// apps/web/app/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { Lock, Mail, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data } = await apiClient.post('/auth/login', { email, password });
      localStorage.setItem('auth-token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      // Set cookie for middleware
      document.cookie = `auth-token=${data.token}; path=/; max-age=${8 * 60 * 60}`;
      router.push('/admin/dashboard');
    } catch (err: any) {
      setError('Credenciales incorrectas. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-green-700 mb-2">La Codorniz</h1>
          <p className="text-gray-500 font-medium text-lg uppercase tracking-widest">Panel Administrativo</p>
        </div>

        <div className="bg-white p-10 rounded-[40px] shadow-2xl border border-gray-100">
          <form onSubmit={handleLogin} className="space-y-8">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-4">Email de acceso</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-5 pl-14 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-green-500 focus:bg-white focus:outline-none transition-all"
                  placeholder="ejemplo@correo.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-4">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-5 pl-14 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-green-500 focus:bg-white focus:outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && <p className="text-red-600 text-center font-semibold animate-shake">{error}</p>}

            <button
              disabled={loading}
              className="w-full bg-green-600 text-white p-5 rounded-2xl font-bold text-lg hover:bg-green-700 transition-all shadow-xl hover:shadow-green-200 flex items-center justify-center"
            >
              {loading ? <Loader2 className="animate-spin" /> : 'Ingresar al sistema'}
            </button>
          </form>
        </div>

        <p className="mt-8 text-center text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} Veterinaria La Codorniz. Solo personal autorizado.
        </p>
      </div>
    </div>
  );
}
