// apps/web/app/admin/citas/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { AdminLayout } from '@/components/admin/admin-layout';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, Clock, Dog, Plus, Filter, CheckCircle2, XCircle, Clock4 } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const SERVICE_TYPES = [
  'CONSULTA', 'ESTETICA', 'BANO', 'CIRUGIA_MENOR', 'VACUNACION', 'DESPARASITACION', 'OTRO'
];

export default function CitasPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [pets, setPets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<any>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    clientId: '',
    petId: '',
    date: '',
    service: 'CONSULTA',
    status: 'PENDING',
    notes: ''
  });

  const fetchData = async () => {
    try {
      const [apptsRes, clientsRes, petsRes] = await Promise.all([
        apiClient.get('/appointments'),
        apiClient.get('/clients'),
        apiClient.get('/pets')
      ]);
      setAppointments(apptsRes.data);
      setClients(clientsRes.data);
      setPets(petsRes.data);
    } catch (err) {
      console.error('Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingAppointment) {
        await apiClient.put(`/appointments/${editingAppointment.id}`, formData);
      } else {
        await apiClient.post('/appointments', formData);
      }
      setIsModalOpen(false);
      fetchData();
      resetForm();
    } catch (err) {
      alert('Error al guardar la cita');
    }
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await apiClient.put(`/appointments/${id}`, { status });
      fetchData();
    } catch (err) {
      alert('Error al actualizar estado');
    }
  };

  const handleEdit = (appt: any) => {
    setEditingAppointment(appt);
    setFormData({
      clientId: appt.clientId,
      petId: appt.petId,
      date: new Date(appt.date).toISOString().slice(0, 16),
      service: appt.service,
      status: appt.status,
      notes: appt.notes || ''
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setEditingAppointment(null);
    setFormData({ clientId: '', petId: '', date: '', service: 'CONSULTA', status: 'PENDING', notes: '' });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING': return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-700"><Clock4 size={12} /> Pendiente</span>;
      case 'CONFIRMED': return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700"><CheckCircle2 size={12} /> Confirmada</span>;
      case 'COMPLETED': return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700"><CheckCircle2 size={12} /> Completada</span>;
      case 'CANCELLED': return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700"><XCircle size={12} /> Cancelada</span>;
      default: return null;
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Agenda de Citas</h1>
          <p className="text-gray-500 font-medium">Control total de la programación veterinaria.</p>
        </div>
        <Button 
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="rounded-2xl h-12 px-6 gap-2 bg-green-600 hover:bg-green-700 shadow-lg shadow-green-100"
        >
          <Plus size={20} />
          Nueva Cita
        </Button>
      </div>

      <div className="bg-white rounded-[40px] shadow-sm border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-gray-100">
              <TableHead className="font-bold text-gray-900 h-14 pl-8">Fecha y Hora</TableHead>
              <TableHead className="font-bold text-gray-900">Mascota / Dueño</TableHead>
              <TableHead className="font-bold text-gray-900">Servicio</TableHead>
              <TableHead className="font-bold text-gray-900">Estado</TableHead>
              <TableHead className="font-bold text-gray-900 text-right pr-8">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={5} className="text-center py-20 text-gray-400 italic">Cargando agenda...</TableCell></TableRow>
            ) : appointments.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center py-20 text-gray-400 italic">No hay citas programadas.</TableCell></TableRow>
            ) : appointments.map((appt) => (
              <TableRow key={appt.id} className="hover:bg-green-50/30 transition-colors group">
                <TableCell className="pl-8">
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-900">{format(new Date(appt.date), 'dd MMMM, yyyy', { locale: es })}</span>
                    <span className="text-sm font-medium text-gray-500 flex items-center gap-1.5">
                      <Clock size={14} />
                      {format(new Date(appt.date), 'hh:mm a')}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-bold text-green-700 flex items-center gap-1.5"><Dog size={14} /> {appt.pet.name}</span>
                    <span className="text-sm font-medium text-gray-500">{appt.client.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm font-bold bg-gray-100 px-3 py-1 rounded-full text-gray-700 uppercase tracking-wider">
                    {appt.service.replace('_', ' ')}
                  </span>
                </TableCell>
                <TableCell>{getStatusBadge(appt.status)}</TableCell>
                <TableCell className="text-right pr-8">
                  <div className="flex justify-end gap-2">
                    {appt.status === 'PENDING' && (
                      <Button 
                        variant="ghost" size="icon" 
                        onClick={() => handleStatusUpdate(appt.id, 'CONFIRMED')}
                        className="rounded-xl hover:bg-white hover:text-blue-600 hover:shadow-sm"
                        title="Confirmar"
                      >
                        <CheckCircle2 size={18} />
                      </Button>
                    )}
                    <Button 
                      variant="ghost" size="icon" 
                      onClick={() => handleEdit(appt)} 
                      className="rounded-xl hover:bg-white hover:text-green-600 hover:shadow-sm"
                      title="Editar"
                    >
                      <Filter size={18} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="rounded-[30px] p-8 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">{editingAppointment ? 'Editar Cita' : 'Nueva Cita'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-6 mt-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Dueño</label>
              <select 
                required
                className="w-full h-12 rounded-xl border-2 border-gray-100 bg-gray-50 px-4 focus:border-green-500 outline-none transition-all text-sm font-medium"
                value={formData.clientId}
                onChange={(e) => setFormData({...formData, clientId: e.target.value})}
              >
                <option value="">Seleccionar...</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Mascota</label>
              <select 
                required
                className="w-full h-12 rounded-xl border-2 border-gray-100 bg-gray-50 px-4 focus:border-green-500 outline-none transition-all text-sm font-medium"
                value={formData.petId}
                onChange={(e) => setFormData({...formData, petId: e.target.value})}
              >
                <option value="">Seleccionar...</option>
                {pets.filter(p => p.clientId === formData.clientId).map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Fecha y Hora</label>
                <input 
                  type="datetime-local"
                  required
                  className="w-full h-12 rounded-xl border-2 border-gray-100 bg-gray-50 px-4 focus:border-green-500 outline-none transition-all text-sm font-medium"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Servicio</label>
                <select 
                  required
                  className="w-full h-12 rounded-xl border-2 border-gray-100 bg-gray-50 px-4 focus:border-green-500 outline-none transition-all text-sm font-medium"
                  value={formData.service}
                  onChange={(e) => setFormData({...formData, service: e.target.value})}
                >
                  {SERVICE_TYPES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Estado</label>
              <select 
                required
                className="w-full h-12 rounded-xl border-2 border-gray-100 bg-gray-50 px-4 focus:border-green-500 outline-none transition-all text-sm font-medium"
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
              >
                <option value="PENDING">Pendiente</option>
                <option value="CONFIRMED">Confirmada</option>
                <option value="COMPLETED">Completada</option>
                <option value="CANCELLED">Cancelada</option>
              </select>
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)} className="rounded-xl h-12">Cancelar</Button>
              <Button type="submit" className="bg-green-600 hover:bg-green-700 rounded-xl h-12 px-8">Guardar Cita</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
