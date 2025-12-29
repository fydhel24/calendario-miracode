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
import { FileText } from 'lucide-react';
import { useEffect, useState } from 'react';

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
        emoji: '📱',
        fecha_inicio: '',
        fecha_fin: '',
    });
    const [loading, setLoading] = useState(false);
    const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);

    useEffect(() => {
        if (eventToEdit) {
            setForm({
                titulo: eventToEdit.titulo || '',
                descripcion: eventToEdit.descripcion || '',
                ubicacion: eventToEdit.ubicacion || '',
                prioridad: eventToEdit.prioridad || 'Alta',
                color: eventToEdit.color || '#2563eb',
                emoji: eventToEdit.emoji || '📱',
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
                    <Label htmlFor="descripcion">Descripción (Opcional)</Label>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsDescriptionModalOpen(true)}
                        className="w-full justify-start text-left font-normal"
                    >
                        <FileText className="mr-2 h-4 w-4" />
                        {form.descripcion ? (
                            <span className="truncate">
                                {form.descripcion.length > 30
                                    ? `${form.descripcion.substring(0, 30)}...`
                                    : form.descripcion}
                            </span>
                        ) : (
                            <span className="text-muted-foreground">
                                Haz clic para editar la descripción
                            </span>
                        )}
                    </Button>
                </div>
                <div>
                    <Label htmlFor="color">Color</Label>
                    <Select
                        value={form.color}
                        onValueChange={(value) => {
                            const selectedColor = eventColors.find(
                                (c) => c.value === value,
                            );
                            setForm({
                                ...form,
                                color: value,
                                emoji: selectedColor?.emoji || '📱',
                            });
                        }}
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
                                        {color.emoji} {color.name}
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

            <DescriptionModal
                isOpen={isDescriptionModalOpen}
                onClose={() => setIsDescriptionModalOpen(false)}
                description={form.descripcion}
                onDescriptionChange={(newDescription: string) =>
                    setForm({ ...form, descripcion: newDescription })
                }
                title="Editar Descripción del Evento"
            />
        </div>
    );
}
