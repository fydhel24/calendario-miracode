import { EventCreateForm } from '@/components/event-create-form';
import { EventEditForm } from '@/components/event-edit-form';
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
import { Bell, ChevronLeft, Clock, Plus, Settings, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';

interface MenuOption {
    id: string;
    label: string;
    icon: React.ComponentType<any>;
    content: React.ReactNode;
}

interface RightMenuProps {
    className?: string;
    onToggle?: () => void;
    isExpanded?: boolean;
    onExpansionChange?: (expanded: boolean) => void;
    selectedDate?: string | null;
    selectedEvent?: any;
    selectedCalendar?: any;
    onEventCreated?: (event: any) => void;
    onEventUpdated?: (event: any) => void;
    onEventDeleted?: (eventId: string) => void;
    onModeChange?: (mode: string | null) => void;
    onDateClear?: () => void;
}

export function RightMenu({
    className,
    onToggle,
    isExpanded: externalIsExpanded,
    onExpansionChange,
    selectedDate,
    selectedEvent,
    selectedCalendar,
    onEventCreated,
    onEventUpdated,
    onEventDeleted,
    onModeChange,
    onDateClear,
}: RightMenuProps) {
    const { auth } = usePage().props as any;
    const [internalActiveOption, setInternalActiveOption] = useState<
        string | null
    >(null);

    const isOwner = selectedCalendar?.users?.some((u: any) => u.id === auth.user.id && u.pivot?.tipo_user === 'owner');

    // Auto-select new-event when date is selected
    useEffect(() => {
        if (selectedDate) {
            setInternalActiveOption('new-event');
            if (onExpansionChange) onExpansionChange(true);
        }
    }, [selectedDate, onExpansionChange]);

    // Reset to details when event is selected
    useEffect(() => {
        if (selectedEvent) {
            setInternalActiveOption(null);
        }
    }, [selectedEvent]);

    // Fetch users for invite
    useEffect(() => {
        setLoadingUsers(true);
        fetch('/users')
            .then((response) => response.json())
            .then((data) => setUsers(data))
            .catch((error) => console.error('Error fetching users:', error))
            .finally(() => setLoadingUsers(false));
    }, []);
    const [eventForm, setEventForm] = useState({
        titulo: '',
        descripcion: '',
        ubicacion: '',
        prioridad: '',
        color: '#2563eb',
        fecha_inicio: '',
        fecha_fin: '',
    });
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState<any[]>([]);
    const [loadingUsers, setLoadingUsers] = useState(false);

    // Use internal state for active option
    const activeOption = internalActiveOption;

    // Determine if menu should show expanded content
    // If external state is provided, use it; otherwise use internal active option
    const shouldShowExpandedContent =
        externalIsExpanded !== undefined
            ? externalIsExpanded
            : activeOption !== null;

    const menuOptions: MenuOption[] = [
        ...(isOwner ? [{
            id: 'new-event',
            label: 'Nuevo Evento',
            icon: Plus,
            content: (
                <EventCreateForm
                    selectedDate={selectedDate ?? undefined}
                    selectedCalendar={selectedCalendar}
                    onEventCreated={onEventCreated}
                />
            ),
        }] : []),
        {
            id: 'reminder',
            label: 'Recordatorio',
            icon: Bell,
            content: (
                <div className="space-y-4 p-4">
                    <h3 className="mb-4 text-lg font-semibold">
                        Configurar Recordatorio
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="reminder-time">
                                Tiempo antes del evento
                            </Label>
                            <Select>
                                <SelectTrigger className="mt-1">
                                    <SelectValue placeholder="Selecciona el tiempo" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="5">5 minutos</SelectItem>
                                    <SelectItem value="15">
                                        15 minutos
                                    </SelectItem>
                                    <SelectItem value="30">
                                        30 minutos
                                    </SelectItem>
                                    <SelectItem value="60">1 hora</SelectItem>
                                    <SelectItem value="1440">1 día</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="reminder-type">
                                Tipo de notificación
                            </Label>
                            <Select>
                                <SelectTrigger className="mt-1">
                                    <SelectValue placeholder="Selecciona el tipo" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="push">
                                        Notificación push
                                    </SelectItem>
                                    <SelectItem value="email">Email</SelectItem>
                                    <SelectItem value="sms">SMS</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button className="mt-6 w-full">Configurar</Button>
                    </div>
                </div>
            ),
        },
        {
            id: 'members',
            label: 'Miembros',
            icon: Users,
            content: (
                <div className="space-y-4 p-4">
                    <h3 className="mb-4 text-lg font-semibold">
                        Miembros del Calendario
                    </h3>
                    <div className="space-y-3">
                        {selectedCalendar?.users && selectedCalendar.users.length > 0 ? (
                            selectedCalendar.users.map((user: any) => (
                                <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                                    <div>
                                        <p className="font-medium">{user.name}</p>
                                        <p className="text-sm text-muted-foreground">{user.email}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                                            {user.pivot?.tipo_user || 'viewer'}
                                        </span>
                                        {isOwner && user.pivot?.tipo_user !== 'owner' && (
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => {
                                                    if (confirm(`¿Estás seguro de que quieres remover a ${user.name}?`)) {
                                                        fetch(`/calendarios/${selectedCalendar.id}/remove-user/${user.id}`, {
                                                            method: 'DELETE',
                                                            headers: {
                                                                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                                                            },
                                                        })
                                                            .then(() => {
                                                                alert('Usuario removido');
                                                                // Reload or update
                                                                window.location.reload();
                                                            })
                                                            .catch((error) => {
                                                                console.error('Error removing user:', error);
                                                            });
                                                    }
                                                }}
                                            >
                                                Remover
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-muted-foreground">No hay miembros</p>
                        )}
                    </div>
                </div>
            ),
        },
        ...(isOwner ? [{
            id: 'invite',
            label: 'Invitar',
            icon: Users,
            content: (
                <div className="space-y-4 p-4">
                    <h3 className="mb-4 text-lg font-semibold">
                        Invitar Participantes
                    </h3>
                    <form
                        className="space-y-4"
                        onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.target as HTMLFormElement);
                            const user_id = formData.get('user_id') as string;
                            const tipo_user = formData.get('tipo_user') as string;
                            if (!user_id || !tipo_user) return;

                            fetch(`/calendarios/${selectedCalendar?.id}/invite`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                                },
                                body: JSON.stringify({ user_id: parseInt(user_id), tipo_user }),
                            })
                                .then((response) => {
                                    if (response.ok) {
                                        alert('Usuario agregado exitosamente');
                                        (e.target as HTMLFormElement).reset();
                                        // Reload to update members list
                                        window.location.reload();
                                    } else {
                                        return response.json().then((data) => {
                                            throw new Error(data.error || 'Error al agregar usuario');
                                        });
                                    }
                                })
                                .catch((error) => {
                                    alert(error.message);
                                });
                        }}
                    >
                        <div>
                            <Label htmlFor="invite-user">Usuario</Label>
                            <Select name="user_id" required disabled={loadingUsers}>
                                <SelectTrigger className="mt-1">
                                    <SelectValue placeholder={loadingUsers ? "Cargando usuarios..." : "Selecciona un usuario"} />
                                </SelectTrigger>
                                <SelectContent>
                                    {users.map((user) => (
                                        <SelectItem key={user.id} value={user.id.toString()}>
                                            {user.name} ({user.email})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="invite-tipo">Rol</Label>
                            <Select name="tipo_user" required>
                                <SelectTrigger className="mt-1">
                                    <SelectValue placeholder="Selecciona el rol" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="viewer">Espectador</SelectItem>
                                    <SelectItem value="editor">Editor</SelectItem>
                                    <SelectItem value="owner">Propietario</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button type="submit" className="mt-6 w-full" disabled={loadingUsers}>
                            Agregar Usuario
                        </Button>
                    </form>
                </div>
            ),
        }] : []),
        {
            id: 'settings',
            label: 'Configuración',
            icon: Settings,
            content: (
                <div className="space-y-4 p-4">
                    <h3 className="mb-4 text-lg font-semibold">
                        Configuración
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="notifications">
                                Notificaciones
                            </Label>
                            <Checkbox id="notifications" />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="dark-mode">Modo oscuro</Label>
                            <Checkbox id="dark-mode" />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="sync">Sincronización</Label>
                            <Checkbox id="sync" defaultChecked />
                        </div>
                        <Button className="mt-6 w-full">Guardar</Button>
                    </div>
                </div>
            ),
        },
    ];

    const handleOptionClick = (optionId: string) => {
        if (internalActiveOption === optionId) {
            // Si ya está seleccionado, deseleccionar para volver a vista de iconos
            setInternalActiveOption(null);
            if (onExpansionChange) onExpansionChange(false);
        } else {
            // Si no está seleccionado, mostrar contenido
            setInternalActiveOption(optionId);
            if (onExpansionChange) onExpansionChange(true);
        }
    };

    const handleBackToIcons = () => {
        setInternalActiveOption(null);
        if (onExpansionChange) onExpansionChange(false);
    };

    return (
        <div
            className={`flex h-full border-l border-sidebar-border bg-sidebar ${className}`}
        >
            {/* Estructura expandible: siempre los iconos + contenido cuando está activo */}
            <div
                className={`flex h-full transition-all duration-300 ease-in-out ${
                    shouldShowExpandedContent ? 'w-96' : 'w-16'
                }`}
            >
                {/* Iconos del menú - siempre visible */}
                <div className="flex w-16 flex-col border-r border-sidebar-border bg-gradient-to-b from-sidebar to-sidebar/95">
                    <div className="flex flex-col space-y-2 p-2">
                        {menuOptions.map((option) => {
                            const Icon = option.icon;
                            return (
                                <Button
                                    key={option.id}
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleOptionClick(option.id)}
                                    className={`h-10 w-10 transition-all duration-200 hover:scale-110 hover:shadow-md ${
                                        activeOption === option.id
                                            ? 'scale-105 transform bg-gradient-to-b from-sidebar-accent to-sidebar-accent/80 text-sidebar-accent-foreground shadow-md'
                                            : 'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                                    }`}
                                    title={option.label}
                                >
                                    <Icon className="h-5 w-5" />
                                </Button>
                            );
                        })}
                    </div>
                </div>

                {/* Contenido - se muestra cuando hay una opción activa, fecha seleccionada o evento seleccionado */}
                {shouldShowExpandedContent && (
                    <div className="flex-1 overflow-hidden">
                        <div className="flex h-full flex-col bg-background/30 backdrop-blur-sm">
                            {activeOption === 'edit-event' ? (
                                // Mostrar formulario de edición
                                <div className="flex-1 overflow-hidden">
                                    <div className="border-b border-sidebar-border bg-gradient-to-r from-sidebar to-sidebar/95 p-4">
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => {
                                                    setInternalActiveOption(null);
                                                    onDateClear?.();
                                                }}
                                                className="h-8 w-8 transition-all duration-200 hover:scale-105 hover:bg-sidebar-accent"
                                            >
                                                <ChevronLeft className="h-4 w-4" />
                                            </Button>
                                            <h3 className="font-medium text-sidebar-foreground">
                                                Editar Evento
                                            </h3>
                                        </div>
                                    </div>
                                    <div className="flex-1 overflow-y-auto bg-background/50 backdrop-blur-sm">
                                        <EventEditForm
                                            eventToEdit={selectedEvent}
                                            selectedCalendar={selectedCalendar}
                                            onEventUpdated={onEventUpdated}
                                            onModeChange={setInternalActiveOption}
                                        />
                                    </div>
                                </div>
                            ) : activeOption === 'new-event' ? (
                                // Mostrar formulario de evento directamente cuando hay fecha seleccionada
                                <div className="flex-1 overflow-hidden">
                                    <div className="border-b border-sidebar-border bg-gradient-to-r from-sidebar to-sidebar/95 p-4">
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => setInternalActiveOption(null)}
                                                className="h-8 w-8 transition-all duration-200 hover:scale-105 hover:bg-sidebar-accent"
                                            >
                                                <ChevronLeft className="h-4 w-4" />
                                            </Button>
                                            <h3 className="font-medium text-sidebar-foreground">
                                                Nuevo Evento
                                            </h3>
                                        </div>
                                    </div>
                                    <div className="flex-1 overflow-y-auto bg-background/50 backdrop-blur-sm">
                                        <EventCreateForm
                                            selectedDate={selectedDate}
                                            selectedCalendar={selectedCalendar}
                                            onEventCreated={onEventCreated}
                                            auth={auth}
                                        />
                                    </div>
                                </div>
                            ) : activeOption ? (
                                <>
                                    <div className="border-b border-sidebar-border bg-gradient-to-r from-sidebar to-sidebar/95 p-4">
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={handleBackToIcons}
                                                className="h-8 w-8 transition-all duration-200 hover:scale-105 hover:bg-sidebar-accent"
                                            >
                                                <ChevronLeft className="h-4 w-4" />
                                            </Button>
                                            <h3 className="font-medium text-sidebar-foreground">
                                                {
                                                    menuOptions.find(
                                                        (opt) =>
                                                            opt.id ===
                                                            activeOption,
                                                    )?.label
                                                }
                                            </h3>
                                        </div>
                                    </div>
                                    <div className="flex-1 overflow-y-auto bg-background/50 backdrop-blur-sm">
                                        {
                                            menuOptions.find(
                                                (opt) =>
                                                    opt.id ===
                                                    internalActiveOption,
                                            )?.content
                                        }
                                    </div>
                                </>
                            ) : selectedEvent ? (
                                // Mostrar detalles del evento
                                <div className="flex-1 overflow-y-auto bg-background/50 p-4 backdrop-blur-sm">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Clock className="h-5 w-5 text-primary" />
                                                <h3 className="text-lg font-semibold">
                                                    Detalles del Evento
                                                </h3>
                                            </div>
                                            {isOwner && (
                                                <div className="flex gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => {
                                                            // Set to edit mode - show form with event data
                                                            setInternalActiveOption(
                                                                'edit-event',
                                                            );
                                                        }}
                                                    >
                                                        Editar
                                                    </Button>
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => {
                                                            if (
                                                                confirm(
                                                                    '¿Estás seguro de que quieres eliminar este evento?',
                                                                )
                                                            ) {
                                                                // Delete event
                                                                fetch(
                                                                    `/eventos/${selectedEvent.id}`,
                                                                    {
                                                                        method: 'DELETE',
                                                                        headers: {
                                                                            'X-CSRF-TOKEN':
                                                                                document
                                                                                    .querySelector(
                                                                                        'meta[name="csrf-token"]',
                                                                                    )
                                                                                    ?.getAttribute(
                                                                                        'content',
                                                                                    ) ||
                                                                                '',
                                                                        },
                                                                    },
                                                                )
                                                                    .then(() => {
                                                                        // Remove from events
                                                                        if (
                                                                            onEventDeleted
                                                                        )
                                                                            onEventDeleted(
                                                                                selectedEvent.id,
                                                                            );
                                                                        // Close details
                                                                        setInternalActiveOption(
                                                                            null,
                                                                        );
                                                                        if (
                                                                            onExpansionChange
                                                                        )
                                                                            onExpansionChange(
                                                                                false,
                                                                        );
                                                                    })
                                                                    .catch(
                                                                        (error) => {
                                                                            console.error(
                                                                                'Error deleting event:',
                                                                                error,
                                                                            );
                                                                        },
                                                                    );
                                                            }
                                                        }}
                                                    >
                                                        Eliminar
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                        <div className="space-y-3">
                                            <div>
                                                <Label className="text-sm font-medium">
                                                    Título
                                                </Label>
                                                <p className="text-base">
                                                    {selectedEvent.titulo}
                                                </p>
                                            </div>
                                            {selectedEvent.descripcion && (
                                                <div>
                                                    <Label className="text-sm font-medium">
                                                        Descripción
                                                    </Label>
                                                    <p className="text-sm text-muted-foreground">
                                                        {
                                                            selectedEvent.descripcion
                                                        }
                                                    </p>
                                                </div>
                                            )}
                                            {selectedEvent.ubicacion && (
                                                <div>
                                                    <Label className="text-sm font-medium">
                                                        Ubicación
                                                    </Label>
                                                    <p className="text-sm">
                                                        {
                                                            selectedEvent.ubicacion
                                                        }
                                                    </p>
                                                </div>
                                            )}
                                            <div>
                                                <Label className="text-sm font-medium">
                                                    Fecha Inicio
                                                </Label>
                                                <p className="text-sm">
                                                    {new Date(
                                                        selectedEvent.fecha_inicio,
                                                    ).toLocaleString()}
                                                </p>
                                            </div>
                                            {selectedEvent.fecha_fin && (
                                                <div>
                                                    <Label className="text-sm font-medium">
                                                        Fecha Fin
                                                    </Label>
                                                    <p className="text-sm">
                                                        {new Date(
                                                            selectedEvent.fecha_fin,
                                                        ).toLocaleString()}
                                                    </p>
                                                </div>
                                            )}
                                            {selectedEvent.user && (
                                                <div>
                                                    <Label className="text-sm font-medium">
                                                        Creado por
                                                    </Label>
                                                    <p className="text-sm">
                                                        {
                                                            selectedEvent.user
                                                                .name
                                                        }
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Comentarios - Estilo Chat */}
                                        <div className="mt-6">
                                            <Label className="text-sm font-medium mb-3 block">
                                                Comentarios
                                            </Label>
                                            <div className="space-y-3 max-h-60 overflow-y-auto">
                                                {selectedEvent.comentarios && selectedEvent.comentarios.length > 0 ? (
                                                    selectedEvent.comentarios.map((comentario: any) => (
                                                        <div key={comentario.id} className="flex gap-3">
                                                            <div className="flex-shrink-0">
                                                                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                                                    <span className="text-xs font-medium text-primary">
                                                                        {(comentario.user?.name || 'U').charAt(0).toUpperCase()}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <span className="text-sm font-medium">
                                                                        {comentario.user?.name || 'Usuario'}
                                                                    </span>
                                                                    <span className="text-xs text-muted-foreground">
                                                                        {new Date(comentario.created_at).toLocaleString()}
                                                                    </span>
                                                                </div>
                                                                <div className="bg-muted/50 rounded-lg px-3 py-2">
                                                                    <p className="text-sm">{comentario.contenido}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p className="text-sm text-muted-foreground text-center py-4">No hay comentarios aún.</p>
                                                )}
                                            </div>

                                            {/* Formulario para agregar comentario */}
                                            <form
                                                className="mt-4"
                                                onSubmit={(e) => {
                                                    e.preventDefault();
                                                    const formData = new FormData(e.target as HTMLFormElement);
                                                    const contenido = formData.get('contenido') as string;
                                                    if (!contenido.trim()) return;

                                                    fetch(`/eventos/${selectedEvent.id}/comentarios`, {
                                                        method: 'POST',
                                                        headers: {
                                                            'Content-Type': 'application/json',
                                                            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                                                        },
                                                        body: JSON.stringify({ contenido }),
                                                    })
                                                        .then((response) => response.json())
                                                        .then((newComment) => {
                                                            // Add to selectedEvent comentarios
                                                            const updatedEvent = {
                                                                ...selectedEvent,
                                                                comentarios: [...(selectedEvent.comentarios || []), newComment],
                                                            };
                                                            // Update via callback if available
                                                            if (onEventUpdated) {
                                                                onEventUpdated(updatedEvent);
                                                            }
                                                            // Reset form
                                                            (e.target as HTMLFormElement).reset();
                                                        })
                                                        .catch((error) => {
                                                            console.error('Error adding comment:', error);
                                                        });
                                                }}
                                            >
                                                <div className="flex gap-2">
                                                    <Input
                                                        name="contenido"
                                                        placeholder="Escribe un comentario..."
                                                        className="flex-1"
                                                        required
                                                    />
                                                    <Button type="submit" size="sm">
                                                        <Plus className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="border-b border-sidebar-border bg-gradient-to-r from-sidebar to-sidebar/95 p-4">
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={handleBackToIcons}
                                                className="h-8 w-8 transition-all duration-200 hover:scale-105 hover:bg-sidebar-accent"
                                            >
                                                <ChevronLeft className="h-4 w-4" />
                                            </Button>
                                            <h3 className="font-medium text-sidebar-foreground">
                                                {
                                                    menuOptions.find(
                                                        (opt) =>
                                                            opt.id ===
                                                            activeOption,
                                                    )?.label
                                                }
                                            </h3>
                                        </div>
                                    </div>
                                    <div className="flex-1 overflow-y-auto bg-background/50 backdrop-blur-sm">
                                        {
                                            menuOptions.find(
                                                (opt) =>
                                                    opt.id ===
                                                    internalActiveOption,
                                            )?.content
                                        }
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
