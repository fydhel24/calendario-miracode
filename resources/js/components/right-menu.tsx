import { EventCreationForm } from '@/components/event-creation-form';
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
    selectedCalendar?: any;
    onEventCreated?: (event: any) => void;
}

export function RightMenu({
    className,
    onToggle,
    isExpanded: externalIsExpanded,
    onExpansionChange,
    selectedDate,
    selectedCalendar,
    onEventCreated,
}: RightMenuProps) {
    const [internalActiveOption, setInternalActiveOption] = useState<
        string | null
    >(null);

    // Auto-select new-event when date is selected
    useEffect(() => {
        if (selectedDate && !internalActiveOption) {
            setInternalActiveOption('new-event');
            if (onExpansionChange) onExpansionChange(true);
        }
    }, [selectedDate, internalActiveOption, onExpansionChange]);
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

    // Use internal state for active option
    const activeOption = internalActiveOption;

    // Determine if menu should show expanded content
    // If external state is provided, use it; otherwise use internal active option
    const shouldShowExpandedContent =
        externalIsExpanded !== undefined
            ? externalIsExpanded
            : activeOption !== null;

    const menuOptions: MenuOption[] = [
        {
            id: 'new-event',
            label: 'Nuevo Evento',
            icon: Plus,
            content: (
                <EventCreationForm
                    selectedDate={selectedDate ?? undefined}
                    selectedCalendar={selectedCalendar}
                    onEventCreated={onEventCreated}
                />
            ),
        },
        {
            id: 'schedule',
            label: 'Programar',
            icon: Clock,
            content: (
                <div className="space-y-4 p-4">
                    <h3 className="mb-4 text-lg font-semibold">
                        Programar Tarea
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="task-description">
                                Descripción
                            </Label>
                            <Textarea
                                id="task-description"
                                placeholder="Describe la tarea..."
                                className="mt-1"
                                rows={3}
                            />
                        </div>
                        <div>
                            <Label htmlFor="task-priority">Prioridad</Label>
                            <Select>
                                <SelectTrigger className="mt-1">
                                    <SelectValue placeholder="Selecciona la prioridad" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="baja">Baja</SelectItem>
                                    <SelectItem value="media">Media</SelectItem>
                                    <SelectItem value="alta">Alta</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button className="mt-6 w-full">Programar</Button>
                    </div>
                </div>
            ),
        },
        {
            id: 'invite',
            label: 'Invitar',
            icon: Users,
            content: (
                <div className="space-y-4 p-4">
                    <h3 className="mb-4 text-lg font-semibold">
                        Invitar Participantes
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="invite-email">Email</Label>
                            <Input
                                id="invite-email"
                                type="email"
                                placeholder="email@ejemplo.com"
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <Label htmlFor="invite-message">Mensaje</Label>
                            <Textarea
                                id="invite-message"
                                placeholder="Mensaje de invitación..."
                                className="mt-1"
                                rows={3}
                            />
                        </div>
                        <Button className="mt-6 w-full">
                            Enviar Invitación
                        </Button>
                    </div>
                </div>
            ),
        },
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

                {/* Contenido - se muestra cuando hay una opción activa o fecha seleccionada */}
                {shouldShowExpandedContent && (
                    <div className="flex-1 overflow-hidden">
                        <div className="flex h-full flex-col bg-background/30 backdrop-blur-sm">
                            {selectedDate && activeOption === 'new-event' ? (
                                // Mostrar formulario de evento directamente cuando hay fecha seleccionada
                                <div className="flex-1 overflow-y-auto bg-background/50 backdrop-blur-sm">
                                    <EventCreationForm
                                        selectedDate={selectedDate}
                                        selectedCalendar={selectedCalendar}
                                        onEventCreated={onEventCreated}
                                    />
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
