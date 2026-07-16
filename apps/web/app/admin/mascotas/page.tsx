// apps/web/app/admin/mascotas/page.tsx
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
import { Plus, Search, Edit2, Trash2, Dog, User } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';

export default function MascotasPage() {
  const [pets, setPets] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPet, setEditingPet] = useState<any>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    species: '',
    breed: '',
    chipNumber: '',
    clientId: '',
    weight: 0,
    photo: null as string | null,
  });
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const [petsRes, clientsRes] = await Promise.all([
        apiClient.get('/pets'),
        apiClient.get('/clients')
      ]);
      setPets(petsRes.data);
      setClients(clientsRes.data);
    } catch (err) {
      console.error('Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      alert('La imagen no puede superar 8 MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result);
      setFormData((prev) => ({ ...prev, photo: dataUrl }));
      setPhotoPreview(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: Record<string, unknown> = {
        name: formData.name,
        species: formData.species,
        breed: formData.breed || null,
        chipNumber: formData.chipNumber || null,
        clientId: formData.clientId,
        weight: formData.weight || null,
      };
      if (formData.photo) {
        payload.photo = formData.photo;
      }

      if (editingPet) {
        await apiClient.put(`/pets/${editingPet.id}`, payload);
      } else {
        await apiClient.post('/pets', payload);
      }
      setIsModalOpen(false);
      fetchData();
      resetForm();
    } catch (err: any) {
      alert(err?.response?.data?.error || 'Error al guardar la mascota');
    }
  };

  const handleEdit = (pet: any) => {
    setEditingPet(pet);
    setFormData({
      name: pet.name,
      species: pet.species,
      breed: pet.breed || '',
      chipNumber: pet.chipNumber || '',
      clientId: pet.clientId,
      weight: pet.weight || 0,
      photo: null,
    });
    setPhotoPreview(pet.photoUrl || null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de eliminar esta mascota?')) {
      try {
        await apiClient.delete(`/pets/${id}`);
        fetchData();
      } catch (err) {
        alert('Error al eliminar');
      }
    }
  };

  const resetForm = () => {
    setEditingPet(null);
    setFormData({ name: '', species: '', breed: '', chipNumber: '', clientId: '', weight: 0, photo: null });
    setPhotoPreview(null);
  };

  const filteredPets = pets.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.chipNumber && p.chipNumber.toLowerCase().includes(search.toLowerCase())) ||
    p.client.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Registro de Mascotas</h1>
          <p className="text-gray-500 font-medium">Gestiona los pacientes de la clínica.</p>
        </div>
        <Button 
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="rounded-2xl h-12 px-6 gap-2 bg-green-600 hover:bg-green-700 shadow-lg shadow-green-100"
        >
          <Plus size={20} />
          Nueva Mascota
        </Button>
      </div>

      <div className="bg-white rounded-[40px] shadow-sm border overflow-hidden">
        <div className="p-6 border-b bg-gray-50/50 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <Input 
              placeholder="Buscar por mascota, chip o dueño..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 h-12 rounded-2xl bg-white border-gray-200 focus:border-green-500"
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-gray-100">
              <TableHead className="font-bold text-gray-900 h-14 pl-8">Mascota</TableHead>
              <TableHead className="font-bold text-gray-900">Chip #</TableHead>
              <TableHead className="font-bold text-gray-900">Dueño</TableHead>
              <TableHead className="font-bold text-gray-900">Especie / Raza</TableHead>
              <TableHead className="font-bold text-gray-900 text-right pr-8">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={5} className="text-center py-20 text-gray-400 italic">Cargando pacientes...</TableCell></TableRow>
            ) : filteredPets.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center py-20 text-gray-400 italic">No se encontraron mascotas.</TableCell></TableRow>
            ) : filteredPets.map((pet) => (
              <TableRow key={pet.id} className="hover:bg-green-50/30 transition-colors group">
                <TableCell className="pl-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold text-sm">
                      {pet.name.charAt(0)}
                    </div>
                    <span className="font-bold text-gray-900">{pet.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <code className="text-xs font-bold bg-gray-100 px-2 py-1 rounded text-gray-600">
                    {pet.chipNumber || 'Sin Chip'}
                  </code>
                </TableCell>
                <TableCell className="text-gray-500 font-medium">
                  <div className="flex items-center gap-2">
                    <User size={14} />
                    {pet.client.name}
                  </div>
                </TableCell>
                <TableCell className="text-gray-500">{pet.species} • {pet.breed || '-'}</TableCell>
                <TableCell className="text-right pr-8">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(pet)} className="rounded-xl hover:bg-white hover:text-green-600 hover:shadow-sm">
                      <Edit2 size={18} />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(pet.id)} className="rounded-xl hover:bg-white hover:text-red-600 hover:shadow-sm">
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
            <DialogTitle className="text-2xl font-bold">{editingPet ? 'Editar Mascota' : 'Nueva Mascota'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-6 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Nombre</label>
                <Input 
                  required 
                  className="h-12 rounded-xl"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
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
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Especie</label>
                <Input 
                  required 
                  className="h-12 rounded-xl"
                  placeholder="Ej: Perro"
                  value={formData.species}
                  onChange={(e) => setFormData({...formData, species: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Raza (Opcional)</label>
                <Input 
                  className="h-12 rounded-xl"
                  placeholder="Ej: Labrador"
                  value={formData.breed}
                  onChange={(e) => setFormData({...formData, breed: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Chip (Opcional)</label>
                <Input 
                  className="h-12 rounded-xl"
                  value={formData.chipNumber}
                  onChange={(e) => setFormData({...formData, chipNumber: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Peso (Kg)</label>
                <Input 
                  type="number"
                  step="0.1"
                  className="h-12 rounded-xl"
                  value={formData.weight}
                  onChange={(e) => setFormData({...formData, weight: parseFloat(e.target.value)})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Foto (máx. 8 MB)</label>
              <Input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="h-12 rounded-xl"
                onChange={handlePhotoChange}
              />
              {photoPreview && (
                <img src={photoPreview} alt="Vista previa" className="mt-2 w-24 h-24 object-cover rounded-xl border" />
              )}
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)} className="rounded-xl h-12">Cancelar</Button>
              <Button type="submit" className="bg-green-600 hover:bg-green-700 rounded-xl h-12 px-8">Guardar Registro</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
