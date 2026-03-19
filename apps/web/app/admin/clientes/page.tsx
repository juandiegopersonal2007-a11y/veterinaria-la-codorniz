// apps/web/app/admin/clientes/page.tsx
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
import { Input } from '@/components/ui/input';
import { Plus, Search, Edit2, Trash2, UserPlus } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';

export default function ClientesPage() {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<any>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: ''
  });

  const fetchClients = async () => {
    try {
      const { data } = await apiClient.get('/clients');
      setClients(data);
    } catch (err) {
      console.error('Error fetching clients');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingClient) {
        await apiClient.put(`/clients/${editingClient.id}`, formData);
      } else {
        await apiClient.post('/clients', formData);
      }
      setIsModalOpen(false);
      fetchClients();
      resetForm();
    } catch (err) {
      alert('Error al guardar el cliente');
    }
  };

  const handleEdit = (client: any) => {
    setEditingClient(client);
    setFormData({
      name: client.name,
      phone: client.phone,
      email: client.email || '',
      address: client.address || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de eliminar este cliente?')) {
      try {
        await apiClient.delete(`/clients/${id}`);
        fetchClients();
      } catch (err) {
        alert('Error al eliminar');
      }
    }
  };

  const resetForm = () => {
    setEditingClient(null);
    setFormData({ name: '', phone: '', email: '', address: '' });
  };

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  );

  return (
    <AdminLayout>
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Directorio de Clientes</h1>
          <p className="text-gray-500 font-medium">Gestiona la información de contacto de tus clientes.</p>
        </div>
        <Button 
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="rounded-2xl h-12 px-6 gap-2 bg-green-600 hover:bg-green-700 shadow-lg shadow-green-100"
        >
          <UserPlus size={20} />
          Nuevo Cliente
        </Button>
      </div>

      <div className="bg-white rounded-[40px] shadow-sm border overflow-hidden">
        <div className="p-6 border-b bg-gray-50/50 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <Input 
              placeholder="Buscar por nombre o teléfono..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 h-12 rounded-2xl bg-white border-gray-200 focus:border-green-500"
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-gray-100">
              <TableHead className="font-bold text-gray-900 h-14 pl-8">Nombre</TableHead>
              <TableHead className="font-bold text-gray-900">Teléfono</TableHead>
              <TableHead className="font-bold text-gray-900">Email</TableHead>
              <TableHead className="font-bold text-gray-900">Mascotas</TableHead>
              <TableHead className="font-bold text-gray-900 text-right pr-8">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={5} className="text-center py-20 text-gray-400 italic">Cargando clientes...</TableCell></TableRow>
            ) : filteredClients.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center py-20 text-gray-400 italic">No se encontraron clientes.</TableCell></TableRow>
            ) : filteredClients.map((client) => (
              <TableRow key={client.id} className="hover:bg-green-50/30 transition-colors group">
                <TableCell className="font-bold text-gray-900 pl-8">{client.name}</TableCell>
                <TableCell className="font-medium text-gray-600">{client.phone}</TableCell>
                <TableCell className="text-gray-500">{client.email || '-'}</TableCell>
                <TableCell>
                  <span className="inline-flex items-center justify-center bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                    {client._count?.pets || 0}
                  </span>
                </TableCell>
                <TableCell className="text-right pr-8">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(client)} className="rounded-xl hover:bg-white hover:text-green-600 hover:shadow-sm">
                      <Edit2 size={18} />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(client.id)} className="rounded-xl hover:bg-white hover:text-red-600 hover:shadow-sm">
                      <Trash2 size={18} />
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
            <DialogTitle className="text-2xl font-bold">{editingClient ? 'Editar Cliente' : 'Nuevo Cliente'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-6 mt-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Nombre Completo</label>
              <Input 
                required 
                className="h-12 rounded-xl"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Teléfono</label>
              <Input 
                required 
                className="h-12 rounded-xl"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Email (Opcional)</label>
              <Input 
                type="email"
                className="h-12 rounded-xl"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Dirección (Opcional)</label>
              <Input 
                className="h-12 rounded-xl"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
              />
            </div>
            <DialogFooter className="pt-4">
              <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)} className="rounded-xl h-12">Cancelar</Button>
              <Button type="submit" className="bg-green-600 hover:bg-green-700 rounded-xl h-12 px-8">Guardar Cliente</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
