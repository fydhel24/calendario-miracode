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
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from '@/components/ui/card';
import {
    FileText,
    Edit,
    Calendar,
    Clock,
    Palette,
    ChevronRight,
    Save,
    XCircle,
    Trash2
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

interface EventEditFormProps {
    eventToEdit?: any;
    selectedCalendar?: any;
    onEventUpdated?: (event: any) => void;
    onEventDeleted?: (eventId: string) => void;
    onModeChange?: (mode: string | null) => void;
}

export function EventEditForm({
    eventToEdit,
    selectedCalendar,
    onEventUpdated,
    onEventDeleted,
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
                        .toLocaleString('sv-SE') // Use locale that outputs YYYY-MM-DD HH:mm
                        .replace(' ', 'T')
                        .slice(0, 16)
                    : '',
                fecha_fin: eventToEdit.fecha_fin
                    ? new Date(eventToEdit.fecha_fin)
                        .toLocaleString('sv-SE')
                        .replace(' ', 'T')
                        .slice(0, 16)
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

    const handleDelete = () => {
        if (!eventToEdit || !confirm('¿Estás seguro de que deseas eliminar este evento?')) return;

        setLoading(true);
        fetch(`/eventos/${eventToEdit.id}`, {
            method: 'DELETE',
            headers: {
                'X-CSRF-TOKEN':
                    document
                        .querySelector('meta[name="csrf-token"]')
                        ?.getAttribute('content') || '',
            },
        })
            .then(() => {
                if (onEventDeleted) {
                    onEventDeleted(eventToEdit.id);
                } else {
                    onEventUpdated?.({ id: eventToEdit.id, deleted: true });
                }
                onModeChange?.(null);
            })
            .catch((error) => {
                console.error('Error deleting event:', error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <div className="flex flex-col gap-6 p-6 pb-20">
            <Card className="border-none bg-transparent shadow-none">
                <CardContent className="p-0">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Basic Info Section */}
                        <div className="space-y-5">
                            <div className="flex items-center gap-2 mb-2 text-primary font-bold text-sm uppercase tracking-wider">
                                <FileText className="h-4 w-4" />
                                <span>Detalles del Evento</span>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[13px] font-bold" htmlFor="titulo">Título</Label>
                                <Input
                                    id="titulo"
                                    value={form.titulo}
                                    onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                                    className="h-11 rounded-xl bg-muted/30 border-none shadow-inner focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[13px] font-bold" htmlFor="descripcion">Descripción</Label>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsDescriptionModalOpen(true)}
                                    className="h-11 w-full justify-between rounded-xl border-dashed border-2 hover:border-primary/50 hover:bg-primary/5 transition-all px-4"
                                >
                                    <div className="flex items-center gap-2">
                                        <FileText className="h-4 w-4 text-muted-foreground" />
                                        <span className={form.descripcion ? "font-medium" : "text-muted-foreground font-normal"}>
                                            {form.descripcion ? (form.descripcion.length > 25 ? `${form.descripcion.substring(0, 25)}...` : form.descripcion) : "No hay descripción..."}
                                        </span>
                                    </div>
                                    <ChevronRight className="h-4 w-4 opacity-30" />
                                </Button>
                            </div>
                        </div>

                        {/* Estilo Section (Moved Up) */}
                        <div className="space-y-5">
                            <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-wider">
                                <Palette className="h-4 w-4" />
                                <span>Estilo Visual</span>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[13px] font-bold">Personalización</Label>
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
                            <div className="p-4 rounded-2xl border-2 border-dashed flex items-center justify-center bg-muted/5 border-primary/20">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-2xl flex items-center justify-center text-2xl shadow-lg border border-white/10" style={{ backgroundColor: form.color }}>
                                        {form.emoji}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em]">Vista Previa</span>
                                        <span className="text-[10px] font-medium opacity-50">Así lucirá en el calendario</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Scheduling Section (Moved Down) */}
                        <div className="space-y-5">
                            <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-wider">
                                <Clock className="h-4 w-4" />
                                <span>Programación</span>
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-[13px] font-bold" htmlFor="fecha_inicio">Inicio</Label>
                                    <Input
                                        id="fecha_inicio"
                                        type="datetime-local"
                                        value={form.fecha_inicio}
                                        onChange={(e) => setForm({ ...form, fecha_inicio: e.target.value })}
                                        className="h-11 rounded-xl bg-muted/30 border-none shadow-inner focus:ring-2 focus:ring-primary/20"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[13px] font-bold" htmlFor="fecha_fin">Fin (Opcional)</Label>
                                    <Input
                                        id="fecha_fin"
                                        type="datetime-local"
                                        value={form.fecha_fin}
                                        onChange={(e) => setForm({ ...form, fecha_fin: e.target.value })}
                                        className="h-11 rounded-xl bg-muted/30 border-none shadow-inner focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Submit Actions */}
                        <div className="flex flex-col gap-3 pt-6">
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
                                        <Save className="h-5 w-5" />
                                        <span>Confirmar Cambios</span>
                                    </div>
                                )}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onModeChange?.(null)}
                                className="h-12 rounded-2xl border-2 font-bold px-8 hover:bg-muted transition-all"
                            >
                                <div className="flex items-center gap-2">
                                    <XCircle className="h-5 w-5" />
                                    <span>Cancelar Edición</span>
                                </div>
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
                title="Actualizar Detalles"
            />
        </div>
    );
}
