// apps/web/app/servicios/page.tsx
import type { Metadata } from 'next';
import { Card } from '@/components/ui/card';
import { Scissors, Stethoscope, Syringe, Bath, Activity, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Servicios | Veterinaria La Codorniz',
  description: 'Consulta general, estética canina, baños médicos, vacunación y más servicios veterinarios en Tecomán, Colima.',
  keywords: ['veterinaria', 'servicios veterinarios', 'estética canina', 'vacunación', 'Tecomán'],
};

async function getServices() {
  // In production, this would fetch from API
  // For now, using static data as per prompt requirement for "SSG with 24h revalidation"
  return [
    { name: 'Consulta General', price: 350, desc: 'Examen clínico exhaustivo para tu mascota.', icon: Stethoscope },
    { name: 'Estética Canina', price: 400, desc: 'Corte de pelo y limpieza profunda.', icon: Scissors },
    { name: 'Baño Médico', price: 250, desc: 'Tratamientos para piel y pelaje.', icon: Bath },
    { name: 'Vacunación', price: 250, desc: 'Protección contra las principales enfermedades.', icon: Syringe },
    { name: 'Cirugía Menor', price: 1200, desc: 'Procedimientos ambulatorios con anestesia.', icon: Activity },
    { name: 'Desparasitación', price: 200, desc: 'Control interno y externo de parásitos.', icon: ShieldCheck },
  ];
}

export default async function ServiciosPage() {
  const services = await getServices();

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-4">Nuestros Servicios</h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Cuidamos cada detalle para garantizar el bienestar de tus compañeros.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((s) => (
            <div key={s.name} className="bg-white rounded-3xl p-8 shadow-sm border hover:shadow-md transition-all">
              <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center text-green-700 mb-6">
                <s.icon size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-3">{s.name}</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">{s.desc}</p>
              <div className="flex justify-between items-center pt-6 border-t">
                <span className="text-green-700 font-bold text-xl">${s.price}</span>
                <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Costo base</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
