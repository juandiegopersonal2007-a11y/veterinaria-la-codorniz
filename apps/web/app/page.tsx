'use client';

import { ArrowRight, CheckCircle2, MapPin, Phone, Mail, Clock, ShieldCheck, Heart, Star, Activity, Stethoscope, Scissors, Syringe } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 bg-[#fdfcfb] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="max-w-2xl animate-fade-in-up">
              <div className="inline-flex items-center gap-2 bg-[#ffb700]/10 text-[#ffb700] px-4 py-2 rounded-full text-xs font-black tracking-[0.2em] uppercase mb-8 border border-[#ffb700]/20 shadow-sm">
                <Star size={14} fill="currentColor" />
                Excelencia Veterinaria en Tecomán
              </div>
              <h1 className="text-6xl lg:text-8xl font-black text-[#064e3b] leading-[0.9] mb-8 tracking-tighter">
                Cuidamos a tu mascota <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#b47d2b] to-[#e9c46a]">como familia</span>
              </h1>
              <p className="text-xl text-slate-500 mb-12 leading-relaxed font-medium max-w-xl">
                En <span className="text-[#064e3b] font-bold">La Codorniz</span> fusionamos medicina de vanguardia con un trato humano excepcional.
              </p>
              <div className="flex flex-col sm:flex-row gap-6">
                <Link href="/contacto">
                  <button className="h-16 px-10 rounded-2xl bg-[#064e3b] hover:bg-[#053e2f] text-white text-lg font-black shadow-2xl shadow-emerald-900/20 transition-all hover:scale-105 active:scale-95 group flex items-center justify-center">
                    AGENDAR CITA
                    <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" size={22} />
                  </button>
                </Link>
                <Link href="/servicios">
                  <button className="h-16 px-10 rounded-2xl border-2 border-[#064e3b] text-[#064e3b] text-lg font-black hover:bg-emerald-50 transition-all flex items-center justify-center">
                    VER SERVICIOS
                  </button>
                </Link>
              </div>
            </div>
            <div className="relative animate-fade-in-right">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#ffb700] to-[#064e3b] rounded-[60px] blur-2xl opacity-10 animate-pulse"></div>
              <div className="relative bg-white p-4 rounded-[56px] shadow-2xl border border-slate-50 overflow-hidden group">
                <video 
                  src="/presentacion.mp4" 
                  autoPlay 
                  loop 
                  muted 
                  playsInline
                  className="w-full h-auto rounded-[42px] object-cover transform group-hover:scale-105 transition-transform duration-1000"
                />
                <div className="absolute bottom-8 left-8 right-8 bg-white/90 backdrop-blur-md p-6 rounded-3xl border border-white/50 shadow-xl">
                  <div className="flex items-center gap-4">
                    <div className="flex -space-x-3">
                      {[1,2,3].map(i => (
                        <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-emerald-100 flex items-center justify-center text-[10px] font-bold text-[#064e3b]">
                          {String.fromCharCode(64 + i)}
                        </div>
                      ))}
                    </div>
                    <div>
                      <p className="text-xs font-black text-[#064e3b] uppercase tracking-widest">+500 Clientes Satisfechos</p>
                      <p className="text-[10px] text-slate-500 font-bold">Confían en nuestra excelencia</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[800px] h-[800px] bg-emerald-50/50 rounded-full blur-[120px] -z-10"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[500px] h-[500px] bg-[#ffb700]/5 rounded-full blur-[100px] -z-10"></div>
      </section>

      <section className="py-32 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 relative z-10">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div className="order-2 lg:order-1 relative animate-fade-in-right">
              <div className="absolute -inset-8 bg-emerald-50 rounded-[64px] blur-2xl -z-10"></div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-6 pt-12">
                  <div className="bg-white p-8 rounded-[40px] shadow-premium border border-slate-50 transform hover:-translate-y-2 transition-all duration-500">
                    <div className="w-14 h-14 bg-emerald-900 text-[#ffb700] rounded-2xl flex items-center justify-center mb-6 shadow-gold">
                      <CheckCircle2 size={28} />
                    </div>
                    <h4 className="text-xl font-black text-[#064e3b] mb-2 tracking-tight">Médicos Expertos</h4>
                    <p className="text-sm text-slate-500 font-medium">Contamos con especialistas certificados.</p>
                  </div>
                  <div className="bg-[#064e3b] p-8 rounded-[40px] shadow-2xl transform hover:-translate-y-2 transition-all duration-500">
                    <div className="w-14 h-14 bg-[#ffb700]/20 text-[#ffb700] rounded-2xl flex items-center justify-center mb-6 border border-[#ffb700]/20">
                      <Clock size={28} />
                    </div>
                    <h4 className="text-xl font-black text-white mb-2 tracking-tight">Atención 24/7</h4>
                    <p className="text-sm text-emerald-100/60 font-medium">Protocolos de urgencia inmediata.</p>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="bg-emerald-50 p-8 rounded-[40px] shadow-inner border border-emerald-100 transform hover:-translate-y-2 transition-all duration-500">
                    <div className="w-14 h-14 bg-white text-emerald-700 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                      <MapPin size={28} />
                    </div>
                    <h4 className="text-xl font-black text-[#064e3b] mb-2 tracking-tight">Tecnología Top</h4>
                    <p className="text-sm text-slate-500 font-medium">Equipamiento médico de última generación.</p>
                  </div>
                  <div className="bg-white p-8 rounded-[40px] shadow-premium border border-slate-50 transform hover:-translate-y-2 transition-all duration-500">
                    <div className="w-14 h-14 bg-[#ffb700] text-[#064e3b] rounded-2xl flex items-center justify-center mb-6 shadow-gold">
                      <Mail size={28} />
                    </div>
                    <h4 className="text-xl font-black text-[#064e3b] mb-2 tracking-tight">Trato Humano</h4>
                    <p className="text-sm text-slate-500 font-medium">Tu mascota es nuestra familia.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2 animate-fade-in-up">
              <div className="inline-flex items-center gap-2 bg-[#b47d2b]/10 text-[#b47d2b] px-4 py-2 rounded-full text-xs font-black tracking-widest uppercase mb-6 border border-[#b47d2b]/20">
                ⭐ Nuestra Misión de Excelencia ⭐
              </div>
              <h2 className="text-5xl lg:text-7xl font-black text-[#064e3b] mb-8 tracking-tighter leading-none">
                Donde la salud y el amor <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#b47d2b] to-[#e9c46a]">se encuentran</span>
              </h2>
              <p className="text-xl text-slate-500 mb-10 leading-relaxed font-medium">
                En La Codorniz no solo tratamos síntomas, cuidamos vidas. Nuestra clínica en Tecomán se distingue por ofrecer un ambiente profesional y cálido.
              </p>
              <ul className="space-y-6 mb-12">
                {[
                  'Consulta General y especialidades',
                  'Estética Canina y Baños Médicos',
                  'Vacunación y Desparasitación',
                  'Cirugías menores y programadas',
                  'Urgencias y emergencias',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-4 text-[#064e3b] font-bold text-lg group">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center group-hover:bg-[#ffb700] transition-colors">
                      <CheckCircle2 size={14} className="group-hover:text-[#064e3b]" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/servicios">
                <button className="text-[#064e3b] font-black text-lg p-0 hover:bg-transparent hover:text-[#b47d2b] transition-all flex items-center gap-2 group">
                  Explorar catálogo completo <ArrowRight size={22} className="group-hover:translate-x-2 transition-transform" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-32 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 text-center mb-20 animate-fade-in-up">
          <h2 className="text-4xl lg:text-6xl font-black text-[#064e3b] mb-6 tracking-tighter">Servicios Destacados</h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-xl font-medium">Ofrecemos todo lo que tu mascota necesita para una vida saludable y feliz.</p>
        </div>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 grid md:grid-cols-3 gap-10">
          {[
            { title: 'Consulta General', icon: Stethoscope, desc: 'Evaluación profesional completa para prevenir y tratar enfermedades.' },
            { title: 'Estética y Baño', icon: Scissors, desc: 'Cuidado profesional para que tu mascota luzca y se sienta increíble.' },
            { title: 'Vacunación', icon: Syringe, desc: 'Protección esencial con esquemas completos para todas las edades.' }
          ].map((s, i) => (
            <div
              key={s.title}
              className="p-10 rounded-[40px] bg-white border border-slate-100 transition-all hover:shadow-2xl hover:-translate-y-2 group shadow-premium"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="w-16 h-16 bg-emerald-50 text-[#064e3b] rounded-2xl flex items-center justify-center mb-8 transform group-hover:scale-110 transition-transform group-hover:bg-[#ffb700] group-hover:text-white shadow-sm">
                <s.icon size={32} />
              </div>
              <h3 className="text-2xl font-black text-[#064e3b] mb-4 tracking-tight">{s.title}</h3>
              <p className="text-slate-500 leading-relaxed font-medium">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div className="animate-fade-in-right">
              <h2 className="text-5xl lg:text-7xl font-black text-[#064e3b] mb-12 tracking-tighter leading-none">¿Por qué elegirnos?</h2>
              <div className="space-y-10">
                {[
                  { t: 'Equipo Experto', d: 'Veterinarios titulados con pasión por los animales y años de experiencia.', icon: ShieldCheck },
                  { t: 'Atención Personalizada', d: 'Cada mascota es única y recibe un trato adaptado a sus necesidades.', icon: Heart },
                  { t: 'Tecnología Moderna', d: 'Equipamiento de vanguardia para diagnósticos precisos y rápidos.', icon: Activity }
                ].map((item) => (
                  <div key={item.t} className="flex gap-6 group">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-[#064e3b] group-hover:bg-[#ffb700] transition-colors shrink-0">
                      <item.icon size={24} />
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-[#064e3b] mb-2 tracking-tight">{item.t}</h4>
                      <p className="text-slate-500 font-medium leading-relaxed">{item.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative animate-fade-in-up">
              <div className="absolute -inset-4 bg-gradient-to-tr from-[#ffb700]/20 to-emerald-100/20 rounded-[56px] blur-2xl -z-10"></div>
              <div className="bg-white p-4 rounded-[56px] shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-700 overflow-hidden">
                <img src="/vet_hero.png" alt="Clínica Veterinaria" className="rounded-[42px] object-cover w-full h-full" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
