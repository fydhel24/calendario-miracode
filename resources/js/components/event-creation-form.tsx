import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Clock, MapPin, Palette, Tag } from 'lucide-react';
import { useEffect, useState } from 'react';

interface EventCreationFormProps {
    selectedDate?: string | null;
    selectedCalendar?: any;
    onEventCreated?: (event: any) => void;
    eventToEdit?: any;
    onEventUpdated?: (event: any) => void;
    onModeChange?: (mode: string | null) => void;
}

export function EventCreationForm({
    selectedDate,
    selectedCalendar,
    onEventCreated,
    eventToEdit,
    onEventUpdated,
    onModeChange,
}: EventCreationFormProps) {
    const [form, setForm] = useState({
        titulo: '',
        descripcion: '',
        ubicacion: '',
        prioridad: 'Alta',
        color: '#2563eb',
        fecha_inicio: '',
        fecha_fin: '',
    });
    const [isAllDay, setIsAllDay] = useState(true);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (eventToEdit) {
            setForm({
                titulo: eventToEdit.titulo || '',
                descripcion: eventToEdit.descripcion || '',
                ubicacion: eventToEdit.ubicacion || '',
                prioridad: eventToEdit.prioridad || 'Alta',
                color: eventToEdit.color || '#2563eb',
                fecha_inicio: eventToEdit.fecha_inicio
                    ? new Date(eventToEdit.fecha_inicio)
                          .toISOString()
                          .slice(0, 16)
                    : '',
                fecha_fin: eventToEdit.fecha_fin
                    ? new Date(eventToEdit.fecha_fin).toISOString().slice(0, 16)
                    : '',
            });
            setIsAllDay(!eventToEdit.fecha_fin); // If no end date, assume all day
        } else if (selectedDate) {
            const dateOnly = selectedDate.split('T')[0];
            setForm((prev) => ({
                ...prev,
                fecha_inicio: dateOnly + 'T09:30',
                fecha_fin: dateOnly + 'T18:00',
            }));
        }
    }, [selectedDate, eventToEdit]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCalendar) return;

        setLoading(true);

        const submitData = { ...form };
        if (isAllDay) {
            (submitData as any).fecha_fin = null;
        }

        const csrfToken = document
            .querySelector('meta[name="csrf-token"]')
            ?.getAttribute('content');

        const method = eventToEdit ? 'PATCH' : 'POST';
        const url = eventToEdit
            ? `/eventos/${eventToEdit.id}`
            : `/calendarios/${selectedCalendar.id}/eventos`;

        fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrfToken || '',
            },
            body: JSON.stringify(submitData),
        })
            .then((response) => response.json())
            .then((data) => {
                if (eventToEdit) {
                    onEventUpdated?.(data);
                    onModeChange?.(null); // Go back to details view
                } else {
                    onEventCreated?.(data);
                    // Reset form
                    setForm({
                        titulo: '',
                        descripcion: '',
                        ubicacion: '',
                        prioridad: 'Alta',
                        color: '#2563eb',
                        fecha_inicio: form.fecha_inicio,
                        fecha_fin: form.fecha_fin,
                    });
                    // Keep isAllDay and dates
                }
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error:', error);
                setLoading(false);
            });
    };

    return (
        <div className="space-y-6 p-4">
            <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Crear Nuevo Evento</h3>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Título */}
                <div className="space-y-2">
                    <Label
                        htmlFor="titulo"
                        className="flex items-center gap-2 text-sm font-medium"
                    >
                        <Tag className="h-4 w-4" />
                        Título
                    </Label>
                    <Input
                        id="titulo"
                        value={form.titulo}
                        onChange={(e) =>
                            setForm({ ...form, titulo: e.target.value })
                        }
                        placeholder="Título del evento"
                        className="text-base"
                        required
                    />
                </div>

                {/* Fecha y Hora */}
                <div className="space-y-3">
                    <Label className="flex items-center gap-2 text-sm font-medium">
                        <Clock className="h-4 w-4" />
                        Fecha y Hora
                    </Label>

                    {/* All Day Checkbox */}
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="all-day"
                            checked={isAllDay}
                            onCheckedChange={(checked) => {
                                setIsAllDay(!!checked);
                                if (checked) {
                                    // Clear time part for all-day
                                    const dateOnly =
                                        form.fecha_inicio.split('T')[0];
                                    setForm((prev) => ({
                                        ...prev,
                                        fecha_inicio: dateOnly,
                                        fecha_fin: dateOnly,
                                    }));
                                }
                            }}
                        />
                        <Label htmlFor="all-day" className="text-sm">
                            Todo el día
                        </Label>
                    </div>

                    {/* Fecha Inicio */}
                    <div>
                        <Label
                            htmlFor="fecha_inicio"
                            className="text-xs text-muted-foreground"
                        >
                            Inicio
                        </Label>
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

                    {/* Fecha Fin */}
                    <div>
                        <Label
                            htmlFor="fecha_fin"
                            className="text-xs text-muted-foreground"
                        >
                            Fin (Opcional)
                        </Label>
                        <Input
                            id="fecha_fin"
                            type="datetime-local"
                            value={form.fecha_fin}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    fecha_fin: e.target.value,
                                })
                            }
                        />
                    </div>
                </div>

                {/* Ubicación */}
                <div className="space-y-2">
                    <Label
                        htmlFor="ubicacion"
                        className="flex items-center gap-2 text-sm font-medium"
                    >
                        <MapPin className="h-4 w-4" />
                        Ubicación
                    </Label>
                    <Input
                        id="ubicacion"
                        value={form.ubicacion}
                        onChange={(e) =>
                            setForm({ ...form, ubicacion: e.target.value })
                        }
                        placeholder="Dónde se realizará"
                    />
                </div>

                {/* Descripción */}
                <div className="space-y-2">
                    <Label
                        htmlFor="descripcion"
                        className="text-sm font-medium"
                    >
                        Descripción
                    </Label>
                    <Textarea
                        id="descripcion"
                        value={form.descripcion}
                        onChange={(e) =>
                            setForm({ ...form, descripcion: e.target.value })
                        }
                        placeholder="Detalles adicionales del evento"
                        rows={3}
                    />
                </div>

                {/* Color */}
                <div className="space-y-2">
                    <Label
                        htmlFor="color"
                        className="flex items-center gap-2 text-sm font-medium"
                    >
                        <Palette className="h-4 w-4" />
                        Color
                    </Label>
                    <div className="flex items-center gap-2">
                        <Input
                            id="color"
                            type="color"
                            value={form.color}
                            onChange={(e) =>
                                setForm({ ...form, color: e.target.value })
                            }
                            className="h-10 w-12 rounded border p-1"
                        />
                        <Input
                            value={form.color}
                            onChange={(e) =>
                                setForm({ ...form, color: e.target.value })
                            }
                            placeholder="#2563eb"
                            className="flex-1"
                        />
                    </div>
                </div>

                {/* Prioridad */}
                <div className="space-y-2">
                    <Label htmlFor="prioridad" className="text-sm font-medium">
                        Prioridad
                    </Label>
                    <Select
                        value={form.prioridad}
                        onValueChange={(value: string) =>
                            setForm({ ...form, prioridad: value })
                        }
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Selecciona prioridad" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Alta">Alta</SelectItem>
                            <SelectItem value="Media">Media</SelectItem>
                            <SelectItem value="Baja">Baja</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                    {loading
                        ? eventToEdit
                            ? 'Actualizando...'
                            : 'Creando...'
                        : eventToEdit
                          ? 'Actualizar Evento'
                          : 'Crear Evento'}
                </Button>
            </form>
        </div>
    );
}
