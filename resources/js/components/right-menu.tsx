import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { 
    Plus, 
    Calendar, 
    Clock, 
    Users, 
    Bell, 
    Settings,
    X,
    ChevronRight,
    ChevronLeft
} from 'lucide-react';
import { useState } from 'react';

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
}

export function RightMenu({ className, onToggle, isExpanded: externalIsExpanded, onExpansionChange }: RightMenuProps) {
    const [internalActiveOption, setInternalActiveOption] = useState<string | null>(null);

    // Use internal state for active option
    const activeOption = internalActiveOption;
    
    // Determine if menu should show expanded content
    // If external state is provided, use it; otherwise use internal active option
    const shouldShowExpandedContent = externalIsExpanded !== undefined ? externalIsExpanded : activeOption !== null;

    const menuOptions: MenuOption[] = [
        {
            id: 'new-event',
            label: 'Nuevo Evento',
            icon: Plus,
            content: (
                <div className="p-4 space-y-4">
                    <h3 className="text-lg font-semibold mb-4">Crear Nuevo Evento</h3>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="event-title">Título del Evento</Label>
                            <Input 
                                id="event-title"
                                type="text" 
                                placeholder="Escribe el título..."
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <Label htmlFor="event-date">Fecha</Label>
                            <Input 
                                id="event-date"
                                type="date" 
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <Label htmlFor="event-time">Hora</Label>
                            <Input 
                                id="event-time"
                                type="time" 
                                className="mt-1"
                            />
                        </div>
                        <Button className="w-full mt-6">Crear Evento</Button>
                    </div>
                </div>
            )
        },
        {
            id: 'schedule',
            label: 'Programar',
            icon: Clock,
            content: (
                <div className="p-4 space-y-4">
                    <h3 className="text-lg font-semibold mb-4">Programar Tarea</h3>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="task-description">Descripción</Label>
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
                        <Button className="w-full mt-6">Programar</Button>
                    </div>
                </div>
            )
        },
        {
            id: 'invite',
            label: 'Invitar',
            icon: Users,
            content: (
                <div className="p-4 space-y-4">
                    <h3 className="text-lg font-semibold mb-4">Invitar Participantes</h3>
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
                        <Button className="w-full mt-6">Enviar Invitación</Button>
                    </div>
                </div>
            )
        },
        {
            id: 'reminder',
            label: 'Recordatorio',
            icon: Bell,
            content: (
                <div className="p-4 space-y-4">
                    <h3 className="text-lg font-semibold mb-4">Configurar Recordatorio</h3>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="reminder-time">Tiempo antes del evento</Label>
                            <Select>
                                <SelectTrigger className="mt-1">
                                    <SelectValue placeholder="Selecciona el tiempo" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="5">5 minutos</SelectItem>
                                    <SelectItem value="15">15 minutos</SelectItem>
                                    <SelectItem value="30">30 minutos</SelectItem>
                                    <SelectItem value="60">1 hora</SelectItem>
                                    <SelectItem value="1440">1 día</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="reminder-type">Tipo de notificación</Label>
                            <Select>
                                <SelectTrigger className="mt-1">
                                    <SelectValue placeholder="Selecciona el tipo" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="push">Notificación push</SelectItem>
                                    <SelectItem value="email">Email</SelectItem>
                                    <SelectItem value="sms">SMS</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button className="w-full mt-6">Configurar</Button>
                    </div>
                </div>
            )
        },
        {
            id: 'settings',
            label: 'Configuración',
            icon: Settings,
            content: (
                <div className="p-4 space-y-4">
                    <h3 className="text-lg font-semibold mb-4">Configuración</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="notifications">Notificaciones</Label>
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
                        <Button className="w-full mt-6">Guardar</Button>
                    </div>
                </div>
            )
        }
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
        <div className={`bg-sidebar border-l border-sidebar-border h-full flex ${className}`}>
            {/* Estructura expandible: siempre los iconos + contenido cuando está activo */}
            <div className={`flex h-full transition-all duration-300 ease-in-out ${
                shouldShowExpandedContent ? 'w-96' : 'w-16'
            }`}>
                {/* Iconos del menú - siempre visible */}
                <div className="flex flex-col border-r border-sidebar-border w-16 bg-gradient-to-b from-sidebar to-sidebar/95">
                    <div className="flex flex-col p-2 space-y-2">
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
                                            ? 'bg-gradient-to-b from-sidebar-accent to-sidebar-accent/80 text-sidebar-accent-foreground shadow-md transform scale-105' 
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

                {/* Contenido - se muestra cuando hay una opción activa */}
                {shouldShowExpandedContent && (
                    <div className="flex-1 overflow-hidden">
                        <div className="h-full flex flex-col bg-background/30 backdrop-blur-sm">
                            <div className="p-4 border-b border-sidebar-border bg-gradient-to-r from-sidebar to-sidebar/95">
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={handleBackToIcons}
                                        className="h-8 w-8 hover:bg-sidebar-accent hover:scale-105 transition-all duration-200"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>
                                    <h3 className="font-medium text-sidebar-foreground">
                                        {menuOptions.find(opt => opt.id === activeOption)?.label}
                                    </h3>
                                </div>
                            </div>
                            <div className="flex-1 overflow-y-auto bg-background/50 backdrop-blur-sm">
                                {menuOptions.find(opt => opt.id === internalActiveOption)?.content}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}