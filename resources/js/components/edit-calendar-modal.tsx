import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useEffect, useState } from 'react';

interface EditCalendarModalProps {
    calendar?: any;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onCalendarUpdated?: (calendar: any) => void;
}

function EditCalendarModal({
    calendar,
    open,
    onOpenChange,
    onCalendarUpdated,
}: EditCalendarModalProps) {
    const [form, setForm] = useState({
        nombre: '',
        descripcion: '',
        template: '',
        estado: 'activo',
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (calendar) {
            setForm({
                nombre: calendar.nombre || '',
                descripcion: calendar.descripcion || '',
                template: calendar.template || '',
                estado: calendar.estado || 'activo',
            });
        }
    }, [calendar]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!calendar) return;

        setLoading(true);

        try {
            const csrfToken = document
                .querySelector('meta[name="csrf-token"]')
                ?.getAttribute('content');
            const response = await fetch(`/calendarios/${calendar.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken || '',
                },
                body: JSON.stringify(form),
            });

            if (response.ok) {
                const updatedCalendar = await response.json();
                onOpenChange(false);
                onCalendarUpdated?.(updatedCalendar);
            } else {
                console.error('Error updating calendar');
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Editar Calendario</DialogTitle>
                    <DialogDescription>
                        Modifica los detalles del calendario.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="nombre" className="text-right">
                                Nombre
                            </Label>
                            <Input
                                id="nombre"
                                value={form.nombre}
                                onChange={(e) =>
                                    setForm({ ...form, nombre: e.target.value })
                                }
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="descripcion" className="text-right">
                                Descripción
                            </Label>
                            <Textarea
                                id="descripcion"
                                value={form.descripcion}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        descripcion: e.target.value,
                                    })
                                }
                                className="col-span-3"
                                placeholder='Opcional'
                                rows={3}
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4" style={{ display: 'none' }}>
                            <Label htmlFor="template" className="text-right">
                                Plantilla
                            </Label>
                            <Input
                                id="template"
                                value={form.template}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        template: e.target.value,
                                    })
                                }
                                className="col-span-3"
                                placeholder="Opcional"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4" style={{ display: 'none' }}>
                            <Label htmlFor="estado" className="text-right">
                                Estado
                            </Label>
                            <Input
                                id="estado"
                                value={form.estado}
                                onChange={(e) =>
                                    setForm({ ...form, estado: e.target.value })
                                }
                                className="col-span-3"
                                placeholder="activo"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Guardando...' : 'Guardar Cambios'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default EditCalendarModal;
