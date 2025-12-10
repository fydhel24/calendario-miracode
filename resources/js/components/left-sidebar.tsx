import CreateCalendarModal from '@/components/create-calendar-modal';
import EditCalendarModal from '@/components/edit-calendar-modal';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { router } from '@inertiajs/react';
import {
    Calendar,
    ChevronDown,
    ChevronRight,
    Edit,
    HelpCircle,
    Settings,
    Trash2,
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface LeftSidebarProps {
    className?: string;
    isCollapsed: boolean;
    onToggle: () => void;
    calendarios?: any[];
    onCalendarSelect?: (calendar: any) => void;
    onCalendarsSelect?: (calendars: any[]) => void;
    onCalendarCreated?: (calendar: any) => void;
    onCalendarUpdated?: (calendar: any) => void;
    auth?: any;
}

export function LeftSidebar({
    className,
    isCollapsed,
    onToggle,
    calendarios = [],
    onCalendarSelect,
    onCalendarsSelect,
    onCalendarCreated,
    onCalendarUpdated,
    auth,
}: LeftSidebarProps) {
    const [isExpanded, setIsExpanded] = useState(true);
    const [editingCalendar, setEditingCalendar] = useState<any>(null);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedCalendarIds, setSelectedCalendarIds] = useState<number[]>(
        [],
    );
    const selectAll =
        selectedCalendarIds.length ===
            calendarios.filter((c) =>
                c.users?.some((u: any) => u.id === auth?.user?.id),
            ).length && selectedCalendarIds.length > 0;

    useEffect(() => {
        const selectedCalendars = calendarios.filter((c) =>
            selectedCalendarIds.includes(c.id),
        );
        onCalendarsSelect?.(selectedCalendars);
    }, [selectedCalendarIds, calendarios, onCalendarsSelect]);

    const menuItems = [
        {
            id: 'settings',
            label: 'Configuración',
            icon: Settings,
            active: false,
        },
    ];

    return (
        <div
            className={`flex h-full flex-col border-r border-sidebar-border/50 bg-gradient-to-b from-sidebar to-sidebar/95 shadow-xl ${className}`}
        >
            <div className="flex flex-shrink-0 items-center justify-between border-b border-sidebar-border/30 bg-gradient-to-r from-sidebar/90 to-sidebar p-4">
                <div className="flex items-center gap-2">
                    <div className="h-6 w-1 rounded-full bg-gradient-to-b from-primary to-primary/60"></div>
                    <h3 className="text-sm font-semibold text-sidebar-foreground">
                        Navegación
                    </h3>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onToggle}
                    className="h-8 w-8 transition-all duration-200 hover:scale-110 hover:bg-sidebar-accent hover:shadow-md"
                >
                    {isCollapsed ? (
                        <ChevronRight className="h-4 w-4" />
                    ) : (
                        <ChevronDown className="h-4 w-4" />
                    )}
                </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-2">
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
                        <div className="border-t border-sidebar-border/30 pt-4">
                            <div className="mb-3 flex items-center justify-between">
                                <h4 className="text-xs font-semibold tracking-wide text-sidebar-foreground/90 uppercase">
                                    Calendarios
                                </h4>
                                <CreateCalendarModal
                                    onCalendarCreated={onCalendarCreated}
                                />
                            </div>
                            <div className="mb-2 flex items-center gap-2">
                                <Checkbox
                                    id="select-all"
                                    checked={selectAll}
                                    onCheckedChange={(checked) => {
                                        if (checked) {
                                            const allIds = calendarios
                                                .filter((calendario) =>
                                                    calendario.users?.some(
                                                        (u: any) =>
                                                            u.id ===
                                                            auth?.user?.id,
                                                    ),
                                                )
                                                .map((c) => c.id);
                                            setSelectedCalendarIds(allIds);
                                        } else {
                                            setSelectedCalendarIds([]);
                                        }
                                    }}
                                />
                                <label
                                    htmlFor="select-all"
                                    className="text-xs font-medium text-sidebar-foreground/80"
                                >
                                    Seleccionar Todos
                                </label>
                            </div>

                            {/* Mis Calendarios */}
                            <div className="mb-4">
                                <h5 className="mb-2 text-xs font-medium text-sidebar-foreground/60">
                                    Mis Calendarios
                                </h5>
                                <div className="space-y-1">
                                    {calendarios
                                        .filter((calendario) =>
                                            calendario.users?.some(
                                                (u: any) =>
                                                    u.id === auth?.user?.id &&
                                                    u.pivot?.tipo_user ===
                                                        'owner',
                                            ),
                                        )
                                        .map((calendario) => (
                                            <div
                                                key={calendario.id}
                                                className="group flex items-center justify-between rounded-xl p-2.5 transition-all duration-200 hover:bg-gradient-to-r hover:from-sidebar-accent hover:to-sidebar-accent/60 hover:shadow-md hover:scale-[1.02] border border-transparent hover:border-sidebar-border/30"
                                            >
                                                <div className="flex flex-1 items-center gap-2">
                                                    <Checkbox
                                                        checked={selectedCalendarIds.includes(
                                                            calendario.id,
                                                        )}
                                                        onCheckedChange={(
                                                            checked,
                                                        ) => {
                                                            if (checked) {
                                                                setSelectedCalendarIds(
                                                                    (prev) => [
                                                                        ...prev,
                                                                        calendario.id,
                                                                    ],
                                                                );
                                                            } else {
                                                                setSelectedCalendarIds(
                                                                    (prev) =>
                                                                        prev.filter(
                                                                            (
                                                                                id,
                                                                            ) =>
                                                                                id !==
                                                                                calendario.id,
                                                                        ),
                                                                );
                                                            }
                                                        }}
                                                    />
                                                    <div
                                                        onClick={() =>
                                                            onCalendarSelect &&
                                                            onCalendarSelect(
                                                                calendario,
                                                            )
                                                        }
                                                        className="flex flex-1 cursor-pointer items-center gap-2 hover:text-sidebar-accent-foreground"
                                                    >
                                                        <Calendar className="h-4 w-4" />
                                                        <span className="truncate text-sm">
                                                            {calendario.nombre}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-6 w-6 hover:bg-sidebar-accent"
                                                        title="Editar calendario"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setEditingCalendar(
                                                                calendario,
                                                            );
                                                            setEditModalOpen(
                                                                true,
                                                            );
                                                        }}
                                                    >
                                                        <Edit className="h-3 w-3" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-6 w-6 hover:bg-destructive hover:text-destructive-foreground"
                                                        title="Eliminar calendario"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            if (
                                                                confirm(
                                                                    '¿Estás seguro de que quieres eliminar este calendario?',
                                                                )
                                                            ) {
                                                                router.delete(
                                                                    `/calendarios/${calendario.id}`,
                                                                );
                                                            }
                                                        }}
                                                    >
                                                        <Trash2 className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>

                            {/* Calendarios Invitados */}
                            <div>
                                <h5 className="mb-2 text-xs font-medium text-sidebar-foreground/60">
                                    Calendarios Invitados
                                </h5>
                                <div className="space-y-1">
                                    {calendarios
                                        .filter((calendario) =>
                                            calendario.users?.some(
                                                (u: any) =>
                                                    u.id === auth?.user?.id &&
                                                    u.pivot?.tipo_user !==
                                                        'owner',
                                            ),
                                        )
                                        .map((calendario) => (
                                            <div
                                                key={calendario.id}
                                                className="group flex items-center justify-between rounded-xl p-2.5 transition-all duration-200 hover:bg-gradient-to-r hover:from-sidebar-accent hover:to-sidebar-accent/60 hover:shadow-md hover:scale-[1.02] border border-transparent hover:border-sidebar-border/30"
                                            >
                                                <div className="flex flex-1 items-center gap-2">
                                                    <Checkbox
                                                        checked={selectedCalendarIds.includes(
                                                            calendario.id,
                                                        )}
                                                        onCheckedChange={(
                                                            checked,
                                                        ) => {
                                                            if (checked) {
                                                                setSelectedCalendarIds(
                                                                    (prev) => [
                                                                        ...prev,
                                                                        calendario.id,
                                                                    ],
                                                                );
                                                            } else {
                                                                setSelectedCalendarIds(
                                                                    (prev) =>
                                                                        prev.filter(
                                                                            (
                                                                                id,
                                                                            ) =>
                                                                                id !==
                                                                                calendario.id,
                                                                        ),
                                                                );
                                                            }
                                                        }}
                                                    />
                                                    <div
                                                        onClick={() =>
                                                            onCalendarSelect &&
                                                            onCalendarSelect(
                                                                calendario,
                                                            )
                                                        }
                                                        className="flex flex-1 cursor-pointer items-center gap-2 hover:text-sidebar-accent-foreground"
                                                    >
                                                        <Calendar className="h-4 w-4" />
                                                        <span className="truncate text-sm">
                                                            {calendario.nombre}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-sidebar-border/30 pt-4">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-9 w-full justify-start gap-2 transition-all duration-200 hover:scale-105 hover:bg-gradient-to-r hover:from-sidebar-accent hover:to-sidebar-accent/80 hover:shadow-md rounded-lg"
                            >
                                <HelpCircle className="h-4 w-4" />
                                <span className="text-sm font-medium">Ayuda</span>
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

            <EditCalendarModal
                calendar={editingCalendar}
                open={editModalOpen}
                onOpenChange={setEditModalOpen}
                onCalendarUpdated={onCalendarUpdated}
            />
        </div>
    );
}
