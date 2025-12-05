import { Button } from '@/components/ui/button';
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
}

export function RightMenu({ className, onToggle }: RightMenuProps) {
    const [activeOption, setActiveOption] = useState<string | null>(null);

    const menuOptions: MenuOption[] = [
        {
            id: 'new-event',
            label: 'Nuevo Evento',
            icon: Plus,
            content: (
                <div className="p-4">
                    <h3 className="text-lg font-semibold mb-4">Crear Nuevo Evento</h3>
                    <div className="space-y-3">
                        <div>
                            <label className="text-sm font-medium">Título del Evento</label>
                            <input 
                                type="text" 
                                className="w-full mt-1 p-2 border rounded-md"
                                placeholder="Escribe el título..."
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium">Fecha</label>
                            <input 
                                type="date" 
                                className="w-full mt-1 p-2 border rounded-md"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium">Hora</label>
                            <input 
                                type="time" 
                                className="w-full mt-1 p-2 border rounded-md"
                            />
                        </div>
                        <Button className="w-full mt-4">Crear Evento</Button>
                    </div>
                </div>
            )
        },
        {
            id: 'schedule',
            label: 'Programar',
            icon: Clock,
            content: (
                <div className="p-4">
                    <h3 className="text-lg font-semibold mb-4">Programar Tarea</h3>
                    <div className="space-y-3">
                        <div>
                            <label className="text-sm font-medium">Descripción</label>
                            <textarea 
                                className="w-full mt-1 p-2 border rounded-md"
                                rows={3}
                                placeholder="Describe la tarea..."
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium">Prioridad</label>
                            <select className="w-full mt-1 p-2 border rounded-md">
                                <option>Baja</option>
                                <option>Media</option>
                                <option>Alta</option>
                            </select>
                        </div>
                        <Button className="w-full mt-4">Programar</Button>
                    </div>
                </div>
            )
        },
        {
            id: 'invite',
            label: 'Invitar',
            icon: Users,
            content: (
                <div className="p-4">
                    <h3 className="text-lg font-semibold mb-4">Invitar Participantes</h3>
                    <div className="space-y-3">
                        <div>
                            <label className="text-sm font-medium">Email</label>
                            <input 
                                type="email" 
                                className="w-full mt-1 p-2 border rounded-md"
                                placeholder="email@ejemplo.com"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium">Mensaje</label>
                            <textarea 
                                className="w-full mt-1 p-2 border rounded-md"
                                rows={3}
                                placeholder="Mensaje de invitación..."
                            />
                        </div>
                        <Button className="w-full mt-4">Enviar Invitación</Button>
                    </div>
                </div>
            )
        },
        {
            id: 'reminder',
            label: 'Recordatorio',
            icon: Bell,
            content: (
                <div className="p-4">
                    <h3 className="text-lg font-semibold mb-4">Configurar Recordatorio</h3>
                    <div className="space-y-3">
                        <div>
                            <label className="text-sm font-medium">Tiempo antes del evento</label>
                            <select className="w-full mt-1 p-2 border rounded-md">
                                <option>5 minutos</option>
                                <option>15 minutos</option>
                                <option>30 minutos</option>
                                <option>1 hora</option>
                                <option>1 día</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-medium">Tipo de notificación</label>
                            <select className="w-full mt-1 p-2 border rounded-md">
                                <option>Notificación push</option>
                                <option>Email</option>
                                <option>SMS</option>
                            </select>
                        </div>
                        <Button className="w-full mt-4">Configurar</Button>
                    </div>
                </div>
            )
        },
        {
            id: 'settings',
            label: 'Configuración',
            icon: Settings,
            content: (
                <div className="p-4">
                    <h3 className="text-lg font-semibold mb-4">Configuración</h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm">Notificaciones</span>
                            <input type="checkbox" className="rounded" />
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm">Modo oscuro</span>
                            <input type="checkbox" className="rounded" />
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm">Sincronización</span>
                            <input type="checkbox" className="rounded" defaultChecked />
                        </div>
                        <Button className="w-full mt-4">Guardar</Button>
                    </div>
                </div>
            )
        }
    ];

    const handleOptionClick = (optionId: string) => {
        if (activeOption === optionId) {
            // Si ya está seleccionado, deseleccionar para volver a vista de iconos
            setActiveOption(null);
        } else {
            // Si no está seleccionado, mostrar contenido
            setActiveOption(optionId);
        }
    };

    const handleBackToIcons = () => {
        setActiveOption(null);
    };

    return (
        <div className={`bg-sidebar border-l border-sidebar-border h-full flex ${className}`}>
            {/* Estructura expandible: siempre los iconos + contenido cuando está activo */}
            <div className={`flex h-full transition-all duration-300 ${
                activeOption ? 'w-96' : 'w-16'
            }`}>
                {/* Iconos del menú - siempre visible */}
                <div className="flex flex-col border-r border-sidebar-border w-16">
                    <div className="flex flex-col p-2 space-y-2">
                        {menuOptions.map((option) => {
                            const Icon = option.icon;
                            return (
                                <Button
                                    key={option.id}
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleOptionClick(option.id)}
                                    className={`h-10 w-10 ${
                                        activeOption === option.id 
                                            ? 'bg-sidebar-accent text-sidebar-accent-foreground' 
                                            : ''
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
                {activeOption && (
                    <div className="flex-1 overflow-hidden">
                        <div className="h-full flex flex-col">
                            <div className="p-4 border-b border-sidebar-border">
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={handleBackToIcons}
                                        className="h-8 w-8"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>
                                    <h3 className="font-medium">
                                        {menuOptions.find(opt => opt.id === activeOption)?.label}
                                    </h3>
                                </div>
                            </div>
                            <div className="flex-1 overflow-y-auto">
                                {menuOptions.find(opt => opt.id === activeOption)?.content}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}