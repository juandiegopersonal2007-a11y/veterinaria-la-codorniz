import { Lock, Heart, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function PrivacidadPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] pt-40 pb-32">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
            <Heart size={40} className="text-[#064e3b]" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-[#064e3b] mb-4">Tu Confianza es Lo Primero</h1>
          <p className="text-xl text-slate-500">
            Tu información y la de tu mascota están seguras con nosotros.
          </p>
        </div>

        <div className="space-y-8">
          <div className="bg-white rounded-[32px] p-10 shadow-premium border border-slate-50">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-[#ffb700]/10 text-[#ffb700] flex items-center justify-center">
                <Lock size={24} />
              </div>
              <h2 className="text-2xl font-black text-[#064e3b]">Tu privacidad es nuestra prioridad</h2>
            </div>
            <p className="text-slate-500 leading-relaxed mb-6">
              Entendemos que compartir datos tuyos y de tu mascota es algo importante. En Veterinaria La Codorniz,
              tratamos tu información con el mismo cuidado que tratamos a tu compañero peludo.
            </p>
          </div>

          <div className="bg-white rounded-[32px] p-10 shadow-premium border border-slate-50">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#064e3b] flex items-center justify-center">
                <ShieldCheck size={24} />
              </div>
              <h2 className="text-2xl font-black text-[#064e3b]">Qué hacemos con tu información</h2>
            </div>
            <ul className="space-y-4">
              {[
                'Solo la usamos para atenderte mejor: citas, seguimiento de tu mascota y comunicaciones importantes.',
                'Nunca compartimos tus datos con nadie sin tu consentimiento (ni lo vamos a hacer).',
                'Guardamos la información de forma segura, siempre con la protección que mereces.',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 size={20} className="text-[#064e3b] mt-1 shrink-0" />
                  <span className="text-slate-600 font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-[#064e3b] text-white rounded-[32px] p-10 shadow-2xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-white/10 text-[#ffb700] flex items-center justify-center">
                <Heart size={24} />
              </div>
              <h2 className="text-2xl font-black">Lo más importante: Estamos aquí para ti</h2>
            </div>
            <p className="text-emerald-50/90 leading-relaxed">
              Si tienes alguna duda sobre cómo usamos tu información, ¡escríbenos o llámanos! Estaremos felices de aclarar
              cualquier cosa. Tu tranquilidad es tan importante como la salud de tu mascota.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
