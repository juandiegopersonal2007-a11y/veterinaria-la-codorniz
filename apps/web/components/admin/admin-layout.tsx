// apps/web/components/admin/admin-layout.tsx
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Users, 
  Dog, 
  Calendar, 
  LogOut,
  ChevronRight,
  Package
} from 'lucide-react';

const sidebarLinks = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Citas', href: '/admin/citas', icon: Calendar },
  { name: 'Clientes', href: '/admin/clientes', icon: Users },
  { name: 'Mascotas', href: '/admin/mascotas', icon: Dog },
  { name: 'Productos', href: '/admin/productos', icon: Package },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('auth-token');
    localStorage.removeItem('refresh-token');
    localStorage.removeItem('user');
    document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    router.push('/login');
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r flex flex-col fixed inset-y-0 z-50">
        <div className="p-8">
          <Link href="/" className="text-2xl font-black text-[#064e3b] block tracking-tight">La Codorniz</Link>
          <div className="flex items-center gap-1 mt-1">
            <div className="h-1 w-4 bg-[#b47d2b] rounded-full"></div>
            <p className="text-[10px] font-bold text-[#b47d2b] uppercase tracking-[0.2em]">Administración</p>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center justify-between p-4 rounded-2xl font-bold transition-all group",
                  isActive 
                    ? "bg-[#064e3b] text-white shadow-xl shadow-emerald-100" 
                    : "text-slate-500 hover:bg-emerald-50 hover:text-[#064e3b]"
                )}
              >
                <div className="flex items-center gap-3">
                  <link.icon size={20} className={isActive ? "text-[#e9c46a]" : "group-hover:text-[#064e3b]"} />
                  <span>{link.name}</span>
                </div>
                {isActive && <ChevronRight size={16} className="text-[#e9c46a]" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-slate-100">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-4 rounded-2xl font-bold text-slate-400 hover:bg-red-50 hover:text-red-600 transition-all group"
          >
            <LogOut size={20} className="group-hover:rotate-12 transition-transform" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
