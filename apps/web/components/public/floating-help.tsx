// apps/web/components/public/floating-help.tsx
'use client';

import { useState } from 'react';
import { HelpCircle, X, MessageCircle, Facebook, type LucideIcon } from 'lucide-react';

function TikTokIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.17 8.17 0 004.78 1.52V6.75a4.85 4.85 0 01-1.01-.06z"/>
    </svg>
  );
}

type ContactLink = {
  name: string;
  color: string;
  href: string;
  renderIcon: () => React.ReactNode;
};

const CONTACT_LINKS: ContactLink[] = [
  {
    name: 'WhatsApp',
    color: 'bg-green-500',
    href: `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '523131163103'}?text=${encodeURIComponent(process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE || 'Hola, necesito ayuda con mi mascota 🐾')}`,
    renderIcon: () => <MessageCircle size={20} />,
  },
  {
    name: 'Facebook',
    color: 'bg-[#1877F2]',
    href: 'https://www.facebook.com/share/1986rTrtnu/',
    renderIcon: () => <Facebook size={20} />,
  },
  {
    name: 'TikTok',
    color: 'bg-black',
    href: 'https://www.tiktok.com/@granja_la_codorniz',
    renderIcon: () => <TikTokIcon size={20} />,
  },
];

export function FloatingHelp() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="mb-4 flex flex-col gap-2">
          {CONTACT_LINKS.map((link) => (
            <a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-3 p-3 rounded-full text-white shadow-lg transition-transform hover:scale-105 ${link.color}`}
            >
              {link.renderIcon()}
              <span className="font-semibold text-sm pr-2">{link.name}</span>
            </a>
          ))}
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-14 h-14 bg-orange-500 text-white rounded-full shadow-2xl transition-all hover:bg-orange-600 focus:outline-none focus:ring-4 focus:ring-orange-300"
      >
        {isOpen ? <X size={28} /> : <HelpCircle size={28} />}
      </button>
    </div>
  );
}
