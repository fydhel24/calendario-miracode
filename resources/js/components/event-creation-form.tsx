import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

interface EventCreationFormProps {
    selectedDate: string;
    selectedCalendar: any;
    onEventCreated?: (event: any) => void;
}

export function EventCreationForm({ selectedDate, selectedCalendar, onEventCreated }: EventCreationFormProps) {
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
        if (selectedDate) {
            setForm(prev => ({
                ...prev,
                fecha_inicio: selectedDate,
            }));
        }
    }, [selectedDate]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCalendar) return;

        setLoading(true);

        router.post(`/calendarios/${selectedCalendar.id}/eventos`, form, {
            onSuccess: (response) => {
                onEventCreated?.(response);
                // Reset form
                setForm({
                    titulo: '',
                    descripcion: '',
                    ubicacion: '',
                    prioridad: '',
                    color: '#2563eb',
                    fecha_inicio: selectedDate,
                    fecha_fin: '',
                });
            },
            onError: () => {
                setLoading(false);
            },
            onFinish: () => {
                setLoading(false);
            },
        });
    };

    return (
        <div className="p-4 space-y-4">
            <h3 className="text-lg font-semibold mb-4">Crear Nuevo Evento</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <Label htmlFor="titulo">Título</Label>
                    <Input
                        id="titulo"
                        value={form.titulo}
                        onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                        placeholder="Título del evento"
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="descripcion">Descripción</Label>
                    <Textarea
                        id="descripcion"
                        value={form.descripcion}
                        onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                        placeholder="Descripción del evento"
                        rows={3}
                    />
                </div>
                <div>
                    <Label htmlFor="ubicacion">Ubicación</Label>
                    <Input
                        id="ubicacion"
                        value={form.ubicacion}
                        onChange={(e) => setForm({ ...form, ubicacion: e.target.value })}
                        placeholder="Ubicación"
                    />
                </div>
                <div>
                    <Label htmlFor="prioridad">Prioridad</Label>
                    <Input
                        id="prioridad"
                        value={form.prioridad}
                        onChange={(e) => setForm({ ...form, prioridad: e.target.value })}
                        placeholder="Prioridad"
                    />
                </div>
                <div>
                    <Label htmlFor="color">Color</Label>
                    <Input
                        id="color"
                        type="color"
                        value={form.color}
                        onChange={(e) => setForm({ ...form, color: e.target.value })}
                    />
                </div>
                <div>
                    <Label htmlFor="fecha_inicio">Fecha y Hora de Inicio</Label>
                    <Input
                        id="fecha_inicio"
                        type="datetime-local"
                        value={form.fecha_inicio}
                        onChange={(e) => setForm({ ...form, fecha_inicio: e.target.value })}
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="fecha_fin">Fecha y Hora de Fin (Opcional)</Label>
                    <Input
                        id="fecha_fin"
                        type="datetime-local"
                        value={form.fecha_fin}
                        onChange={(e) => setForm({ ...form, fecha_fin: e.target.value })}
                    />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Creando...' : 'Crear Evento'}
                </Button>
            </form>
        </div>
    );
}