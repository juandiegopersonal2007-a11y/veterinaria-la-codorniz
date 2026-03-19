// apps/web/app/admin/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { Users, Dog, Calendar, TrendingUp } from 'lucide-react';
import { AdminLayout } from '@/components/admin/admin-layout';

type DashboardStats = {
  clients: number;
  pets: number;
  appointments: number;
};

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({ clients: 0, pets: 0, appointments: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await apiClient.get('/dashboard/stats');
        setStats({
          clients: data.clients,
          pets: data.pets,
          appointments: data.appointments,
        });
      } catch (err) {
        console.error('Error fetching dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">Bienvenido de nuevo 👋</h1>
        <p className="text-gray-500 font-medium">Esto es lo que está pasando hoy en La Codorniz.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {[
          { label: 'Clientes', value: stats.clients, icon: Users, color: 'bg-blue-100 text-blue-600' },
          { label: 'Mascotas', value: stats.pets, icon: Dog, color: 'bg-green-100 text-green-600' },
          { label: 'Citas', value: stats.appointments, icon: Calendar, color: 'bg-orange-100 text-orange-600' },
        ].map((card) => (
          <div key={card.label} className="bg-white p-8 rounded-[40px] shadow-sm border-2 border-transparent hover:border-green-100 transition-all flex items-center gap-6">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${card.color}`}>
              <card.icon size={32} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{card.label}</p>
              <p className="text-4xl font-extrabold text-gray-900">{loading ? '...' : card.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white p-10 rounded-[40px] shadow-sm border min-h-[400px]">
          <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
            <TrendingUp className="text-green-600" />
            Actividad Semanal
          </h3>
          <div className="flex flex-col items-center justify-center h-64 text-gray-400 font-medium text-center italic">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <TrendingUp size={32} />
            </div>
            Gráfico de rendimiento (Recharts) se cargará con datos reales de producción.
          </div>
        </div>
        <div className="bg-white p-10 rounded-[40px] shadow-sm border min-h-[400px]">
          <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
            <Calendar className="text-orange-600" />
            Próximas Citas
          </h3>
          <div className="flex flex-col items-center justify-center h-64 text-gray-400 font-medium text-center italic">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <Calendar size={32} />
            </div>
            Aquí aparecerá la lista de las próximas 5 citas confirmadas del día.
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
