import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useEffect, useState } from 'react';

interface EventCreateFormProps {
    selectedDate?: string | null;
    selectedCalendar?: any;
    onEventCreated?: (event: any) => void;
    auth?: any;
}

export function EventCreateForm({
    selectedDate,
    selectedCalendar,
    onEventCreated,
    auth,
}: EventCreateFormProps) {
    const [form, setForm] = useState({
        titulo: '',
        descripcion: '',
        ubicacion: '',
        prioridad: 'Alta',
        color: '#2563eb',
        fecha_inicio: '',
        fecha_fin: '',
    });
    const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
    const [loading, setLoading] = useState(false);
    const [allUsers, setAllUsers] = useState<any[]>([]);

    useEffect(() => {
        if (selectedDate) {
            const dateOnly = selectedDate.split('T')[0];
            setForm((prev) => ({
                ...prev,
                fecha_inicio: dateOnly + 'T09:30',
                fecha_fin: dateOnly + 'T18:00',
            }));
        }
    }, [selectedDate]);

    useEffect(() => {
        fetch('/users')
            .then((response) => response.json())
            .then((data) => setAllUsers(data))
            .catch((error) => console.error('Error fetching users:', error));
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCalendar) return;

        setLoading(true);

        fetch(`/calendarios/${selectedCalendar.id}/eventos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN':
                    document
                        .querySelector('meta[name="csrf-token"]')
                        ?.getAttribute('content') || '',
            },
            body: JSON.stringify({ ...form, users: selectedUsers }),
        })
            .then((response) => response.json())
            .then((newEvent) => {
                onEventCreated?.(newEvent);
                // Reset form
                setForm({
                    titulo: '',
                    descripcion: '',
                    ubicacion: '',
                    prioridad: 'Alta',
                    color: '#2563eb',
                    fecha_inicio: selectedDate
                        ? selectedDate.split('T')[0] + 'T09:30'
                        : '',
                    fecha_fin: selectedDate
                        ? selectedDate.split('T')[0] + 'T18:00'
                        : '',
                });
                setSelectedUsers([]);
            })
            .catch((error) => {
                console.error('Error creating event:', error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <div className="space-y-4 p-4">
            <h3 className="mb-4 text-lg font-semibold">Crear Nuevo Evento</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <Label htmlFor="titulo">Título</Label>
                    <Input
                        id="titulo"
                        value={form.titulo}
                        onChange={(e) =>
                            setForm({ ...form, titulo: e.target.value })
                        }
                        placeholder="Título del evento"
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="descripcion">Descripción</Label>
                    <Textarea
                        id="descripcion"
                        value={form.descripcion}
                        onChange={(e) =>
                            setForm({ ...form, descripcion: e.target.value })
                        }
                        placeholder="Descripción del evento"
                        rows={3}
                    />
                </div>
                <div>
                    <Label htmlFor="ubicacion">Ubicación</Label>
                    <Input
                        id="ubicacion"
                        value={form.ubicacion}
                        onChange={(e) =>
                            setForm({ ...form, ubicacion: e.target.value })
                        }
                        placeholder="Ubicación"
                    />
                </div>
                <div>
                    <Label htmlFor="prioridad">Prioridad</Label>
                    <Input
                        id="prioridad"
                        value={form.prioridad}
                        onChange={(e) =>
                            setForm({ ...form, prioridad: e.target.value })
                        }
                        placeholder="Prioridad"
                    />
                </div>
                <div>
                    <Label htmlFor="color">Color</Label>
                    <Input
                        id="color"
                        type="color"
                        value={form.color}
                        onChange={(e) =>
                            setForm({ ...form, color: e.target.value })
                        }
                    />
                </div>
                <div>
                    <Label htmlFor="fecha_inicio">Fecha y Hora de Inicio</Label>
                    <Input
                        id="fecha_inicio"
                        type="datetime-local"
                        value={form.fecha_inicio}
                        onChange={(e) =>
                            setForm({ ...form, fecha_inicio: e.target.value })
                        }
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="fecha_fin">
                        Fecha y Hora de Fin (Opcional)
                    </Label>
                    <Input
                        id="fecha_fin"
                        type="datetime-local"
                        value={form.fecha_fin}
                        onChange={(e) =>
                            setForm({ ...form, fecha_fin: e.target.value })
                        }
                    />
                </div>
                <div>
                    <Label>Invitar Usuarios</Label>
                    <div className="mt-2 space-y-2">
                        {allUsers.filter((u: any) => u.id !== auth?.user?.id).map((user: any) => (
                            <div
                                key={user.id}
                                className="flex items-center space-x-2"
                            >
                                <Checkbox
                                    id={`user-${user.id}`}
                                    checked={selectedUsers.includes(user.id)}
                                    onCheckedChange={(checked) => {
                                        if (checked) {
                                            setSelectedUsers([
                                                ...selectedUsers,
                                                user.id,
                                            ]);
                                        } else {
                                            setSelectedUsers(
                                                selectedUsers.filter(
                                                    (id) => id !== user.id,
                                                ),
                                            );
                                        }
                                    }}
                                />
                                <Label
                                    htmlFor={`user-${user.id}`}
                                    className="text-sm"
                                >
                                    {user.name} ({user.email})
                                </Label>
                            </div>
                        ))}
                    </div>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Creando...' : 'Crear Evento'}
                </Button>
            </form>
        </div>
    );
}
