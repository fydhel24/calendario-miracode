import { DescriptionModal } from '@/components/description-modal';
import { DateTimePicker } from '@/components/ui/date-time-picker';
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
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from '@/components/ui/card';
import {
    FileText,
    Search,
    User,
    X,
    Calendar,
    Clock,
    Palette,
    MapPin,
    Users,
    ChevronRight,
    PlusCircle
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

const eventColors = [
    { name: 'Azul', value: '#2563eb', emoji: '📱' },
    { name: 'Rojo', value: '#dc2626', emoji: '🔥' },
    { name: 'Amarillo', value: '#eab308', emoji: '💡' },
    { name: 'Verde', value: '#16a34a', emoji: '📈' },
    { name: 'Celeste', value: '#06b6d4', emoji: '🌐' },
    { name: 'Violeta', value: '#9333ea', emoji: '🎯' },
    { name: 'Rosado', value: '#ec4899', emoji: '❤️' },
    { name: 'Naranja', value: '#ea580c', emoji: '🚀' },
    { name: 'Café', value: '#8b4513', emoji: '☕' },
    { name: 'Marrón', value: '#92400e', emoji: '🏆' },
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
        emoji: '📱',
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
        if (selectedCalendars.length > 0) {
            setSelectedCalendarId(selectedCalendars[0].id.toString());
        }
    }, [selectedCalendars]);

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
                    emoji: '📱',
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
        <div className="flex flex-col gap-6 p-2 pb-20 overflow-y-auto max-h-[85vh] scrollbar-thin">
            <Card className="border-none bg-transparent shadow-none">
                <CardHeader className="px-0 pt-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-primary/10 text-primary">
                            <PlusCircle className="h-6 w-6" />
                        </div>
                        <div>
                            <CardTitle className="text-2xl font-bold tracking-tight">Nuevo Evento</CardTitle>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="px-0 space-y-6">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* 1. Basic Info Section */}
                        <div className="space-y-5">
                            <div className="flex items-center gap-2 mb-2 text-primary font-bold text-sm uppercase tracking-wider">
                                <FileText className="h-4 w-4" />
                                <span>Información Principal</span>
                            </div>

                            {selectedCalendars.length > 1 && (
                                <div className="space-y-2">
                                    <Label className="text-[13px] font-bold" htmlFor="calendar">Calendario Destino</Label>
                                    <Select value={selectedCalendarId} onValueChange={setSelectedCalendarId}>
                                        <SelectTrigger className="h-11 rounded-xl bg-muted/30 border-none shadow-inner focus:ring-2 focus:ring-primary/20 transition-all">
                                            <SelectValue placeholder="Selecciona un calendario" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl border-border/50 shadow-2xl">
                                            {selectedCalendars
                                                .filter((calendar) =>
                                                    calendar.users?.some(
                                                        (u: any) =>
                                                            u.id === auth?.user?.id &&
                                                            u.pivot?.tipo_user === 'owner',
                                                    ),
                                                )
                                                .map((calendar) => (
                                                    <SelectItem key={calendar.id} value={calendar.id.toString()} className="rounded-lg m-1">
                                                        <div className="flex items-center gap-2">
                                                            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: calendar.template?.color || 'gray' }} />
                                                            {calendar.nombre}
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label className="text-[13px] font-bold" htmlFor="titulo">Título del Evento</Label>
                                <Input
                                    id="titulo"
                                    value={form.titulo}
                                    onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                                    placeholder="Ej: Reunión de Equipo Nexus"
                                    className="h-11 rounded-xl bg-muted/30 border-none shadow-inner focus:ring-2 focus:ring-primary/20 transition-all font-medium text-lg"
                                    required
                                />
                            </div>
                        </div>

                        {/* 2. Scheduling Section */}
                        <div className="space-y-2">
                            <Label className="text-[13px] font-bold" htmlFor="descripcion">Descripción / Notas</Label>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsDescriptionModalOpen(true)}
                                className="h-11 w-full justify-between rounded-xl border-dashed border-2 hover:border-primary/50 hover:bg-primary/5 transition-all px-4"
                            >
                                <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-muted-foreground" />
                                    <span className={form.descripcion ? "font-medium" : "text-muted-foreground font-normal"}>
                                        {form.descripcion ? (form.descripcion.length > 30 ? `${form.descripcion.substring(0, 30)}...` : form.descripcion) : "Agregar detalles adicionales..."}
                                    </span>
                                </div>
                                <ChevronRight className="h-4 w-4 opacity-30" />
                            </Button>
                        </div>

                        {/* 3. Appearance Section */}
                        <div className="space-y-5">
                                <div className="space-y-2">
                                    <Label className="text-[13px] font-bold">Color y Tema</Label>
                                    <Select
                                        value={form.color}
                                        onValueChange={(value) => {
                                            const selectedColor = eventColors.find((c) => c.value === value);
                                            setForm({ ...form, color: value, emoji: selectedColor?.emoji || '📱' });
                                        }}
                                    >
                                        <SelectTrigger className="h-11 rounded-xl bg-muted/30 border-none shadow-inner transition-all">
                                            <SelectValue placeholder="Color del evento" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl border-border/50 shadow-2xl">
                                            {eventColors.map((color) => (
                                                <SelectItem key={color.value} value={color.value} className="rounded-lg m-1">
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-5 w-5 rounded-full shadow-sm" style={{ backgroundColor: color.value }} />
                                                        <span className="text-lg">{color.emoji}</span>
                                                        <span className="font-medium">{color.name}</span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                              

                            </div>
                        </div>

                        {/* 4. Description Section */}


                        {/* 5. Invites Section */}
                        <div className="space-y-5">
                            <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-wider">
                                <Users className="h-4 w-4" />
                                <span>Invitados</span>
                            </div>

                            <div className="relative group">
                                <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 transform text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <Input
                                    type="text"
                                    placeholder="Buscar por nombre o correo..."
                                    value={userSearch}
                                    onChange={(e) => setUserSearch(e.target.value)}
                                    className="h-12 pl-12 rounded-2xl bg-muted/30 border-none shadow-inner focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/50"
                                />
                            </div>

                            {userSearch && (
                                <div className="rounded-2xl border border-border/50 bg-background/50 backdrop-blur-md overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300 shadow-2xl">
                                    <div className="max-h-52 overflow-y-auto scrollbar-thin">
                                        {allUsers
                                            .filter((u: any) =>
                                                u.id !== auth?.user?.id &&
                                                (u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase())) &&
                                                !selectedUsers.includes(u.id)
                                            )
                                            .map((user: any) => (
                                                <div
                                                    key={user.id}
                                                    className="flex items-center justify-between p-3 border-b border-border/20 last:border-0 hover:bg-primary/5 cursor-pointer transition-colors"
                                                    onClick={() => { setSelectedUsers([...selectedUsers, user.id]); setUserSearch(''); }}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                                                            <User className="h-4 w-4 text-primary" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold">{user.name}</p>
                                                            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tight">{user.email}</p>
                                                        </div>
                                                    </div>
                                                    <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full hover:bg-primary hover:text-white transition-all">
                                                        <PlusCircle className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            )}

                            {selectedUsers.length > 0 && (
                                <div className="space-y-3 p-4 rounded-2xl bg-muted/10 border border-border/40">
                                    <Label className="text-[11px] font-extrabold uppercase tracking-widest text-muted-foreground">Usuarios Seleccionados ({selectedUsers.length})</Label>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedUsers.map((userId) => {
                                            const user = allUsers.find((u: any) => u.id === userId);
                                            return user ? (
                                                <div key={userId} className="detail-card flex items-center gap-2 group !mb-0 !p-1.5 pr-3">
                                                    <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center">
                                                        <User className="h-3 w-3 text-primary" />
                                                    </div>
                                                    <span className="text-xs font-bold">{user.name}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => setSelectedUsers(selectedUsers.filter(id => id !== userId))}
                                                        className="h-5 w-5 rounded-full bg-muted flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-destructive hover:text-white"
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </button>
                                                </div>
                                            ) : null;
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="space-y-5">
                            <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-wider">
                                <Clock className="h-4 w-4" />
                                <span>Fecha y Hora</span>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[13px] font-bold">Inicio</Label>
                                <DateTimePicker
                                    date={form.fecha_inicio ? new Date(form.fecha_inicio) : undefined}
                                    setDate={(date) => setForm({
                                        ...form,
                                        fecha_inicio: date ? date.toISOString() : ''
                                    })}
                                    className="h-11 rounded-xl bg-muted/30 border-none shadow-inner"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[13px] font-bold">Fin (Opcional)</Label>
                                <DateTimePicker
                                    date={form.fecha_fin ? new Date(form.fecha_fin) : undefined}
                                    setDate={(date) => setForm({
                                        ...form,
                                        fecha_fin: date ? date.toISOString() : ''
                                    })}
                                    className="h-11 rounded-xl bg-muted/30 border-none shadow-inner"
                                />
                            </div>
                        </div>
                        {/* Submit Actions */}
                        <div className="pt-4">
                            <Button
                                type="submit"
                                className="h-12 w-full rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold shadow-lg shadow-primary/20 transition-all hover:scale-[1.01] active:scale-[0.98]"
                                disabled={loading}
                            >
                                {loading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        <span>Procesando...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <PlusCircle className="h-5 w-5" />
                                        <span>Crear Evento Oficial</span>
                                    </div>
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            <DescriptionModal
                isOpen={isDescriptionModalOpen}
                onClose={() => setIsDescriptionModalOpen(false)}
                description={form.descripcion}
                onDescriptionChange={(newDescription: string) =>
                    setForm({ ...form, descripcion: newDescription })
                }
                title="Detalles del Evento"
            />
        </div >
    );
}
