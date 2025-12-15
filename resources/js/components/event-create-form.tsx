import { DescriptionModal } from '@/components/description-modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { FileText, Search, User, X } from 'lucide-react';
import { useEffect, useState } from 'react';

const eventColors = [
    { name: 'Azul', value: '#2563eb' },
    { name: 'Rojo', value: '#dc2626' },
    { name: 'Amarillo', value: '#eab308' },
    { name: 'Verde', value: '#16a34a' },
    { name: 'Celeste', value: '#06b6d4' },
    { name: 'Violeta', value: '#9333ea' },
    { name: 'Rosado', value: '#ec4899' },
    { name: 'Naranja', value: '#ea580c' },
    { name: 'Café', value: '#8b4513' },
    { name: 'Marrón', value: '#92400e' },
];

interface EventCreateFormProps {
    selectedDate?: string | null;
    selectedCalendars?: any[];
    onEventCreated?: (event: any) => void;
    auth?: any;
}

export function EventCreateForm({
    selectedDate,
    selectedCalendars = [],
    onEventCreated,
    auth,
}: EventCreateFormProps) {
    const [selectedCalendarId, setSelectedCalendarId] = useState<string>('');
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
    const [userSearch, setUserSearch] = useState('');
    const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);

    // Set default calendar when calendars change
    useEffect(() => {
        if (selectedCalendars.length > 0 && !selectedCalendarId) {
            setSelectedCalendarId(selectedCalendars[0].id.toString());
        }
    }, [selectedCalendars, selectedCalendarId]);

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
        const selectedCalendar = selectedCalendars.find(
            (c) => c.id.toString() === selectedCalendarId,
        );
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
                setUserSearch('');
            })
            .catch((error) => {
                console.error('Error creating event:', error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <div className="space-y-4 overflow-y-auto p-4">
            <h3 className="text-lg font-semibold">Crear Nuevo Evento</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                {selectedCalendars.length > 1 && (
                    <div>
                        <Label htmlFor="calendar">Seleccionar Calendario</Label>
                        <Select
                            value={selectedCalendarId}
                            onValueChange={setSelectedCalendarId}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Selecciona un calendario" />
                            </SelectTrigger>
                            <SelectContent>
                                
                                {selectedCalendars
                                    .filter((calendar) =>
                                        calendar.users?.some(
                                            (u: any) =>
                                                u.id === auth?.user?.id &&
                                                u.pivot?.tipo_user === 'owner',
                                        ),
                                    )
                                    .map((calendar) => (
                                        <SelectItem
                                            key={calendar.id}
                                            value={calendar.id.toString()}
                                        >
                                            {calendar.nombre}
                                        </SelectItem>
                                    ))}
                            </SelectContent>
                        </Select>
                    </div>
                )}
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
                    <Label htmlFor="descripcion">Nota(Opcional)</Label>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsDescriptionModalOpen(true)}
                        className="w-full justify-start text-left font-normal"
                    >
                        <FileText className="mr-2 h-4 w-4" />
                        {form.descripcion ? (
                            <span className="truncate">
                                {form.descripcion.length > 50
                                    ? `${form.descripcion.substring(0, 50)}...`
                                    : form.descripcion}
                            </span>
                        ) : (
                            <span className="text-muted-foreground">
                                Haz clic para agregar una descripción
                            </span>
                        )}
                    </Button>
                </div>
                <div>
                    <Label htmlFor="color">Escoje Color</Label>
                    <Select
                        value={form.color}
                        onValueChange={(value) =>
                            setForm({ ...form, color: value })
                        }
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Selecciona un color" />
                        </SelectTrigger>
                        <SelectContent>
                            {eventColors.map((color) => (
                                <SelectItem
                                    key={color.value}
                                    value={color.value}
                                >
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="h-4 w-4 rounded-full border"
                                            style={{
                                                backgroundColor: color.value,
                                            }}
                                        ></div>
                                        {color.name}
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label htmlFor="fecha_inicio">Fecha y Hora de Inicio</Label>
                    <Input
                        id="fecha_inicio"
                        type="datetime-local"
                        value={form.fecha_inicio}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                fecha_inicio: e.target.value,
                            })
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
                    <Label>Invitar Usuarios (Opcional)</Label>

                    {/* Selected Users Display */}
                    {selectedUsers.length > 0 && (
                        <div className="mt-2 mb-3">
                            <Label className="mb-2 block text-sm text-muted-foreground">
                                Usuarios Invitados:
                            </Label>
                            <div className="flex flex-wrap gap-2">
                                {selectedUsers.map((userId) => {
                                    const user = allUsers.find(
                                        (u: any) => u.id === userId,
                                    );
                                    return user ? (
                                        <div
                                            key={userId}
                                            className="flex items-center gap-1 rounded-full border border-border bg-muted px-2 py-1 text-xs text-muted-foreground"
                                        >
                                            <User className="h-3 w-3" />
                                            <span>{user.name}</span>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setSelectedUsers(
                                                        selectedUsers.filter(
                                                            (id) =>
                                                                id !== userId,
                                                        ),
                                                    )
                                                }
                                                className="ml-1 rounded-full p-0.5 hover:bg-muted"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </div>
                                    ) : null;
                                })}
                            </div>
                        </div>
                    )}

                    {/* Search Input */}
                    <div className="relative mt-2">
                        <div className="relative">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Buscar usuarios..."
                                value={userSearch}
                                onChange={(e) => setUserSearch(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>

                    {/* User List - Only show when there are search results */}
                    {userSearch && (
                        <div className="mt-2 max-h-40 overflow-y-auto rounded-lg border border-border/50 bg-background/50">
                            {allUsers
                                .filter(
                                    (u: any) =>
                                        u.id !== auth?.user?.id &&
                                        u.name
                                            .toLowerCase()
                                            .includes(
                                                userSearch.toLowerCase(),
                                            ) &&
                                        !selectedUsers.includes(u.id),
                                )
                                .map((user: any) => (
                                    <div
                                        key={user.id}
                                        className="flex cursor-pointer items-center justify-between border-b border-border/20 p-2 last:border-b-0 hover:bg-muted/50"
                                        onClick={() =>
                                            setSelectedUsers([
                                                ...selectedUsers,
                                                user.id,
                                            ])
                                        }
                                    >
                                        <div className="flex items-center gap-2">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                                                <User className="h-4 w-4 text-primary-foreground" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">
                                                    {user.name}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {user.email}
                                                </p>
                                            </div>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="h-6 w-6 p-0 hover:bg-muted hover:text-muted-foreground"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedUsers([
                                                    ...selectedUsers,
                                                    user.id,
                                                ]);
                                            }}
                                        >
                                            <User className="h-3 w-3" />
                                        </Button>
                                    </div>
                                ))}
                            {allUsers.filter(
                                (u: any) =>
                                    u.id !== auth?.user?.id &&
                                    u.name
                                        .toLowerCase()
                                        .includes(userSearch.toLowerCase()) &&
                                    !selectedUsers.includes(u.id),
                            ).length === 0 &&
                                userSearch && (
                                    <div className="p-4 text-center text-sm text-muted-foreground">
                                        No se encontraron usuarios
                                    </div>
                                )}
                        </div>
                    )}
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Creando...' : 'Crear Evento'}
                </Button>
            </form>

            <DescriptionModal
                isOpen={isDescriptionModalOpen}
                onClose={() => setIsDescriptionModalOpen(false)}
                description={form.descripcion}
                onDescriptionChange={(newDescription: string) =>
                    setForm({ ...form, descripcion: newDescription })
                }
                title="Agregar Descripción del Evento"
            />
        </div>
    );
}
