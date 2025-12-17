import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { router } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useState } from 'react';

interface CreateCalendarModalProps {
    onCalendarCreated?: (calendar: any) => void;
}

function CreateCalendarModal({ onCalendarCreated }: CreateCalendarModalProps) {
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState({
        nombre: '',
        descripcion: '',
        template: '',
        estado: 'activo',
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        router.post('/calendarios', form, {
            onSuccess: () => {
                setOpen(false);
                setForm({
                    nombre: '',
                    descripcion: '',
                    template: '',
                    estado: 'activo',
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
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 hover:bg-sidebar-accent"
                    title="Crear calendario"
                >
                    <Plus className="h-3 w-3" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Crear Nuevo Calendario</DialogTitle>
                    <DialogDescription>
                        Crea un nuevo calendario para organizar tus eventos.
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
                                placeholder="Opcional"
                                value={form.descripcion}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        descripcion: e.target.value,
                                    })
                                }
                                className="col-span-3"
                                rows={3}
                            />
                        </div>

                        <div
                            className="grid grid-cols-4 items-center gap-4"
                            style={{ display: 'none' }}
                        >
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
                            {loading ? 'Creando...' : 'Crear Calendario'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default CreateCalendarModal;
