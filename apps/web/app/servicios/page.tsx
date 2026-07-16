'use client';

import { Scissors, Stethoscope, Syringe, Bath, Activity, ShieldCheck, Search, HeartPulse, UserCheck } from 'lucide-react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';

const servicesData = [
  { name: 'Consulta General', desc: 'Evaluación profesional completa para tu mascota.', icon: Stethoscope },
  { name: 'Estética Canina', desc: 'Corte de pelo y limpieza profunda.', icon: Scissors },
  { name: 'Baño Médico', desc: 'Tratamientos para piel y pelaje.', icon: Bath },
  { name: 'Vacunación', desc: 'Protección contra las principales enfermedades.', icon: Syringe },
  { name: 'Cirugía Menor', desc: 'Procedimientos ambulatorios con anestesia.', icon: Activity },
  { name: 'Desparasitación', desc: 'Control interno y externo de parásitos.', icon: ShieldCheck },
  { name: 'Cirugías Programadas', desc: 'Procedimientos con anestesia controlada y recuperación supervisada.', icon: UserCheck },
  { name: 'Urgencias y Emergencias', desc: 'Atención rápida y soporte crítico para situaciones urgentes.', icon: HeartPulse },
];

export default function ServiciosPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredServices = servicesData.filter(service =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] pt-40 pb-32">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 bg-[#b47d2b]/10 text-[#b47d2b] px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase mb-6 border border-[#b47d2b]/20">
            ⭐ Nuestros Servicios ⭐
          </div>
          <h1 className="text-5xl lg:text-7xl font-extrabold text-[#064e3b] mb-6 tracking-tight">Nuestros Servicios</h1>
          <p className="text-slate-500 max-w-2xl mx-auto text-xl leading-relaxed mb-12">
            Cuidamos cada detalle para garantizar el bienestar de tus compañeros.
          </p>

          <div className="max-w-xl mx-auto relative">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="text-slate-400" size={24} />
            </div>
            <Input
              type="text"
              placeholder="Buscar servicio..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-14 h-16 rounded-2xl bg-white border border-slate-200 focus:ring-2 focus:ring-emerald-700 text-lg shadow-sm"
            />
            {searchQuery.length > 0 && filteredServices.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-2xl shadow-xl border border-slate-100 p-3 z-50">
                <p className="text-xs text-slate-400 px-4 py-2 font-bold uppercase tracking-widest">Sugerencias:</p>
                {filteredServices.map((service) => (
                  <div
                    key={service.name}
                    onClick={() => setSearchQuery(service.name)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-emerald-50 cursor-pointer transition-colors"
                  >
                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                      <service.icon size={16} className="text-[#064e3b]" />
                    </div>
                    <span className="font-bold text-[#064e3b]">{service.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {(searchQuery.length > 0 ? filteredServices : servicesData).map((s, i) => (
            <div
              key={s.name}
              className="bg-white rounded-[40px] p-10 shadow-premium border border-slate-50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="w-16 h-16 bg-[#064e3b] rounded-2xl flex items-center justify-center text-[#ffb700] mb-8 shadow-gold group-hover:scale-110 transition-transform duration-500">
                <s.icon size={32} />
              </div>
              <h3 className="text-2xl font-black text-[#064e3b] mb-4 tracking-tight">{s.name}</h3>
              <p className="text-slate-500 leading-relaxed font-medium">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
