import CreateCalendarModal from '@/components/create-calendar-modal';
import { Button } from '@/components/ui/button';
import {
    Calendar,
    ChevronDown,
    ChevronRight,
    HelpCircle,
    Home,
    Settings,
    Users,
} from 'lucide-react';
import { useState } from 'react';

interface LeftSidebarProps {
    className?: string;
    isCollapsed: boolean;
    onToggle: () => void;
    calendarios?: any[];
    onCalendarSelect?: (calendar: any) => void;
    onCalendarCreated?: (calendar: any) => void;
}

export function LeftSidebar({
    className,
    isCollapsed,
    onToggle,
    calendarios = [],
    onCalendarSelect,
    onCalendarCreated,
}: LeftSidebarProps) {
    const [isExpanded, setIsExpanded] = useState(true);

    const menuItems = [
        { id: 'home', label: 'Inicio', icon: Home, active: false },
        { id: 'users', label: 'Usuarios', icon: Users, active: false },
        {
            id: 'settings',
            label: 'Configuración',
            icon: Settings,
            active: false,
        },
    ];

    return (
        <div
            className={`h-full border-r border-sidebar-border bg-sidebar ${className}`}
        >
            <div className="flex items-center justify-between border-b border-sidebar-border p-4">
                <h3 className="text-sm font-medium">Navegación</h3>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onToggle}
                    className="h-8 w-8 transition-all duration-200 hover:scale-105 hover:bg-sidebar-accent"
                >
                    {isCollapsed ? (
                        <ChevronRight className="h-4 w-4" />
                    ) : (
                        <ChevronDown className="h-4 w-4" />
                    )}
                </Button>
            </div>

            <div className="p-2">
                {!isCollapsed && (
                    <div className="space-y-1">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <div
                                    key={item.id}
                                    className={`flex cursor-pointer items-center gap-2 rounded-lg p-2 transition-all duration-200 ${
                                        item.active
                                            ? 'scale-[1.02] transform bg-gradient-to-r from-sidebar-accent to-sidebar-accent/80 text-sidebar-accent-foreground shadow-md'
                                            : 'hover:scale-[1.01] hover:bg-gradient-to-r hover:from-sidebar-accent hover:to-sidebar-accent/50 hover:text-sidebar-accent-foreground hover:shadow-sm'
                                    }`}
                                >
                                    <Icon className="h-4 w-4" />
                                    <span className="text-sm">
                                        {item.label}
                                    </span>
                                </div>
                            );
                        })}

                        {/* Calendarios */}
                        <div className="border-t border-sidebar-border pt-4">
                            <div className="mb-2 flex items-center justify-between">
                                <h4 className="text-xs font-medium text-sidebar-foreground/80">
                                    Calendarios
                                </h4>
                                <CreateCalendarModal
                                    onCalendarCreated={onCalendarCreated}
                                />
                            </div>
                            <div className="space-y-1">
                                {calendarios.map((calendario) => (
                                    <div
                                        key={calendario.id}
                                        onClick={() =>
                                            onCalendarSelect &&
                                            onCalendarSelect(calendario)
                                        }
                                        className="flex cursor-pointer items-center gap-2 rounded-lg p-2 transition-all duration-200 hover:scale-[1.01] hover:bg-gradient-to-r hover:from-sidebar-accent hover:to-sidebar-accent/50 hover:text-sidebar-accent-foreground hover:shadow-sm"
                                    >
                                        <Calendar className="h-4 w-4" />
                                        <span className="truncate text-sm">
                                            {calendario.nombre}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="border-t border-sidebar-border pt-4">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-full justify-start gap-2 transition-all duration-200 hover:scale-105 hover:bg-sidebar-accent"
                            >
                                <HelpCircle className="h-4 w-4" />
                                <span className="text-sm">Ayuda</span>
                            </Button>
                        </div>
                    </div>
                )}

                {isCollapsed && (
                    <div className="space-y-1">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Button
                                    key={item.id}
                                    variant="ghost"
                                    size="icon"
                                    className={`h-10 w-full transition-all duration-200 hover:scale-110 ${
                                        item.active
                                            ? 'bg-gradient-to-b from-sidebar-accent to-sidebar-accent/80 text-sidebar-accent-foreground shadow-md'
                                            : 'hover:bg-sidebar-accent hover:shadow-sm'
                                    }`}
                                    title={item.label}
                                >
                                    <Icon className="h-4 w-4" />
                                </Button>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
