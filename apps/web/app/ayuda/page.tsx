// apps/web/app/ayuda/page.tsx
import type { Metadata } from 'next';
import { MessageCircle, Facebook, Instagram, Mail } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Ayuda | Veterinaria La Codorniz',
  description: 'Elige el canal que prefieras para contactar a Veterinaria La Codorniz: WhatsApp, Facebook, Instagram o correo electrónico.',
  keywords: ['ayuda veterinaria', 'soporte mascotas', 'WhatsApp veterinaria', 'Veterinaria La Codorniz'],
};

export default function AyudaPage() {
  const whatsappUrl =
    `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5231311631033'}?text=` +
    encodeURIComponent(process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE || 'Hola, necesito ayuda con mi mascota 🐾');

  const facebookUrl = process.env.NEXT_PUBLIC_FACEBOOK_URL || 'https://facebook.com/LaCodornizTecoman';
  const instagramUrl = process.env.NEXT_PUBLIC_INSTAGRAM_URL || 'https://instagram.com/LaCodorniz';
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'contacto@lacodorniz.com';

  return (
    <div className="min-h-screen bg-green-50 pt-32 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4">
            ¿Cómo podemos ayudarte?
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Contáctanos por el canal que prefieras, respondemos rápido 🐾
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <a
            href={whatsappUrl}
            className="bg-white rounded-3xl p-8 shadow-sm border hover:shadow-lg transition-all flex flex-col gap-4"
          >
            <div className="w-14 h-14 bg-green-100 text-green-700 rounded-2xl flex items-center justify-center mb-2">
              <MessageCircle size={28} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">WhatsApp</h2>
            <p className="text-gray-600">
              Atención inmediata para dudas rápidas o emergencias leves.
            </p>
            <span className="mt-2 text-sm font-semibold text-green-700">Abrir chat</span>
          </a>

          <a
            href={facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white rounded-3xl p-8 shadow-sm border hover:shadow-lg transition-all flex flex-col gap-4"
          >
            <div className="w-14 h-14 bg-blue-100 text-blue-700 rounded-2xl flex items-center justify-center mb-2">
              <Facebook size={28} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Facebook</h2>
            <p className="text-gray-600">
              Síguenos para conocer promociones, consejos y novedades de la clínica.
            </p>
            <span className="mt-2 text-sm font-semibold text-blue-700">Visitar página</span>
          </a>

          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white rounded-3xl p-8 shadow-sm border hover:shadow-lg transition-all flex flex-col gap-4"
          >
            <div className="w-14 h-14 bg-pink-100 text-pink-600 rounded-2xl flex items-center justify-center mb-2">
              <Instagram size={28} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Instagram</h2>
            <p className="text-gray-600">
              Historias, casos de éxito y el día a día de nuestros pacientes.
            </p>
            <span className="mt-2 text-sm font-semibold text-pink-600">Ver perfil</span>
          </a>

          <a
            href={`mailto:${email}?subject=Ayuda%20-%20Veterinaria%20La%20Codorniz&body=Hola%2C%20necesito%20ayuda%20con%20mi%20mascota.`}
            className="bg-white rounded-3xl p-8 shadow-sm border hover:shadow-lg transition-all flex flex-col gap-4"
          >
            <div className="w-14 h-14 bg-gray-100 text-gray-700 rounded-2xl flex items-center justify-center mb-2">
              <Mail size={28} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Correo electrónico</h2>
            <p className="text-gray-600">
              Ideal para casos detallados, envío de estudios o presupuestos.
            </p>
            <span className="mt-2 text-sm font-semibold text-gray-700">Redactar correo</span>
          </a>
        </div>
      </div>
    </div>
  );
}

