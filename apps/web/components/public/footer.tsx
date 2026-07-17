import Link from 'next/link';
import { Dog, Facebook, MapPin, Phone } from 'lucide-react';

// TikTok no está en lucide-react — SVG oficial
function TikTokIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.17 8.17 0 004.78 1.52V6.75a4.85 4.85 0 01-1.01-.06z"/>
    </svg>
  );
}

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-slate-100 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center overflow-hidden shadow-sm border border-slate-100">
                <img 
                  src="/logoveterinaria.jpeg" 
                  alt="Logo Veterinaria La Codorniz" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="text-xl font-black text-[#064e3b] tracking-tighter block leading-none">LA CODORNIZ</span>
                <span className="text-[8px] font-bold text-[#b47d2b] tracking-[0.3em] uppercase">Tienda de Mascotas</span>
              </div>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed font-medium">
              Dedicados a brindar medicina veterinaria de excelencia con un trato humano y profesional en Tecomán, Colima.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://www.facebook.com/share/1986rTrtnu/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-[#1877F2] hover:text-white transition-all duration-300"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a
                href="https://www.tiktok.com/@granja_la_codorniz"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-black hover:text-white transition-all duration-300"
                aria-label="TikTok"
              >
                <TikTokIcon size={18} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-[#064e3b] font-black text-sm uppercase tracking-widest mb-8">Navegación</h4>
            <ul className="space-y-4">
              {['Inicio', 'Servicios', 'Buscador Chip', 'Contacto', 'Ayuda'].map((item) => (
                <li key={item}>
                  <Link 
                    href={item === 'Inicio' ? '/' : `/${item.toLowerCase().replace(' ', '-')}`}
                    className="text-slate-500 hover:text-[#064e3b] text-sm font-bold transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[#064e3b] font-black text-sm uppercase tracking-widest mb-8">Servicios</h4>
            <ul className="space-y-4">
              {['Consulta General', 'Estética Canina', 'Vacunación', 'Cirugía Menor', 'Laboratorio'].map((item) => (
                <li key={item}>
                  <span className="text-slate-500 text-sm font-bold">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[#064e3b] font-black text-sm uppercase tracking-widest mb-8">Contacto</h4>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-[#064e3b] shrink-0">
                  <MapPin size={16} />
                </div>
                <span className="text-slate-500 text-sm font-medium leading-relaxed">
                  Calle Abasolo 399, 28100 Tecomán, Colima.
                </span>
              </li>
              <li className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-[#064e3b] shrink-0">
                  <Phone size={16} />
                </div>
                <span className="text-slate-500 text-sm font-bold">313 116 3103</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
            © {currentYear} Veterinaria La Codorniz. Todos los derechos reservados.
          </p>
          <div className="flex gap-8 items-center">
            <Link href="/privacidad" className="text-slate-400 hover:text-[#064e3b] text-xs font-bold uppercase tracking-widest transition-colors">
              Privacidad
            </Link>
            <Link href="/login" className="text-slate-300 hover:text-slate-500 text-xs font-bold transition-colors">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
