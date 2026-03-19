// apps/web/app/chip/page.tsx
 'use client';

import { useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { Search, Loader2, Dog, User, Phone } from 'lucide-react';

export default function ChipPage() {
  const [chip, setChip] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chip) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const { data } = await apiClient.get(`/pets/chip/${chip}`);
      setResult(data);
    } catch (err: any) {
      setError(err.response?.status === 404 ? 'No se encontró ninguna mascota con ese número de chip.' : 'Ocurrió un error al buscar. Intenta más tarde.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-green-50 pt-32 pb-20">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-block p-3 bg-green-100 rounded-2xl text-green-700 mb-4">
            <Search size={32} />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Localizador de Chip</h1>
          <p className="text-gray-600 text-lg">Ingresa el número de chip para identificar a la mascota y contactar a su dueño.</p>
        </div>

        <form onSubmit={handleSearch} className="mb-12">
          <div className="relative group">
            <input
              type="text"
              value={chip}
              onChange={(e) => setChip(e.target.value)}
              placeholder="Ej: CHIP-001"
              className="w-full p-6 pl-8 pr-32 rounded-3xl border-2 border-transparent bg-white shadow-xl focus:border-green-500 focus:outline-none text-xl transition-all"
            />
            <button
              disabled={loading}
              className="absolute right-3 top-3 bottom-3 bg-green-600 text-white px-8 rounded-2xl font-bold hover:bg-green-700 transition-all disabled:opacity-50 flex items-center"
            >
              {loading ? <Loader2 className="animate-spin" /> : 'Buscar'}
            </button>
          </div>
        </form>

        {error && (
          <div className="bg-red-50 text-red-700 p-6 rounded-3xl border border-red-100 text-center animate-shake">
            {error}
          </div>
        )}

        {result && (
          <div className="bg-white rounded-[40px] p-8 lg:p-12 shadow-2xl border border-green-100 animate-slideUp">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 pb-4 border-b">Resultado de la búsqueda</h2>
            <div className="grid md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 shrink-0">
                    <Dog size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Mascota</p>
                    <p className="text-xl font-bold text-gray-900">{result.name}</p>
                    <p className="text-gray-600">{result.species} • {result.breed}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 shrink-0">
                    <User size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Dueño</p>
                    <p className="text-xl font-bold text-gray-900">{result.owner}</p>
                    <div className="flex items-center gap-2 text-gray-600 mt-1">
                      <Phone size={16} />
                      <span>{result.phone}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-10 p-4 bg-gray-50 rounded-2xl text-sm text-gray-500 text-center">
              Por seguridad, algunos datos han sido parcialmente ocultos.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
