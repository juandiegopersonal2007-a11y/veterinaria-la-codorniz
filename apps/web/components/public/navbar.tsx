'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Dog, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const navLinks = [
  { name: 'Inicio', href: '/' },
  { name: 'Servicios', href: '/servicios' },
  { name: 'Tienda', href: '/tienda' },
  { name: 'Buscador Chip', href: '/chip' },
  { name: 'Ayuda', href: '/ayuda' },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  if (pathname?.startsWith('/admin') || pathname === '/login') {
    return null;
  }

  return (
    <nav 
      className={cn(
        "fixed w-full z-50 transition-all duration-500",
        scrolled 
          ? "bg-white/90 backdrop-blur-xl shadow-premium py-3" 
          : "bg-transparent py-5"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center overflow-hidden shadow-premium group-hover:scale-110 transition-transform duration-500">
              <img 
                src="/logoveterinaria.jpeg" 
                alt="Logo Veterinaria La Codorniz" 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <span className="text-2xl font-black text-[#064e3b] tracking-tighter block leading-none">LA CODORNIZ</span>
              <span className="text-[10px] font-bold text-[#b47d2b] tracking-[0.3em] uppercase">Tienda de Mascotas</span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300",
                    isActive 
                      ? "text-[#064e3b] bg-emerald-50" 
                      : "text-slate-600 hover:text-[#064e3b] hover:bg-emerald-50/50"
                  )}
                >
                  {link.name}
                </Link>
              );
            })}
            <div className="w-6"></div>
            <Link href="/contacto">
              <button 
                className="bg-[#ffb700] hover:bg-[#ffa000] text-[#064e3b] font-black rounded-full px-8 h-10 shadow-gold border-none flex items-center"
              >
                CONTACTO <ArrowRight size={18} className="ml-2" />
              </button>
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden w-12 h-12 flex items-center justify-center text-[#064e3b] hover:bg-emerald-50 rounded-2xl transition-colors"
          >
            {isOpen ? <X size={30} /> : <Menu size={30} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div 
        className={cn(
          "fixed inset-0 top-[72px] bg-white z-40 md:hidden transition-all duration-500 ease-in-out transform",
          isOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        )}
      >
        <div className="flex flex-col p-8 space-y-4">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-2xl font-black py-4 border-b border-slate-50 transition-all",
                  isActive ? "text-[#ffb700] pl-4" : "text-[#064e3b]"
                )}
              >
                {link.name}
              </Link>
            );
          })}
          <div className="pt-8 space-y-4">
            <Link href="/contacto" className="block">
              <button className="w-full h-16 rounded-2xl text-xl font-black bg-[#ffb700] text-[#064e3b] shadow-gold">
                CONTACTO
              </button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
