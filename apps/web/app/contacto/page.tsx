// apps/web/app/contacto/page.tsx
'use client';
import { 
  Phone, 
  MapPin, 
  Clock, 
  MessageCircle, 
  Facebook, 
  ArrowRight,
  Star,
  Calendar,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useState } from 'react';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';

export default function ContactoPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    petName: '',
    phone: '',
    service: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Guardar en la base de datos a través de la API
      await apiClient.post('/appointments/public', {
        name: formData.name,
        petName: formData.petName,
        phone: formData.phone,
        service: formData.service
      });

      // 2. Preparar mensaje de WhatsApp
      const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '523131163103';
      const message = `*Nuevo Mensaje de Contacto* 🐾%0A%0A` +
        `*Nombre:* ${formData.name}%0A` +
        `*Mascota:* ${formData.petName}%0A` +
        `*Teléfono:* ${formData.phone}%0A` +
        `*Necesita:* ${formData.service.toUpperCase()}%0A%0A` +
        `*Enviado desde la web de La Codorniz`;

      // 3. Abrir WhatsApp y limpiar formulario
      window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
      setFormData({ name: '', petName: '', phone: '', service: '' });
      
      toast.success('¡Mensaje Enviado!', {
        description: 'Tu mensaje ha sido recibido, pronto te contactaremos.'
      });
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      toast.error('Error al enviar', {
        description: 'No pudimos enviar tu mensaje, pero puedes contactarnos por WhatsApp.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Header */}
      <section className="relative pt-32 pb-20 bg-[#064e3b] text-white overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-[#b47d2b]/10 blur-[120px] rounded-full"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-[#ffb700]/10 text-[#ffb700] px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase mb-6 border border-[#ffb700]/20">
            <Star size={14} fill="currentColor" />
            Tu clínica de confianza
            <Star size={14} fill="currentColor" />
          </div>
          <h1 className="text-5xl lg:text-7xl font-extrabold mb-6 tracking-tight">
            ¿Listo para cuidar a tu mascota?
          </h1>
          <p className="text-xl text-emerald-100/80 max-w-2xl mx-auto leading-relaxed">
            Agenda tu cita o contáctanos para cualquier duda. Estamos para ayudarte.
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
              sub: 'Contáctanos',
              icon: Phone,
              color: 'bg-emerald-900',
              action: 'Llamar ahora',
              href: 'tel:+523131163103'
            },
            {
              title: 'WhatsApp',
              info: 'WhatsApp Business',
              sub: 'Respuestas rápidas',
              icon: MessageCircle,
              color: 'bg-[#25D366]',
              action: 'Enviar mensaje',
              href: 'https://wa.me/523131163103'
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
                <a
                  href={item.href}
                  target={item.href.startsWith('http') ? '_blank' : undefined}
                  rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="inline-flex items-center gap-2 text-emerald-700 font-bold hover:gap-4 transition-all"
                >
                  {item.action} <ArrowRight size={20} />
                </a>
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
                  Contáctanos
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      placeholder="Tu Nombre"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="h-14 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-emerald-800"
                    />
                    <Input
                      placeholder="Nombre de Mascota"
                      required
                      value={formData.petName}
                      onChange={(e) => setFormData({...formData, petName: e.target.value})}
                      className="h-14 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-emerald-800"
                    />
                  </div>
                  <Input
                    placeholder="Teléfono de contacto"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="h-14 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-emerald-800"
                  />
                  <select
                    required
                    value={formData.service}
                    onChange={(e) => setFormData({...formData, service: e.target.value})}
                    className="w-full h-14 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-emerald-800 px-4 text-slate-500"
                  >
                    <option value="">¿Qué necesitas?</option>
                    <option value="consulta">Consulta General</option>
                    <option value="estetica">Estética Canina</option>
                    <option value="bano">Baño Médico</option>
                    <option value="vacunacion">Vacunación</option>
                    <option value="cirugia">Cirugía Menor</option>
                    <option value="desparasitacion">Desparasitación</option>
                    <option value="cirugias-programadas">Cirugías Programadas</option>
                    <option value="urgencias">Urgencias y Emergencias</option>
                  </select>
                  <Button
                    disabled={loading}
                    className="w-full h-16 rounded-2xl bg-[#064e3b] hover:bg-[#053e2f] text-white font-bold text-lg shadow-xl shadow-emerald-100 transition-all flex items-center justify-center gap-2"
                  >
                    {loading ? <Loader2 className="animate-spin" /> : 'Enviar Mensaje'}
                  </Button>
                </form>
              </div>
            
            <div className="grid grid-cols-1 gap-6">
              <div className="bg-emerald-50 p-6 rounded-[32px] border border-emerald-100">
                <Clock className="text-emerald-700 mb-4" />
                <h4 className="font-bold text-slate-900 mb-1">Horario de Atención</h4>
                <p className="text-xs text-slate-600">Lun - Vie: 8am - 8pm</p>
                <p className="text-xs text-slate-600">Sábados: 10am - 4pm</p>
              </div>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-tr from-[#b47d2b]/20 to-emerald-100/20 rounded-[48px] blur-2xl group-hover:blur-3xl transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
            <div className="relative bg-white p-4 rounded-[40px] shadow-2xl border border-slate-100 overflow-hidden">
              <div className="flex items-center gap-3 mb-4 px-4">
                <MapPin className="text-emerald-700" />
                <div>
                  <h4 className="font-bold text-slate-900">Nuestra Clínica</h4>
                  <p className="text-xs text-slate-500">Calle Abasolo 399, 28100 Tecomán, Colima.</p>
                </div>
              </div>
              <div className="rounded-[32px] overflow-hidden h-[400px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!4v1784242745669!6m8!1m7!1sID7tHI0WeP3Vg5ZUpYjdbA!2m2!1d18.91286325928492!2d-103.8758363272087!3f69.03306718942763!4f3.010576007851199!5f0.7820865974627469"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                ></iframe>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
