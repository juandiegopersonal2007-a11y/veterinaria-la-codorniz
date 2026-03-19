// apps/web/app/page.tsx
import { ArrowRight, CheckCircle2, MapPin, Phone, Mail, Clock } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <nav className="fixed w-full z-40 bg-white/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-green-700">La Codorniz</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-sm font-medium hover:text-green-600 transition">Inicio</Link>
              <Link href="/servicios" className="text-sm font-medium hover:text-green-600 transition">Servicios</Link>
              <Link href="/chip" className="text-sm font-medium hover:text-green-600 transition">Buscador Chip</Link>
              <Link href="/contacto" className="text-sm font-medium hover:text-green-600 transition">Contacto</Link>
              <Link href="/ayuda" className="text-sm font-medium hover:text-green-600 transition">Ayuda</Link>
              <Link href="/admin/dashboard" className="bg-green-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-green-700 transition">Panel Admin</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 bg-green-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 leading-tight mb-6">
              Cuidamos a tu mascota <span className="text-green-600">como familia</span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 leading-relaxed">
              En Veterinaria La Codorniz brindamos atención médica de alta calidad, estética y bienestar integral para tus mejores amigos en Tecomán.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/contacto" className="flex items-center justify-center bg-orange-500 text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-orange-600 transition-all shadow-lg hover:shadow-orange-200">
                Agendar cita
                <ArrowRight className="ml-2" size={20} />
              </Link>
              <Link href="/servicios" className="flex items-center justify-center bg-white text-green-700 border-2 border-green-600 px-8 py-4 rounded-full text-lg font-bold hover:bg-green-50 transition-all">
                Nuestros servicios
              </Link>
            </div>
          </div>
        </div>
        {/* Background decorative element */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-green-200/20 rounded-full blur-3xl"></div>
      </section>

      {/* Services Highlights */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4">Servicios Destacados</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Ofrecemos todo lo que tu mascota necesita para una vida saludable y feliz.</p>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-3 gap-8">
          {[
            { title: 'Consulta General', icon: '🩺', desc: 'Evaluación profesional completa para prevenir y tratar enfermedades.' },
            { title: 'Estética y Baño', icon: '✂️', desc: 'Cuidado profesional para que tu mascota luzca y se sienta increíble.' },
            { title: 'Vacunación', icon: '💉', desc: 'Protección esencial con esquemas completos para todas las edades.' }
          ].map((s) => (
            <div key={s.title} className="p-8 rounded-3xl bg-green-50/50 border border-green-100 transition-all hover:shadow-xl hover:-translate-y-1">
              <span className="text-4xl mb-6 block">{s.icon}</span>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{s.title}</h3>
              <p className="text-gray-600 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-8">¿Por qué elegirnos?</h2>
              <div className="space-y-6">
                {[
                  { t: 'Equipo Experto', d: 'Veterinarios titulados con pasión por los animales y años de experiencia.' },
                  { t: 'Atención Personalizada', d: 'Cada mascota es única y recibe un trato adaptado a sus necesidades.' },
                  { t: 'Tecnología Moderna', d: 'Equipamiento de vanguardia para diagnósticos precisos y rápidos.' }
                ].map((item) => (
                  <div key={item.t} className="flex gap-4">
                    <CheckCircle2 className="text-green-600 shrink-0" size={28} />
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 mb-1">{item.t}</h4>
                      <p className="text-gray-600">{item.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white p-4 rounded-[40px] shadow-2xl rotate-3">
              <img src="https://images.unsplash.com/photo-1584132967334-10e028bd69f7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" alt="Veterinaria" className="rounded-[30px]" />
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-[40px] overflow-hidden shadow-xl border h-[450px]">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3772.3664366601445!2d-103.8767396!3d18.9152342!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8424d55055555555%3A0x8888888888888888!2sTecom%C3%A1n%2C%20Colima!5e0!3m2!1ses-419!2smx!4v1700000000000!5m2!1ses-419!2smx" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-2">
            <span className="text-3xl font-bold text-green-500 mb-6 block">La Codorniz</span>
            <p className="text-gray-400 max-w-sm leading-relaxed">
              Comprometidos con la salud y bienestar de tus mascotas. Servicio profesional, ético y humano en el corazón de Tecomán.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-6">Contacto</h4>
            <ul className="space-y-4 text-gray-400">
              <li className="flex items-center gap-3"><MapPin size={18} /> Tecomán, Colima, MX</li>
              <li className="flex items-center gap-3"><Phone size={18} /> 313 116 3103</li>
              <li className="flex items-center gap-3"><Mail size={18} /> hola@lacodorniz.com</li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-6">Horarios</h4>
            <ul className="space-y-4 text-gray-400">
              <li className="flex items-center gap-3"><Clock size={18} /> Lun - Sáb: 9am - 8pm</li>
              <li className="flex items-center gap-3"><Clock size={18} /> Dom: Solo urgencias</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 border-t border-gray-800 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Veterinaria La Codorniz. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
}
