import { HelpCircle, MessageCircle, Phone, Mail, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const faqs = [
  {
    q: '¿Cómo agendo una cita?',
    a: 'Puedes agendar una cita directamente desde nuestra página de contacto o llamando a nuestra línea de atención 313 116 3103.'
  },
  {
    q: '¿Qué servicios ofrecen en urgencias?',
    a: 'Contamos con personal de guardia 24/7 para emergencias críticas, cirugías de urgencia y estabilización.'
  },
  {
    q: '¿Tienen planes de salud preventivos?',
    a: 'Sí, ofrecemos membresías de salud que incluyen vacunas, desparasitaciones y consultas preventivas anuales.'
  },
  {
    q: '¿Aceptan transferencias bancarias?',
    a: 'Sí, aceptamos transferencias bancarias. Puedes consultarnos por WhatsApp para recibir los datos de la cuenta.'
  }
];

export default function AyudaPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] pt-40 pb-32">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-24 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 bg-[#ffb700]/10 text-[#ffb700] px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase mb-6 border border-[#ffb700]/20">
            <HelpCircle size={14} />
            Centro de Asistencia
          </div>
          <h1 className="text-5xl lg:text-7xl font-extrabold text-[#064e3b] mb-6 tracking-tight">¿Cómo podemos ayudarte?</h1>
          <p className="text-slate-500 max-w-2xl mx-auto text-xl leading-relaxed font-medium">
            Encuentra respuestas rápidas o contacta con nuestro equipo para asistencia personalizada.
          </p>
        </div>

        <div className="space-y-6 mb-24">
          {faqs.map((faq, i) => (
            <div 
              key={i} 
              className="bg-white rounded-[40px] p-8 shadow-premium border border-slate-50 hover:border-[#ffb700]/30 transition-all duration-300 group"
            >
              <h3 className="text-xl font-black text-[#064e3b] mb-3 flex items-center justify-between">
                {faq.q}
                <ChevronRight size={20} className="text-[#ffb700] group-hover:translate-x-2 transition-transform" />
              </h3>
              <p className="text-slate-500 leading-relaxed font-medium">{faq.a}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-[#064e3b] text-white p-10 rounded-[40px] shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#ffb700]/10 rounded-bl-full"></div>
            <MessageCircle size={40} className="text-[#ffb700] mb-6" />
            <h3 className="text-2xl font-black mb-2">WhatsApp de Atención</h3>
            <p className="text-emerald-100/70 mb-8 font-medium">Asistencia inmediata para nuestros miembros.</p>
            <a 
              href="https://wa.me/523131163103" 
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[#ffb700] font-black hover:gap-4 transition-all"
            >
              Iniciar Chat <ChevronRight size={20} />
            </a>
          </div>
          <div className="bg-white p-10 rounded-[40px] shadow-premium border border-slate-100 group">
            <Phone size={40} className="text-[#064e3b] mb-6" />
            <h3 className="text-2xl font-black text-[#064e3b] mb-2">Línea de Soporte</h3>
            <p className="text-slate-400 mb-8 font-medium">Atención telefónica personalizada 24/7.</p>
            <a 
              href="tel:+523131163103" 
              className="inline-flex items-center gap-2 text-[#064e3b] font-black hover:gap-4 transition-all"
            >
              Llamar ahora <ChevronRight size={20} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}