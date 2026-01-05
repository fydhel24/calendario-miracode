import { DescriptionModal } from '@/components/description-modal';
import { DateTimePicker } from '@/components/ui/date-time-picker';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
import { useEffect, useState, useMemo } from 'react';
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
    // Social Media Icons
    { name: 'Facebook', value: '#1877F2', emoji: '/icon/icons8-facebook.svg' },
    { name: 'Instagram', value: '#E1306C', emoji: '/icon/icons8-instagram.svg' },
    { name: 'TikTok', value: '#000000', emoji: '/icon/icons8-tiktok.svg' },
    { name: 'WhatsApp', value: '#25D366', emoji: '/icon/icons8-whatsapp.svg' },
    { name: 'YouTube', value: '#FF0000', emoji: '/icon/icons8-youtube.svg' },
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
    const baseEventColors = [
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
        // Social Media Icons
        { name: 'Facebook', value: '#1877F2', emoji: '/icon/icons8-facebook.svg' },
        { name: 'Instagram', value: '#E1306C', emoji: '/icon/icons8-instagram.svg' },
        { name: 'TikTok', value: '#000000', emoji: '/icon/icons8-tiktok.svg' },
        { name: 'WhatsApp', value: '#25D366', emoji: '/icon/icons8-whatsapp.svg' },
        { name: 'YouTube', value: '#FF0000', emoji: '/icon/icons8-youtube.svg' },
    ];

    const [form, setForm] = useState(() => {
        if (eventToEdit) {
            return {
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
            };
        }
        return {
            titulo: '',
            descripcion: '',
            ubicacion: '',
            prioridad: 'Alta',
            color: '#2563eb',
            emoji: '📱',
            fecha_inicio: '',
            fecha_fin: '',
        };
    });
    const [loading, setLoading] = useState(false);
    const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);

    const eventColors = useMemo(() => {
        if (eventToEdit && eventToEdit.color) {
            const hasColor = baseEventColors.some(c => c.value === eventToEdit.color);
            if (!hasColor) {
                return [...baseEventColors, {
                    name: 'Personalizado',
                    value: eventToEdit.color,
                    emoji: eventToEdit.emoji || '📅'
                }];
            }
        }
        return baseEventColors;
    }, [eventToEdit]);

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
                'Accept': 'application/json',
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
                        {/* 1. Basic Info Section */}
                        <div className="space-y-5">
                            <div className="flex items-center gap-2 mb-2 text-primary font-bold text-sm uppercase tracking-wider">
                                <FileText className="h-4 w-4" />
                                <span>Información Principal</span>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[13px] font-bold" htmlFor="titulo">Título</Label>
                                <Textarea
                                    id="titulo"
                                    value={form.titulo}
                                    onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                                    className="min-h-[44px] h-auto rounded-xl bg-muted/30 border-none shadow-inner focus:ring-2 focus:ring-primary/20 transition-all font-medium text-lg py-2 break-all"
                                    required
                                />
                            </div>
                        </div>

                        {/* 2. Description Section */}
                        <div className="space-y-2">
                            <Label className="text-[13px] font-bold" htmlFor="descripcion">Descripción / Notas</Label>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsDescriptionModalOpen(true)}
                                className="h-auto min-h-11 w-full justify-between rounded-xl border-dashed border-2 hover:border-primary/50 hover:bg-primary/5 transition-all px-4 py-2"
                            >
                                <div className="flex items-center gap-2 text-left min-w-0 flex-1">
                                    <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                    <span className={cn(
                                        "line-clamp-[7] whitespace-pre-wrap break-all",
                                        form.descripcion ? "font-medium" : "text-muted-foreground font-normal"
                                    )}>
                                        {form.descripcion || "Agregar detalles..."}
                                    </span>
                                </div>
                                <ChevronRight className="h-4 w-4 opacity-30 flex-shrink-0" />
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
                                        <SelectValue>
                                            {(() => {
                                                const selected = eventColors.find(c => c.value === form.color);
                                                if (selected) {
                                                    return (
                                                        <div className="flex items-center gap-2">
                                                            {selected.emoji.includes('.svg') ? (
                                                                <img src={selected.emoji} alt={selected.name} className="h-4 w-4 object-contain" />
                                                            ) : (
                                                                <span className="text-sm">{selected.emoji}</span>
                                                            )}
                                                            <span>{selected.name}</span>
                                                        </div>
                                                    );
                                                }
                                                return form.color || "Seleccionar color y tema";
                                            })()}
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border-border/50 shadow-2xl">
                                        {eventColors.map((color) => (
                                            <SelectItem key={color.value} value={color.value} className="rounded-lg m-1">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-5 w-5 rounded-full shadow-sm" style={{ backgroundColor: color.value }} />
                                                    {color.emoji.includes('.svg') ? (
                                                        <img src={color.emoji} alt={color.name} className="h-5 w-5 object-contain" />
                                                    ) : (
                                                        <span className="text-lg">{color.emoji}</span>
                                                    )}
                                                    <span className="font-medium">{color.name}</span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* 4. Scheduling Section */}
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
