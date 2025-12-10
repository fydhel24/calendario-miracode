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
import { usePage } from '@inertiajs/react';
import { Bell, ChevronLeft, Clock, Plus, Settings, Users } from 'lucide-react';
import { useEffect, useState } from 'react';

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
    selectedCalendars?: any[];
    calendarios?: any[];
    onEventCreated?: (event: any) => void;
    onEventUpdated?: (event: any) => void;
    onEventDeleted?: (eventId: string) => void;
    onCalendarUpdated?: (calendar: any) => void;
    onCalendarSelect?: (calendar: any) => void;
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
    selectedCalendars = [],
    calendarios = [],
    onEventCreated,
    onEventUpdated,
    onEventDeleted,
    onCalendarUpdated,
    onCalendarSelect,
    onModeChange,
    onDateClear,
}: RightMenuProps) {
    const { auth } = usePage().props as any;
    const [internalActiveOption, setInternalActiveOption] = useState<
        string | null
    >(null);

    const selectedCalendar = selectedCalendars[0]; // Use first for now

    const isOwner = selectedCalendar?.users?.some(
        (u: any) => u.id === auth.user.id && u.pivot?.tipo_user === 'owner',
    );

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
        ...(isOwner
            ? [
                  {
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
                  },
              ]
            : []),
        {
            id: 'reminder',
            label: 'Notificaciones',
            icon: Bell,
            content: (() => {
                const notifications = [
                    ...calendarios
                        .filter((c) =>
                            c.users?.some((u: any) => u.id === auth.user.id),
                        )
                        .map((c) => ({
                            type: 'calendar',
                            item: c,
                            date: c.pivot?.created_at || c.created_at,
                            message: `Agregado al calendario "${c.nombre}"`,
                        })),
                    ...calendarios
                        .flatMap((c) => c.eventos || [])
                        .filter((e) =>
                            e.usuarios?.some((u: any) => u.id === auth.user.id),
                        )
                        .map((e) => ({
                            type: 'event',
                            item: e,
                            date: e.pivot?.created_at || e.created_at,
                            message: `Invitado al evento "${e.titulo}" en calendario "${e.calendario?.nombre}"`,
                        })),
                ].sort(
                    (a, b) =>
                        new Date(b.date).getTime() - new Date(a.date).getTime(),
                );

                return (
                    <div className="space-y-4 p-4">
                        <h3 className="mb-4 text-lg font-semibold">
                            Notificaciones
                        </h3>
                        <div className="max-h-96 space-y-2 overflow-y-auto">
                            {notifications.length > 0 ? (
                                notifications.map((notif, index) => (
                                    <div
                                        key={index}
                                        className="cursor-pointer rounded-lg border p-3 transition-colors hover:bg-muted/50"
                                        onClick={() => {
                                            if (notif.type === 'calendar') {
                                                onCalendarSelect?.(notif.item);
                                            } else if (notif.type === 'event') {
                                                onCalendarSelect?.(
                                                    notif.item.calendario,
                                                );
                                                // Optionally set selectedEvent, but since no prop, just switch calendar
                                            }
                                        }}
                                    >
                                        <p className="text-sm">
                                            {notif.message}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {new Date(
                                                notif.date,
                                            ).toLocaleString()}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                    No hay notificaciones
                                </p>
                            )}
                        </div>
                    </div>
                );
            })(),
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
                        {selectedCalendar?.users &&
                        selectedCalendar.users.length > 0 ? (
                            selectedCalendar.users.map((user: any) => (
                                <div
                                    key={user.id}
                                    className="flex items-center justify-between rounded-lg border p-3"
                                >
                                    <div>
                                        <p className="font-medium">
                                            {user.name}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="rounded bg-primary/10 px-2 py-1 text-xs text-primary">
                                            {user.pivot?.tipo_user || 'viewer'}
                                        </span>
                                        {isOwner &&
                                            user.pivot?.tipo_user !==
                                                'owner' && (
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => {
                                                        if (
                                                            confirm(
                                                                `¿Estás seguro de que quieres remover a ${user.name}?`,
                                                            )
                                                        ) {
                                                            fetch(
                                                                `/calendarios/${selectedCalendar.id}/remove-user/${user.id}`,
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
                                                                    // Update selectedCalendar in real-time
                                                                    const updatedCalendar =
                                                                        {
                                                                            ...selectedCalendar,
                                                                            users: selectedCalendar.users.filter(
                                                                                (
                                                                                    u,
                                                                                ) =>
                                                                                    u.id !==
                                                                                    user.id,
                                                                            ),
                                                                        };
                                                                    if (
                                                                        onCalendarUpdated
                                                                    )
                                                                        onCalendarUpdated(
                                                                            updatedCalendar,
                                                                        );
                                                                })
                                                                .catch(
                                                                    (error) => {
                                                                        console.error(
                                                                            'Error removing user:',
                                                                            error,
                                                                        );
                                                                    },
                                                                );
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
                            <p className="text-muted-foreground">
                                No hay miembros
                            </p>
                        )}
                    </div>

                    {isOwner && (
                        <div className="border-t pt-4">
                            <h4 className="text-md mb-3 font-semibold">
                                Invitar Participantes
                            </h4>
                            <form
                                className="space-y-4"
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    const formData = new FormData(
                                        e.target as HTMLFormElement,
                                    );
                                    const user_id = formData.get(
                                        'user_id',
                                    ) as string;
                                    const tipo_user = formData.get(
                                        'tipo_user',
                                    ) as string;
                                    if (!user_id || !tipo_user) return;

                                    fetch(
                                        `/calendarios/${selectedCalendar?.id}/invite`,
                                        {
                                            method: 'POST',
                                            headers: {
                                                'Content-Type':
                                                    'application/json',
                                                'X-CSRF-TOKEN':
                                                    document
                                                        .querySelector(
                                                            'meta[name="csrf-token"]',
                                                        )
                                                        ?.getAttribute(
                                                            'content',
                                                        ) || '',
                                            },
                                            body: JSON.stringify({
                                                user_id: parseInt(user_id),
                                                tipo_user,
                                            }),
                                        },
                                    )
                                        .then((response) => {
                                            if (response.ok) {
                                                // Update selectedCalendar in real-time
                                                const invitedUser = users.find(
                                                    (u: any) =>
                                                        u.id.toString() ===
                                                        user_id,
                                                );
                                                if (
                                                    invitedUser &&
                                                    onCalendarUpdated
                                                ) {
                                                    const updatedCalendar = {
                                                        ...selectedCalendar,
                                                        users: [
                                                            ...(selectedCalendar.users ||
                                                                []),
                                                            {
                                                                ...invitedUser,
                                                                pivot: {
                                                                    tipo_user,
                                                                },
                                                            },
                                                        ],
                                                    };
                                                    onCalendarUpdated(
                                                        updatedCalendar,
                                                    );
                                                }
                                                (
                                                    e.target as HTMLFormElement
                                                ).reset();
                                            } else {
                                                return response
                                                    .json()
                                                    .then((data) => {
                                                        throw new Error(
                                                            data.error ||
                                                                'Error al agregar usuario',
                                                        );
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
                                    <Select
                                        name="user_id"
                                        required
                                        disabled={loadingUsers}
                                    >
                                        <SelectTrigger className="mt-1">
                                            <SelectValue
                                                placeholder={
                                                    loadingUsers
                                                        ? 'Cargando usuarios...'
                                                        : 'Selecciona un usuario'
                                                }
                                            />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {users
                                                .filter(
                                                    (u: any) =>
                                                        !selectedCalendar?.users?.some(
                                                            (cu: any) =>
                                                                cu.id === u.id,
                                                        ),
                                                )
                                                .map((user: any) => (
                                                    <SelectItem
                                                        key={user.id}
                                                        value={user.id.toString()}
                                                    >
                                                        {user.name}
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
                                            <SelectItem value="viewer">
                                                Espectador
                                            </SelectItem>
                                            <SelectItem value="editor">
                                                Editor
                                            </SelectItem>
                                            <SelectItem value="owner">
                                                Propietario
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Button
                                    type="submit"
                                    className="mt-6 w-full"
                                    disabled={loadingUsers}
                                >
                                    Agregar Usuario
                                </Button>
                            </form>
                        </div>
                    )}
                </div>
            ),
        },
        ...(isOwner
            ? [
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
                                      <Label htmlFor="dark-mode">
                                          Modo oscuro
                                      </Label>
                                      <Checkbox id="dark-mode" />
                                  </div>
                                  <div className="flex items-center justify-between">
                                      <Label htmlFor="sync">
                                          Sincronización
                                      </Label>
                                      <Checkbox id="sync" defaultChecked />
                                  </div>
                                  <Button className="mt-6 w-full">
                                      Guardar
                                  </Button>
                              </div>
                          </div>
                      ),
                  },
              ]
            : []),
    ];

    const handleOptionClick = (optionId: string) => {
        // If clicking the same option that's already active, don't collapse it
        // This prevents collapsing when the option was auto-selected from selectedDate
        if (internalActiveOption === optionId) {
            // Keep it expanded - don't do anything
            return;
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
                                                    setInternalActiveOption(
                                                        null,
                                                    );
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
                                            onModeChange={
                                                setInternalActiveOption
                                            }
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
                                                onClick={() =>
                                                    setInternalActiveOption(
                                                        null,
                                                    )
                                                }
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
                                                                        headers:
                                                                            {
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
                                                                    .then(
                                                                        () => {
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
                                                                        },
                                                                    )
                                                                    .catch(
                                                                        (
                                                                            error,
                                                                        ) => {
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
                                            {selectedEvent.usuarios &&
                                                selectedEvent.usuarios.length >
                                                    0 && (
                                                    <div>
                                                        <Label className="text-sm font-medium">
                                                            Usuarios Invitados
                                                        </Label>
                                                        <div className="mt-1 flex flex-wrap gap-2">
                                                            {selectedEvent.usuarios.map(
                                                                (
                                                                    usuario: any,
                                                                ) => (
                                                                    <div
                                                                        key={
                                                                            usuario.id
                                                                        }
                                                                        className="flex items-center gap-2 rounded bg-muted px-2 py-1 text-sm"
                                                                    >
                                                                        <span>
                                                                            {
                                                                                usuario.name
                                                                            }
                                                                        </span>
                                                                        {isOwner && (
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="sm"
                                                                                className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                                                                                onClick={() => {
                                                                                    if (
                                                                                        confirm(
                                                                                            `¿Estás seguro de que quieres remover a ${usuario.name}?`,
                                                                                        )
                                                                                    ) {
                                                                                        fetch(
                                                                                            `/eventos/${selectedEvent.id}/remove-user/${usuario.id}`,
                                                                                            {
                                                                                                method: 'DELETE',
                                                                                                headers:
                                                                                                    {
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
                                                                                            .then(
                                                                                                () => {
                                                                                                    // Update selectedEvent in real-time
                                                                                                    const updatedEvent =
                                                                                                        {
                                                                                                            ...selectedEvent,
                                                                                                            usuarios:
                                                                                                                selectedEvent.usuarios.filter(
                                                                                                                    (
                                                                                                                        u,
                                                                                                                    ) =>
                                                                                                                        u.id !==
                                                                                                                        usuario.id,
                                                                                                                ),
                                                                                                        };
                                                                                                    if (
                                                                                                        onEventUpdated
                                                                                                    )
                                                                                                        onEventUpdated(
                                                                                                            updatedEvent,
                                                                                                        );
                                                                                                },
                                                                                            )
                                                                                            .catch(
                                                                                                (
                                                                                                    error,
                                                                                                ) => {
                                                                                                    console.error(
                                                                                                        'Error removing user:',
                                                                                                        error,
                                                                                                    );
                                                                                                },
                                                                                            );
                                                                                    }
                                                                                }}
                                                                            >
                                                                                ×
                                                                            </Button>
                                                                        )}
                                                                    </div>
                                                                ),
                                                            )}
                                                        </div>
                                                    </div>
                                                )}

                                            {/* Invite user form */}
                                            {isOwner && (
                                                <div>
                                                    <Label className="text-sm font-medium">
                                                        Agregar Usuario
                                                    </Label>
                                                    <form
                                                        className="mt-2 flex flex-col gap-2 sm:flex-row"
                                                        onSubmit={(e) => {
                                                            e.preventDefault();
                                                            const formData =
                                                                new FormData(
                                                                    e.target as HTMLFormElement,
                                                                );
                                                            const user_id =
                                                                formData.get(
                                                                    'user_id',
                                                                ) as string;
                                                            if (!user_id)
                                                                return;

                                                            fetch(
                                                                `/eventos/${selectedEvent.id}/add-user`,
                                                                {
                                                                    method: 'POST',
                                                                    headers: {
                                                                        'Content-Type':
                                                                            'application/json',
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
                                                                    body: JSON.stringify(
                                                                        {
                                                                            user_id:
                                                                                parseInt(
                                                                                    user_id,
                                                                                ),
                                                                        },
                                                                    ),
                                                                },
                                                            )
                                                                .then(
                                                                    (
                                                                        response,
                                                                    ) => {
                                                                        if (
                                                                            response.ok
                                                                        ) {
                                                                            alert(
                                                                                'Usuario invitado exitosamente',
                                                                            );
                                                                            (
                                                                                e.target as HTMLFormElement
                                                                            ).reset();
                                                                            // Update selectedEvent in real-time
                                                                            const invitedUser =
                                                                                users.find(
                                                                                    (
                                                                                        u,
                                                                                    ) =>
                                                                                        u.id.toString() ===
                                                                                        user_id,
                                                                                );
                                                                            if (
                                                                                invitedUser &&
                                                                                onEventUpdated
                                                                            ) {
                                                                                const updatedEvent =
                                                                                    {
                                                                                        ...selectedEvent,
                                                                                        usuarios:
                                                                                            [
                                                                                                ...(selectedEvent.usuarios ||
                                                                                                    []),
                                                                                                invitedUser,
                                                                                            ],
                                                                                    };
                                                                                onEventUpdated(
                                                                                    updatedEvent,
                                                                                );
                                                                            }
                                                                        } else {
                                                                            return response
                                                                                .json()
                                                                                .then(
                                                                                    (
                                                                                        data,
                                                                                    ) => {
                                                                                        throw new Error(
                                                                                            data.error ||
                                                                                                'Error al invitar usuario',
                                                                                        );
                                                                                    },
                                                                                );
                                                                        }
                                                                    },
                                                                )
                                                                .catch(
                                                                    (error) => {
                                                                        alert(
                                                                            error.message,
                                                                        );
                                                                    },
                                                                );
                                                        }}
                                                    >
                                                        <div className="flex-1">
                                                            <Select
                                                                name="user_id"
                                                                required
                                                                disabled={
                                                                    loadingUsers
                                                                }
                                                            >
                                                                <SelectTrigger>
                                                                    <SelectValue
                                                                        placeholder={
                                                                            loadingUsers
                                                                                ? 'Cargando usuarios...'
                                                                                : 'Selecciona un usuario'
                                                                        }
                                                                    />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {selectedCalendar?.users
                                                                        ?.filter(
                                                                            (
                                                                                user,
                                                                            ) =>
                                                                                !selectedEvent.usuarios?.some(
                                                                                    (
                                                                                        u: any,
                                                                                    ) =>
                                                                                        u.id ===
                                                                                        user.id,
                                                                                ),
                                                                        )
                                                                        .map(
                                                                            (
                                                                                user,
                                                                            ) => (
                                                                                <SelectItem
                                                                                    key={
                                                                                        user.id
                                                                                    }
                                                                                    value={user.id.toString()}
                                                                                >
                                                                                    {
                                                                                        user.name
                                                                                    }{' '}
                                                                                    (
                                                                                    {
                                                                                        user.email
                                                                                    }

                                                                                    )
                                                                                </SelectItem>
                                                                            ),
                                                                        )}
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                        <Button
                                                            type="submit"
                                                            size="sm"
                                                            disabled={
                                                                loadingUsers
                                                            }
                                                            className="w-full sm:w-auto"
                                                        >
                                                            Invitar
                                                        </Button>
                                                    </form>
                                                </div>
                                            )}
                                        </div>

                                        {/* Comentarios - Estilo Chat */}
                                        <div className="mt-6">
                                            <Label className="mb-3 block text-sm font-medium">
                                                Comentarios
                                            </Label>
                                            <div className="max-h-60 space-y-3 overflow-y-auto">
                                                {selectedEvent.comentarios &&
                                                selectedEvent.comentarios
                                                    .length > 0 ? (
                                                    selectedEvent.comentarios.map(
                                                        (comentario: any) => (
                                                            <div
                                                                key={
                                                                    comentario.id
                                                                }
                                                                className="flex gap-3"
                                                            >
                                                                <div className="flex-shrink-0">
                                                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                                                                        <span className="text-xs font-medium text-primary">
                                                                            {(
                                                                                comentario
                                                                                    .user
                                                                                    ?.name ||
                                                                                'U'
                                                                            )
                                                                                .charAt(
                                                                                    0,
                                                                                )
                                                                                .toUpperCase()}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <div className="flex-1">
                                                                    <div className="mb-1 flex items-center gap-2">
                                                                        <span className="text-sm font-medium">
                                                                            {comentario
                                                                                .user
                                                                                ?.name ||
                                                                                'Usuario'}
                                                                        </span>
                                                                        <span className="text-xs text-muted-foreground">
                                                                            {new Date(
                                                                                comentario.created_at,
                                                                            ).toLocaleString()}
                                                                        </span>
                                                                    </div>
                                                                    <div className="rounded-lg bg-muted/50 px-3 py-2">
                                                                        <p className="text-sm">
                                                                            {
                                                                                comentario.contenido
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ),
                                                    )
                                                ) : (
                                                    <p className="py-4 text-center text-sm text-muted-foreground">
                                                        No hay comentarios aún.
                                                    </p>
                                                )}
                                            </div>

                                            {/* Formulario para agregar comentario */}
                                            <form
                                                className="mt-4"
                                                onSubmit={(e) => {
                                                    e.preventDefault();
                                                    const formData =
                                                        new FormData(
                                                            e.target as HTMLFormElement,
                                                        );
                                                    const contenido =
                                                        formData.get(
                                                            'contenido',
                                                        ) as string;
                                                    if (!contenido.trim())
                                                        return;

                                                    fetch(
                                                        `/eventos/${selectedEvent.id}/comentarios`,
                                                        {
                                                            method: 'POST',
                                                            headers: {
                                                                'Content-Type':
                                                                    'application/json',
                                                                'X-CSRF-TOKEN':
                                                                    document
                                                                        .querySelector(
                                                                            'meta[name="csrf-token"]',
                                                                        )
                                                                        ?.getAttribute(
                                                                            'content',
                                                                        ) || '',
                                                            },
                                                            body: JSON.stringify(
                                                                { contenido },
                                                            ),
                                                        },
                                                    )
                                                        .then((response) =>
                                                            response.json(),
                                                        )
                                                        .then((newComment) => {
                                                            // Add to selectedEvent comentarios
                                                            const updatedEvent =
                                                                {
                                                                    ...selectedEvent,
                                                                    comentarios:
                                                                        [
                                                                            ...(selectedEvent.comentarios ||
                                                                                []),
                                                                            newComment,
                                                                        ],
                                                                };
                                                            // Update via callback if available
                                                            if (
                                                                onEventUpdated
                                                            ) {
                                                                onEventUpdated(
                                                                    updatedEvent,
                                                                );
                                                            }
                                                            // Reset form
                                                            (
                                                                e.target as HTMLFormElement
                                                            ).reset();
                                                        })
                                                        .catch((error) => {
                                                            console.error(
                                                                'Error adding comment:',
                                                                error,
                                                            );
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
                                                    <Button
                                                        type="submit"
                                                        size="sm"
                                                    >
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
