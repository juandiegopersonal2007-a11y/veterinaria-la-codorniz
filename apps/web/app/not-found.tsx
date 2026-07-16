// apps/web/app/not-found.tsx
import Link from 'next/link';
import { Dog, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-8 animate-fade-in-up">
        <div className="relative inline-block">
          <div className="w-32 h-32 bg-emerald-50 rounded-[40px] flex items-center justify-center text-[#064e3b] shadow-inner mx-auto">
            <Dog size={64} strokeWidth={1.5} />
          </div>
          <div className="absolute -top-2 -right-2 bg-[#ffb700] text-[#064e3b] font-black px-3 py-1 rounded-full text-sm shadow-gold">
            404
          </div>
        </div>
        
        <div className="space-y-4">
          <h1 className="text-4xl font-black text-[#064e3b] tracking-tight">¡Oh no! Página perdida</h1>
          <p className="text-slate-500 font-medium leading-relaxed">
            Parece que tu mascota se llevó esta página a dar un paseo. No te preocupes, podemos volver al inicio juntos.
          </p>
        </div>

        <div className="pt-4">
          <Link href="/">
            <Button className="w-full h-16 rounded-2xl bg-[#064e3b] hover:bg-[#053e2f] text-white text-lg font-black shadow-2xl shadow-emerald-900/20 transition-all flex items-center justify-center gap-3 group">
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              Volver a Casa
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
