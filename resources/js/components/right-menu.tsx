import { DescriptionModal } from '@/components/description-modal';
import { EventCreateForm } from '@/components/event-create-form';
import { EventEditForm } from '@/components/event-edit-form';
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
import { usePage } from '@inertiajs/react';
import {
    Bell,
    ChevronLeft,
    Clock,
    FileText,
    LogOut,
    Plus,
    Search,
    User,
    Users,
    ShieldCheck,
    Calendar,
    MapPin,
    Trash2,
    Edit,
} from 'lucide-react';
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

    const isOwner = selectedCalendars.some((calendar) =>
        calendar?.users?.some(
            (u: any) => u.id === auth.user.id && u.pivot?.tipo_user === 'owner',
        ),
    );

    const canEditEvent =
        selectedEvent &&
        selectedCalendars.some(
            (calendar) =>
                calendar.id === selectedEvent.calendario_id &&
                calendar.users?.some(
                    (u: any) =>
                        u.id === auth.user.id && u.pivot?.tipo_user === 'owner',
                ),
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
    const [userSearch, setUserSearch] = useState('');
    const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);

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
                            selectedCalendars={selectedCalendars}
                            onEventCreated={onEventCreated}
                            auth={auth}
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
                        <div className="flex items-center gap-2 mb-2">
                            <Bell className="h-5 w-5 text-primary" />
                            <h3 className="text-lg font-bold tracking-tight">Notificaciones</h3>
                        </div>
                        <div className="max-h-[70vh] space-y-3 overflow-y-auto pr-2 scrollbar-thin">
                            {notifications.length > 0 ? (
                                notifications.map((notif, index) => (
                                    <div
                                        key={index}
                                        className="detail-card cursor-pointer group"
                                        onClick={() => {
                                            if (notif.type === 'calendar') {
                                                onCalendarSelect?.(notif.item);
                                            } else if (notif.type === 'event') {
                                                onCalendarSelect?.(
                                                    notif.item.calendario,
                                                );
                                            }
                                        }}
                                    >
                                        <div className="flex gap-3">
                                            <div className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${notif.type === 'calendar' ? 'bg-blue-500/10 text-blue-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                                                {notif.type === 'calendar' ? <Calendar className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <p className="text-sm font-semibold leading-tight group-hover:text-primary transition-colors">
                                                    {notif.message}
                                                </p>
                                                <div className="flex items-center gap-2 text-[10px] font-medium text-muted-foreground">
                                                    <Clock className="h-3 w-3" />
                                                    {new Date(notif.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12 text-center opacity-40">
                                    <Bell className="h-12 w-12 mb-3" />
                                    <p className="text-sm font-medium">No hay notificaciones</p>
                                </div>
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
                    <div className="flex items-center gap-2 mb-2">
                        <Users className="h-5 w-5 text-primary" />
                        <h3 className="text-lg font-bold tracking-tight">Miembros</h3>
                    </div>
                    <div className="max-h-80 space-y-3 overflow-y-auto pr-2 scrollbar-thin">
                        {selectedCalendar?.users &&
                            selectedCalendar.users.length > 0 ? (
                            selectedCalendar.users.map((user: any) => (
                                <div
                                    key={user.id}
                                    className="detail-card border-l-4"
                                    style={{ borderLeftColor: user.pivot?.tipo_user === 'owner' ? '#3b82f6' : user.pivot?.tipo_user === 'editor' ? '#10b981' : '#64748b' }}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="relative">
                                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 border border-primary/20">
                                                    <User className="h-5 w-5 text-primary" />
                                                </div>
                                                {user.pivot?.tipo_user === 'owner' && (
                                                    <div className="absolute -bottom-1 -right-1 rounded-full bg-background p-0.5">
                                                        <ShieldCheck className="h-4 w-4 text-blue-500 fill-blue-500/20" />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold tracking-tight">
                                                    {user.name}
                                                </p>
                                                <span className={`role-badge role-badge-${user.pivot?.tipo_user || 'viewer'}`}>
                                                    {user.pivot?.tipo_user === 'owner' ? 'Propietario' : user.pivot?.tipo_user === 'editor' ? 'Editor' : 'Espectador'}
                                                </span>
                                            </div>
                                        </div>
                                        {isOwner &&
                                            user.pivot?.tipo_user !==
                                            'owner' && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all"
                                                    title="Remover miembro"
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
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="py-8 text-center opacity-40">
                                <Users className="h-10 w-10 mx-auto mb-2" />
                                <p className="text-sm font-medium">No hay miembros</p>
                            </div>
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
                                                setUserSearch('');
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
                                    {/* Search Input */}
                                    <div className="relative mt-2">
                                        <div className="relative">
                                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                                            <Input
                                                type="text"
                                                placeholder="Buscar usuarios..."
                                                value={userSearch}
                                                onChange={(e) =>
                                                    setUserSearch(
                                                        e.target.value,
                                                    )
                                                }
                                                className="pl-10"
                                                disabled={loadingUsers}
                                            />
                                        </div>
                                    </div>

                                    {/* User List - Only show when there are search results */}
                                    {userSearch && (
                                        <div className="mt-2 max-h-40 overflow-y-auto rounded-lg border border-border/50 bg-background/50">
                                            {users
                                                .filter(
                                                    (u: any) =>
                                                        u.id !==
                                                        auth?.user?.id &&
                                                        u.name
                                                            .toLowerCase()
                                                            .includes(
                                                                userSearch.toLowerCase(),
                                                            ) &&
                                                        !selectedCalendar?.users?.some(
                                                            (cu: any) =>
                                                                cu.id === u.id,
                                                        ),
                                                )
                                                .map((user: any) => (
                                                    <div
                                                        key={user.id}
                                                        className="flex cursor-pointer items-center justify-between border-b border-border/20 p-2 last:border-b-0 hover:bg-muted/50"
                                                        onClick={() => {
                                                            // Set the selected user by updating form state
                                                            const form =
                                                                document.querySelector(
                                                                    'form',
                                                                ) as HTMLFormElement;
                                                            if (form) {
                                                                const userIdInput =
                                                                    form.querySelector(
                                                                        'input[name="user_id"]',
                                                                    ) as HTMLInputElement;
                                                                if (
                                                                    userIdInput
                                                                ) {
                                                                    userIdInput.value =
                                                                        user.id.toString();
                                                                }
                                                                setUserSearch(
                                                                    user.name,
                                                                ); // Show selected user name
                                                            }
                                                        }}
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                                                                <User className="h-4 w-4 text-primary-foreground" />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-medium">
                                                                    {user.name}
                                                                </p>
                                                                <p className="text-xs text-muted-foreground">
                                                                    {user.email}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-6 w-6 p-0 hover:bg-muted hover:text-muted-foreground"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                const form =
                                                                    document.querySelector(
                                                                        'form',
                                                                    ) as HTMLFormElement;
                                                                if (form) {
                                                                    const userIdInput =
                                                                        form.querySelector(
                                                                            'input[name="user_id"]',
                                                                        ) as HTMLInputElement;
                                                                    if (
                                                                        userIdInput
                                                                    ) {
                                                                        userIdInput.value =
                                                                            user.id.toString();
                                                                    }
                                                                    setUserSearch(
                                                                        user.name,
                                                                    );
                                                                }
                                                            }}
                                                        >
                                                            <User className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                ))}
                                            {users.filter(
                                                (u: any) =>
                                                    u.id !== auth?.user?.id &&
                                                    u.name
                                                        .toLowerCase()
                                                        .includes(
                                                            userSearch.toLowerCase(),
                                                        ) &&
                                                    !selectedCalendar?.users?.some(
                                                        (cu: any) =>
                                                            cu.id === u.id,
                                                    ),
                                            ).length === 0 &&
                                                userSearch && (
                                                    <div className="p-4 text-center text-sm text-muted-foreground">
                                                        No se encontraron
                                                        usuarios
                                                    </div>
                                                )}
                                        </div>
                                    )}

                                    {/* Hidden input for user_id */}
                                    <input type="hidden" name="user_id" />
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
        {
            id: 'logout',
            label: 'Cerrar Sesión',
            icon: LogOut,
            content: (
                <div className="p-4">
                    <form method="post" action="/logout">
                        <input
                            type="hidden"
                            name="_token"
                            value={document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''}
                        />
                        <button
                            type="submit"
                            className="w-full rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                        >
                            Cerrar Sesión
                        </button>
                    </form>
                </div>
            ),
        },
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
            className={`flex h-full border-l border-border bg-background shadow-xl ${className}`}
        >
            {/* Estructura expandible: siempre los iconos + contenido cuando está activo */}
            <div
                className={`flex h-full transition-all duration-300 ease-in-out ${shouldShowExpandedContent ? 'w-96' : 'w-16'
                    }`}
            >
                {/* Iconos del menú - siempre visible */}
                <div className="flex w-16 flex-col border-r border-border bg-background">
                    <div className="flex flex-col space-y-3 p-2 mt-4">
                        {menuOptions.map((option) => {
                            const Icon = option.icon;
                            return (
                                <Button
                                    key={option.id}
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleOptionClick(option.id)}
                                    className={`h-11 w-11 rounded-xl transition-all duration-300 ${activeOption === option.id
                                        ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105'
                                        : 'hover:bg-primary/10 hover:text-primary hover:scale-110 glass-icon'
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
                    <div className="flex-1">
                        <div className="flex h-full flex-col bg-background/80 backdrop-blur-sm">
                            {activeOption === 'edit-event' ? (
                                // Mostrar formulario de edición
                                <div className="flex-1 overflow-hidden flex flex-col">
                                    <div className="border-b border-sidebar-border bg-sidebar p-4 flex items-center justify-between">
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
                                        {canEditEvent && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => {
                                                    if (confirm('¿Estás seguro de que quieres eliminar este evento?')) {
                                                        fetch(`/eventos/${selectedEvent.id}`, {
                                                            method: 'DELETE',
                                                            headers: { 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '' },
                                                        }).then(() => {
                                                            if (onEventDeleted) onEventDeleted(selectedEvent.id);
                                                            setInternalActiveOption(null);
                                                            if (onExpansionChange) onExpansionChange(false);
                                                        });
                                                    }
                                                }}
                                                className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive transition-all duration-200"
                                                title="Eliminar evento"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                    <div className="flex-1 overflow-y-auto bg-background/50 backdrop-blur-sm">
                                        <EventEditForm
                                            eventToEdit={selectedEvent}
                                            selectedCalendar={selectedCalendar}
                                            onEventUpdated={onEventUpdated}
                                            onEventDeleted={onEventDeleted}
                                            onModeChange={
                                                setInternalActiveOption
                                            }
                                        />
                                    </div>
                                </div>
                            ) : activeOption === 'new-event' ? (
                                // Mostrar formulario de evento directamente cuando hay fecha seleccionada
                                <div className="flex-1 overflow-y-auto">
                                    <div className="border-b border-sidebar-border bg-sidebar p-4">
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => {
                                                    setInternalActiveOption(
                                                        null,
                                                    );
                                                    onDateClear?.();
                                                    if (onExpansionChange)
                                                        onExpansionChange(
                                                            false,
                                                        );
                                                }}
                                                className="h-8 w-8 transition-all duration-200 hover:scale-105 hover:bg-sidebar-accent"
                                            >
                                                <ChevronLeft className="h-4 w-4" />
                                            </Button>
                                            <h3 className="font-medium text-sidebar-foreground">
                                                Nuevo Evento
                                            </h3>
                                        </div>
                                    </div>
                                    <EventCreateForm
                                        selectedDate={selectedDate}
                                        selectedCalendars={selectedCalendars}
                                        onEventCreated={onEventCreated}
                                        auth={auth}
                                    />
                                </div>
                            ) : activeOption ? (
                                <>
                                    <div className="border-b border-sidebar-border bg-sidebar p-4">
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
                                    <div className="flex-1 overflow-y-auto bg-background/80 backdrop-blur-sm">
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
                                            <div className="flex items-center gap-2 text-primary">
                                                <Calendar className="h-5 w-5" />
                                                <h3 className="text-lg font-bold tracking-tight">
                                                    Detalles del Evento
                                                </h3>
                                            </div>
                                            {canEditEvent && (
                                                <div className="flex gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 hover:bg-primary/10 hover:text-primary transition-all duration-200"
                                                        title="Editar evento"
                                                        onClick={() => setInternalActiveOption('edit-event')}
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive transition-all duration-200"
                                                        title="Eliminar evento"
                                                        onClick={() => {
                                                            if (confirm('¿Estás seguro de que quieres eliminar este evento?')) {
                                                                fetch(`/eventos/${selectedEvent.id}`, {
                                                                    method: 'DELETE',
                                                                    headers: { 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '' },
                                                                }).then(() => {
                                                                    if (onEventDeleted) onEventDeleted(selectedEvent.id);
                                                                    setInternalActiveOption(null);
                                                                    if (onExpansionChange) onExpansionChange(false);
                                                                });
                                                            }
                                                        }}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-4">
                                            <div className="detail-card">
                                                <div className="info-group">
                                                    <span className="info-label">
                                                        <FileText className="h-3.5 w-3.5" />
                                                        Título
                                                    </span>
                                                    <h2 className="text-xl font-bold tracking-tight">
                                                        {selectedEvent.titulo}
                                                    </h2>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="detail-card">
                                                    <div className="info-group">
                                                        <span className="info-label">
                                                            <Clock className="h-3.5 w-3.5" />
                                                            Inicio
                                                        </span>
                                                        <p className="text-xs font-bold">
                                                            {new Date(selectedEvent.fecha_inicio).toLocaleDateString()}
                                                        </p>
                                                        <p className="text-[10px] text-muted-foreground uppercase font-black">
                                                            {new Date(selectedEvent.fecha_inicio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="detail-card">
                                                    <div className="info-group">
                                                        <span className="info-label">
                                                            <Clock className="h-3.5 w-3.5" />
                                                            Fin
                                                        </span>
                                                        <p className="text-xs font-bold">
                                                            {selectedEvent.fecha_fin ? new Date(selectedEvent.fecha_fin).toLocaleDateString() : '---'}
                                                        </p>
                                                        <p className="text-[10px] text-muted-foreground uppercase font-black">
                                                            {selectedEvent.fecha_fin ? new Date(selectedEvent.fecha_fin).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '---'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {selectedEvent.descripcion && (
                                                <div className="detail-card">
                                                    <div className="info-group">
                                                        <span className="info-label">
                                                            <FileText className="h-3.5 w-3.5" />
                                                            Descripción
                                                        </span>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            onClick={() => setIsDescriptionModalOpen(true)}
                                                            className="mt-1 w-full justify-start h-auto py-2.5 px-3 text-left font-medium bg-muted/30 hover:bg-muted/50 rounded-lg text-sm transition-all duration-200"
                                                        >
                                                            <span className="line-clamp-2">
                                                                {selectedEvent.descripcion}
                                                            </span>
                                                        </Button>
                                                    </div>
                                                </div>
                                            )}

                                            {selectedEvent.ubicacion && (
                                                <div className="detail-card border-l-4 border-l-primary/50">
                                                    <div className="info-group">
                                                        <span className="info-label">
                                                            <MapPin className="h-3.5 w-3.5" />
                                                            Ubicación
                                                        </span>
                                                        <p className="text-sm font-semibold">
                                                            {selectedEvent.ubicacion}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}

                                            {selectedEvent.user && (
                                                <div className="detail-card bg-primary/5 border-primary/20">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 border border-primary/20">
                                                            <User className="h-6 w-6 text-primary" />
                                                        </div>
                                                        <div className="info-group">
                                                            <span className="info-label">Organizador</span>
                                                            <p className="text-sm font-bold">{selectedEvent.user.name}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {selectedEvent.usuarios && selectedEvent.usuarios.length > 0 && (
                                                <div className="space-y-3">
                                                    <div className="flex items-center gap-2 px-1">
                                                        <Users className="h-4 w-4 text-primary" />
                                                        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Invitados</span>
                                                    </div>
                                                    <div className="space-y-2">
                                                        {selectedEvent.usuarios.map((usuario: any) => (
                                                            <div
                                                                key={usuario.id}
                                                                className="detail-card py-2 px-3"
                                                            >
                                                                <div className="flex items-center justify-between">
                                                                    <div className="flex items-center gap-2">
                                                                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted border">
                                                                            <User className="h-4 w-4 text-muted-foreground" />
                                                                        </div>
                                                                        <div>
                                                                            <p className="text-xs font-bold">
                                                                                {usuario.name}
                                                                            </p>
                                                                            <p className="text-[10px] text-muted-foreground truncate max-w-[150px]">
                                                                                {usuario.email}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                    {isOwner && (
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="icon"
                                                                            className="h-6 w-6 text-muted-foreground hover:bg-destructive/10 hover:text-destructive rounded-full"
                                                                            onClick={() => {
                                                                                if (confirm(`¿Remover a ${usuario.name}?`)) {
                                                                                    fetch(`/eventos/${selectedEvent.id}/remove-user/${usuario.id}`, {
                                                                                        method: 'DELETE',
                                                                                        headers: { 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '' },
                                                                                    }).then(() => {
                                                                                        const updatedEvent = { ...selectedEvent, usuarios: selectedEvent.usuarios.filter((u: any) => u.id !== usuario.id) };
                                                                                        if (onEventUpdated) onEventUpdated(updatedEvent);
                                                                                    });
                                                                                }
                                                                            }}
                                                                        >
                                                                            <span className="text-lg leading-none">×</span>
                                                                        </Button>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Invite user form */}
                                        {canEditEvent && (
                                            <div className="detail-card mt-6">
                                                <div className="info-group">
                                                    <span className="info-label">
                                                        <Plus className="h-3.5 w-3.5" />
                                                        Agregar Usuario
                                                    </span>
                                                    <form
                                                        className="mt-2"
                                                        onSubmit={(e) => {
                                                            e.preventDefault();
                                                            const formData = new FormData(e.target as HTMLFormElement);
                                                            const user_id = formData.get('user_id') as string;
                                                            if (!user_id) return;

                                                            fetch(`/eventos/${selectedEvent.id}/add-user`, {
                                                                method: 'POST',
                                                                headers: {
                                                                    'Content-Type': 'application/json',
                                                                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                                                                },
                                                                body: JSON.stringify({ user_id: parseInt(user_id) }),
                                                            })
                                                                .then((response) => {
                                                                    if (response.ok) {
                                                                        const invitedUser = users.find((u: any) => u.id.toString() === user_id);
                                                                        if (invitedUser && onEventUpdated) {
                                                                            const updatedEvent = {
                                                                                ...selectedEvent,
                                                                                usuarios: [...(selectedEvent.usuarios || []), invitedUser],
                                                                            };
                                                                            onEventUpdated(updatedEvent);
                                                                        }
                                                                        (e.target as HTMLFormElement).reset();
                                                                        setUserSearch('');
                                                                    } else {
                                                                        return response.json().then((data) => {
                                                                            throw new Error(data.error || 'Error al invitar usuario');
                                                                        });
                                                                    }
                                                                })
                                                                .catch((error) => {
                                                                    alert(error.message);
                                                                });
                                                        }}
                                                    >
                                                        <div className="relative">
                                                            <div className="relative">
                                                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                                                                <Input
                                                                    type="text"
                                                                    placeholder="Buscar usuarios..."
                                                                    value={userSearch}
                                                                    onChange={(e) => setUserSearch(e.target.value)}
                                                                    className="pl-10 h-9 text-sm rounded-lg"
                                                                    disabled={loadingUsers}
                                                                />
                                                            </div>
                                                        </div>

                                                        {userSearch && (
                                                            <div className="mt-2 max-h-40 overflow-y-auto rounded-lg border border-border/50 bg-background/50 scrollbar-thin">
                                                                {(selectedCalendar?.users || [])
                                                                    .filter((u: any) =>
                                                                        u.id !== auth?.user?.id &&
                                                                        u.name.toLowerCase().includes(userSearch.toLowerCase()) &&
                                                                        !selectedEvent.usuarios?.some((eu: any) => eu.id === u.id)
                                                                    )
                                                                    .map((user: any) => (
                                                                        <div
                                                                            key={user.id}
                                                                            className="flex cursor-pointer items-center justify-between border-b border-border/20 p-2 last:border-b-0 hover:bg-primary/5 transition-colors"
                                                                            onClick={() => {
                                                                                const form = document.querySelector('form') as HTMLFormElement;
                                                                                if (form) {
                                                                                    const userIdInput = form.querySelector('input[name="user_id"]') as HTMLInputElement;
                                                                                    if (userIdInput) userIdInput.value = user.id.toString();
                                                                                    setUserSearch(user.name);
                                                                                }
                                                                            }}
                                                                        >
                                                                            <div className="flex items-center gap-2">
                                                                                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 border border-primary/20">
                                                                                    <User className="h-3.5 w-3.5 text-primary" />
                                                                                </div>
                                                                                <div>
                                                                                    <p className="text-xs font-bold leading-none">{user.name}</p>
                                                                                    <p className="text-[10px] text-muted-foreground">{user.email}</p>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                            </div>
                                                        )}
                                                        <input type="hidden" name="user_id" />
                                                        <Button
                                                            type="submit"
                                                            className="mt-3 w-full h-9 text-xs font-bold uppercase tracking-wider"
                                                            disabled={loadingUsers || !userSearch}
                                                        >
                                                            Invitar
                                                        </Button>
                                                    </form>
                                                </div>
                                            </div>
                                        )}

                                        {/* Comentarios */}
                                        <div className="mt-6 border-t border-border/40 pt-6">
                                            <div className="flex items-center gap-2 mb-4 px-1">
                                                <FileText className="h-4 w-4 text-primary" />
                                                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Comentarios</span>
                                            </div>
                                            <div className="max-h-60 space-y-4 overflow-y-auto pr-2 scrollbar-thin">
                                                {selectedEvent.comentarios && selectedEvent.comentarios.length > 0 ? (
                                                    selectedEvent.comentarios.map((comentario: any) => (
                                                        <div key={comentario.id} className="flex gap-3">
                                                            <div className="flex-shrink-0">
                                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 border border-primary/20">
                                                                    <span className="text-[10px] font-bold text-primary">
                                                                        {(comentario.user?.name || 'U').charAt(0).toUpperCase()}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div className="flex-1 space-y-1">
                                                                <div className="flex items-center justify-between">
                                                                    <span className="text-xs font-bold">{comentario.user?.name || 'Usuario'}</span>
                                                                    <span className="text-[10px] text-muted-foreground">{new Date(comentario.created_at).toLocaleDateString()}</span>
                                                                </div>
                                                                <div className="rounded-xl bg-muted/40 px-3 py-2 border border-border/50 shadow-sm">
                                                                    <p className="text-sm leading-relaxed">{comentario.contenido}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="py-8 text-center opacity-30">
                                                        <FileText className="h-8 w-8 mx-auto mb-2" />
                                                        <p className="text-xs font-medium">No hay comentarios aún</p>
                                                    </div>
                                                )}
                                            </div>

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
                                                            const updatedEvent = {
                                                                ...selectedEvent,
                                                                comentarios: [...(selectedEvent.comentarios || []), newComment],
                                                            };
                                                            if (onEventUpdated) onEventUpdated(updatedEvent);
                                                            (e.target as HTMLFormElement).reset();
                                                        });
                                                }}
                                            >
                                                <div className="flex gap-2">
                                                    <Input
                                                        name="contenido"
                                                        placeholder="Escribe un comentario..."
                                                        className="flex-1 h-9 text-sm rounded-lg"
                                                        required
                                                    />
                                                    <Button type="submit" size="sm" className="h-9 px-3">
                                                        <Plus className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="border-b border-sidebar-border bg-sidebar p-4">
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

            <DescriptionModal
                isOpen={isDescriptionModalOpen}
                onClose={() => setIsDescriptionModalOpen(false)}
                description={selectedEvent?.descripcion || ''}
                onDescriptionChange={() => { }} // Read-only in details
                title="Descripción del Evento"
                readOnly={true}
            />
        </div >
    );
}
