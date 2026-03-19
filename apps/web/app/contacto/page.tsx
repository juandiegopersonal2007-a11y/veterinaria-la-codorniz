// apps/web/app/contacto/page.tsx
 'use client';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  MessageCircle, 
  Facebook, 
  Instagram, 
  ArrowRight,
  ShieldCheck,
  Star,
  Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

export default function ContactoPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Header VIP */}
      <section className="relative pt-32 pb-20 bg-[#064e3b] text-white overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-[#b47d2b]/10 blur-[120px] rounded-full"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-[#b47d2b]/20 text-[#e9c46a] px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase mb-6 border border-[#b47d2b]/30">
            <Star size={14} fill="currentColor" />
            Servicio VIP & Profesional
            <Star size={14} fill="currentColor" />
          </div>
          <h1 className="text-5xl lg:text-7xl font-extrabold mb-6 tracking-tight">
            Atención <span className="text-[#e9c46a]">Exclusiva</span> para tu Mascota
          </h1>
          <p className="text-xl text-emerald-100/80 max-w-2xl mx-auto leading-relaxed">
            Estamos aquí para brindarte la tranquilidad que mereces. Contacta con nuestros especialistas de élite.
          </p>
        </div>
      </section>

      {/* Main Content Sections */}
      <div className="max-w-7xl mx-auto px-6 -mt-12 pb-32 space-y-24">
        
        {/* Section 1: Contact Methods */}
        <section id="metodos-contacto" className="grid lg:grid-cols-3 gap-8">
          {[
            { 
              title: 'Línea Directa', 
              info: '313 116 3103', 
              sub: 'Atención inmediata 24/7',
              icon: Phone, 
              color: 'bg-emerald-900',
              action: 'Llamar ahora'
            },
            { 
              title: 'Concierge Digital', 
              info: 'WhatsApp Business', 
              sub: 'Respuestas en < 5 min',
              icon: MessageCircle, 
              color: 'bg-[#b47d2b]',
              action: 'Enviar mensaje'
            },
            { 
              title: 'Soporte Email', 
              info: 'vip@lacodorniz.com', 
              sub: 'Consultas detalladas',
              icon: Mail, 
              color: 'bg-slate-900',
              action: 'Redactar correo'
            }
          ].map((item, i) => (
            <Card key={i} className="border-none shadow-2xl rounded-[32px] overflow-hidden group hover:-translate-y-2 transition-all duration-500">
              <CardContent className="p-10">
                <div className={`w-16 h-16 ${item.color} text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg group-hover:scale-110 transition-transform`}>
                  <item.icon size={32} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-lg font-semibold text-slate-600 mb-1">{item.info}</p>
                <p className="text-sm text-slate-400 mb-8">{item.sub}</p>
                <Button variant="ghost" className="p-0 text-emerald-700 font-bold hover:bg-transparent flex items-center gap-2 group-hover:gap-4 transition-all">
                  {item.action} <ArrowRight size={20} />
                </Button>
              </CardContent>
            </Card>
          ))}
        </section>

        {/* Section 2: Appointment & Map */}
        <section id="ubicacion-cita" className="grid lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-8">
            <div className="bg-white p-10 rounded-[40px] shadow-xl border border-slate-100">
              <h2 className="text-3xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                <Calendar className="text-[#b47d2b]" />
                Reserva tu Espacio
              </h2>
              <form className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <Input placeholder="Tu Nombre" className="h-14 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-emerald-800" />
                  <Input placeholder="Nombre de Mascota" className="h-14 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-emerald-800" />
                </div>
                <Input placeholder="Teléfono" className="h-14 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-emerald-800" />
                <select className="w-full h-14 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-emerald-800 px-4 text-slate-500 font-medium appearance-none">
                  <option>Servicio Requerido</option>
                  <option>Consulta de Especialidad</option>
                  <option>Cirugía Programada</option>
                  <option>Estética VIP</option>
                </select>
                <Button className="w-full h-16 rounded-2xl bg-[#064e3b] hover:bg-[#043327] text-white font-bold text-lg shadow-xl shadow-emerald-900/20 transition-all">
                  Solicitar Cita Prioritaria
                </Button>
              </form>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100">
                <Clock className="text-emerald-800 mb-4" size={28} />
                <h4 className="font-bold text-emerald-900 mb-1">Horario Elite</h4>
                <p className="text-sm text-emerald-700">Lun - Vie: 9am - 8pm</p>
                <p className="text-sm text-emerald-700">Sábados: 10am - 4pm</p>
              </div>
              <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100">
                <ShieldCheck className="text-amber-800 mb-4" size={28} />
                <h4 className="font-bold text-amber-900 mb-1">Urgencias 24h</h4>
                <p className="text-sm text-amber-700">Protocolo de respuesta inmediata para miembros.</p>
              </div>
            </div>
          </div>

          <div className="h-full min-h-[500px] bg-white rounded-[40px] shadow-2xl border-8 border-white overflow-hidden relative group">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3772.3664366601445!2d-103.8767396!3d18.9152342!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8424d55055555555%3A0x8888888888888888!2sTecom%C3%A1n%2C%20Colima!5e0!3m2!1ses-419!2smx!4v1700000000000!5m2!1ses-419!2smx" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={true} 
              loading="lazy" 
              className="grayscale-[0.5] group-hover:grayscale-0 transition-all duration-700"
            ></iframe>
            <div className="absolute bottom-8 left-8 right-8 bg-white/90 backdrop-blur-md p-6 rounded-3xl shadow-xl flex items-center gap-4">
              <div className="bg-[#064e3b] p-3 rounded-2xl text-white">
                <MapPin size={24} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900">Nuestra Clínica Central</h4>
                <p className="text-sm text-slate-500">Av. Insurgentes 450, Tecomán, Colima.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Social & Trust */}
        <section id="redes-sociales" className="text-center space-y-12">
          <div className="max-w-xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Síguenos en el Mundo Digital</h2>
            <p className="text-slate-500">Únete a nuestra comunidad exclusiva y mantente al tanto de consejos de salud de alto nivel.</p>
          </div>
          <div className="flex justify-center gap-8">
            {[
              { icon: Facebook, label: 'Facebook', href: '#', color: 'hover:text-blue-600' },
              { icon: Instagram, label: 'Instagram', href: '#', color: 'hover:text-pink-600' },
              { icon: MessageCircle, label: 'WhatsApp', href: '#', color: 'hover:text-green-600' }
            ].map((soc, i) => (
              <a key={i} href={soc.href} className={`flex flex-col items-center gap-3 text-slate-400 transition-all duration-300 hover:-translate-y-2 ${soc.color}`}>
                <div className="w-20 h-20 bg-white rounded-[24px] shadow-lg flex items-center justify-center border border-slate-100">
                  <soc.icon size={32} />
                </div>
                <span className="font-bold text-sm uppercase tracking-widest">{soc.label}</span>
              </a>
            ))}
          </div>
        </section>

      </div>

      {/* Footer Minimal VIP */}
      <footer className="bg-slate-900 py-12 text-center">
        <p className="text-slate-500 text-sm font-medium tracking-widest uppercase">
          Veterinaria La Codorniz &copy; {new Date().getFullYear()} — Excelencia Médica Veterinaria
        </p>
      </footer>
    </div>
  );
}
