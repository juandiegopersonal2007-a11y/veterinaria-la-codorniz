// apps/web/app/chip/page.tsx
 'use client';

import { useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { Loader2, Dog, User, Phone } from 'lucide-react';
import { toast } from 'sonner';

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '523131163103';

// Mensajes que van rotando mientras "carga" — hace que parezca que está haciendo algo
const LOADING_MESSAGES = [
  'Conectando con la base de datos...',
  'Verificando registros de chips...',
  'Buscando expediente de la mascota...',
  'Consultando datos del propietario...',
  'Verificando protocolos de seguridad...',
];

export default function ChipPage() {
  const [chip, setChip] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState(LOADING_MESSAGES[0]);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chip) return;

    setLoading(true);
    setError('');
    setResult(null);

    // Rotar mensajes cada 1.5s para dar sensación de trabajo activo
    let msgIndex = 0;
    setLoadingMsg(LOADING_MESSAGES[0]);
    const msgInterval = setInterval(() => {
      msgIndex = (msgIndex + 1) % LOADING_MESSAGES.length;
      setLoadingMsg(LOADING_MESSAGES[msgIndex]);
    }, 1500);

    // Mínimo 8 segundos de "carga" — cubre el wake-up de Render
    const [data] = await Promise.allSettled([
      apiClient.get(`/pets/chip/${chip}`),
      new Promise(resolve => setTimeout(resolve, 8000)),
    ]);

    clearInterval(msgInterval);
    setLoading(false);

    if (data.status === 'fulfilled') {
      setResult((data as PromiseFulfilledResult<any>).value.data);
    } else {
      const err = (data as PromiseRejectedResult).reason;
      const errorMessage = err.response?.data?.error ||
        (err.response?.status === 404
          ? 'No se encontró ninguna mascota con ese número de chip.'
          : 'Ocurrió un error al buscar. Intenta más tarde.');
      setError(errorMessage);
      toast.error('Búsqueda fallida', { description: errorMessage });
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pt-40 pb-32">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 bg-[#b47d2b]/10 text-[#b47d2b] px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase mb-6 border border-[#b47d2b]/20">
            🛡️ Seguridad & Identificación 🛡️
          </div>
          <h1 className="text-5xl lg:text-7xl font-extrabold text-[#064e3b] mb-6 tracking-tight">Localizador de Mascotas</h1>
          <p className="text-slate-500 text-xl leading-relaxed">Ingresa el número de chip para identificar a la mascota y contactar a su dueño.</p>
        </div>

        <form onSubmit={handleSearch} className="mb-16">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#ffb700] to-[#064e3b] rounded-[30px] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative flex items-center">
              <input
                type="text"
                value={chip}
                onChange={(e) => setChip(e.target.value)}
                placeholder="Ej: CHIP-001"
                disabled={loading}
                className="w-full p-8 pl-10 pr-40 rounded-[28px] bg-white shadow-premium focus:outline-none text-2xl font-bold text-[#064e3b] transition-all disabled:opacity-60"
              />
              <button
                disabled={loading}
                className="absolute right-3 bg-[#064e3b] text-[#ffb700] h-[calc(100%-24px)] px-10 rounded-2xl font-black text-lg hover:bg-[#053e2f] transition-all disabled:opacity-50 flex items-center shadow-gold"
              >
                {loading ? <Loader2 className="animate-spin" size={22} /> : 'RASTREAR'}
              </button>
            </div>
          </div>

          {/* Loading state — mensajes rotativos mientras el servidor despierta */}
          {loading && (
            <div className="mt-8 flex flex-col items-center gap-4 animate-fade-in-up">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-[#064e3b] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-3 h-3 bg-[#b47d2b] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-3 h-3 bg-[#064e3b] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <p className="text-[#064e3b] font-bold text-base tracking-wide transition-all duration-500">
                {loadingMsg}
              </p>
              <p className="text-slate-400 text-xs font-medium">
                Esto puede tomar unos segundos
              </p>
            </div>
          )}
        </form>

        {error && (
          <div className="bg-red-50 text-red-700 p-8 rounded-[32px] border border-red-100 text-center font-bold animate-shake shadow-xl mb-8">
            {error}
          </div>
        )}

        {/* WhatsApp fallback — always visible below search */}
        {!result && (
          <div className="flex flex-col items-center gap-4 text-center mt-4">
            <p className="text-slate-400 font-semibold text-sm">
              Para más información consultar por vía WhatsApp
            </p>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hola, necesito información sobre el buscador de chips de mascotas.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-[#25D366] hover:bg-[#20b858] text-white font-black text-base px-6 py-3 rounded-2xl shadow-md transition-all hover:scale-105"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Consultar por WhatsApp
            </a>
          </div>
        )}

        {result && (
          <div className="bg-white rounded-[48px] p-10 lg:p-16 shadow-2xl border border-slate-50 animate-slideUp relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#ffb700]/10 rounded-bl-[100px]"></div>
            <h2 className="text-3xl font-black text-[#064e3b] mb-12 pb-6 border-b border-slate-50">Expediente de Identificación</h2>
            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div className="flex gap-6">
                  <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-[#064e3b] shadow-inner shrink-0">
                    <Dog size={32} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-[#b47d2b] uppercase tracking-[0.2em] mb-2">Identidad Mascota</p>
                    <p className="text-3xl font-black text-[#064e3b] leading-tight">{result.name}</p>
                    <p className="text-slate-500 font-bold mt-1 text-lg">{result.species} • {result.breed}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-8">
                <div className="flex gap-6">
                  <div className="w-16 h-16 bg-[#ffb700]/10 rounded-2xl flex items-center justify-center text-[#b47d2b] shadow-inner shrink-0">
                    <User size={32} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-[#b47d2b] uppercase tracking-[0.2em] mb-2">Contacto Propietario</p>
                    <p className="text-3xl font-black text-[#064e3b] leading-tight">{result.owner}</p>
                    <div className="flex items-center gap-3 text-slate-500 font-bold mt-2 text-lg">
                      <Phone size={20} className="text-[#b47d2b]" />
                      <span>{result.phone}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-12 p-6 bg-slate-50 rounded-3xl text-xs text-slate-400 text-center font-bold tracking-wide">
              PROTOCOLOS DE SEGURIDAD ACTIVOS • DATOS PROTEGIDOS POR LEY
            </div>

            {/* WhatsApp CTA */}
            <div className="mt-8 flex flex-col items-center gap-4 text-center">
              <p className="text-slate-500 font-semibold text-base">
                Para más información consultar por vía WhatsApp
              </p>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hola, encontré una mascota con chip #${chip} y necesito más información.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-[#25D366] hover:bg-[#20b858] text-white font-black text-lg px-8 py-4 rounded-2xl shadow-lg transition-all hover:scale-105 active:scale-95"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Consultar por WhatsApp
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
