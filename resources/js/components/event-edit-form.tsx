import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useEffect, useState } from 'react';

interface EventEditFormProps {
    eventToEdit?: any;
    selectedCalendar?: any;
    onEventUpdated?: (event: any) => void;
    onModeChange?: (mode: string | null) => void;
}

export function EventEditForm({
    eventToEdit,
    selectedCalendar,
    onEventUpdated,
    onModeChange,
}: EventEditFormProps) {
    const [form, setForm] = useState({
        titulo: '',
        descripcion: '',
        ubicacion: '',
        prioridad: '',
        color: '#2563eb',
        fecha_inicio: '',
        fecha_fin: '',
    });
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
        }
    }, [eventToEdit]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!eventToEdit) return;

        setLoading(true);

        fetch(`/eventos/${eventToEdit.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN':
                    document
                        .querySelector('meta[name="csrf-token"]')
                        ?.getAttribute('content') || '',
            },
            body: JSON.stringify(form),
        })
            .then((response) => response.json())
            .then((updatedEvent) => {
                onEventUpdated?.(updatedEvent);
                onModeChange?.(null); // Go back to details view
            })
            .catch((error) => {
                console.error('Error updating event:', error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <div className="space-y-4 p-4">
            <h3 className="mb-4 text-lg font-semibold">Editar Evento</h3>
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
                <div className="flex gap-2">
                    <Button type="submit" disabled={loading} className="flex-1">
                        {loading ? 'Guardando...' : 'Guardar Cambios'}
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onModeChange?.(null)}
                    >
                        Cancelar
                    </Button>
                </div>
            </form>
        </div>
    );
}
