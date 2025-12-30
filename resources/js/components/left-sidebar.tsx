import AppearanceToggleDropdown from '@/components/appearance-dropdown';
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
    Trash2,
} from 'lucide-react';
import { useState } from 'react';

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
    selectedCalendarIds?: number[];
    onCalendarIdsChange?: (ids: number[]) => void;
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
    selectedCalendarIds = [],
    onCalendarIdsChange,
}: LeftSidebarProps) {
    const [isExpanded, setIsExpanded] = useState(true);
    const [editingCalendar, setEditingCalendar] = useState<any>(null);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const selectAll =
        selectedCalendarIds.length ===
        calendarios.filter((c) =>
            c.users?.some((u: any) => u.id === auth?.user?.id),
        ).length && selectedCalendarIds.length > 0;

    return (
        <div
            className={`flex h-full flex-col border-r border-border bg-background shadow-xl ${className}`}
        >
            <div className="flex flex-shrink-0 items-center justify-between border-b border-sidebar-border/30 bg-sidebar p-4">
                <div className="flex items-center gap-2">
                    <div className="h-6 w-1 rounded-full bg-primary"></div>
                    <h3 className="text-sm font-semibold text-sidebar-foreground">
                        Navegación
                    </h3>
                </div>
                <div className="flex items-center gap-2">
                    <AppearanceToggleDropdown />
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
            </div>

            <div className="flex-1 overflow-y-auto p-2">
                {!isCollapsed && (
                    <div className="space-y-1">
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
                                            onCalendarIdsChange?.(allIds);
                                        } else {
                                            onCalendarIdsChange?.([]);
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
                                        .map((calendario) => {
                                            const templateColor = calendario.template || '#000000';
                                            const isSelected = selectedCalendarIds.includes(calendario.id);

                                            return (
                                                <div
                                                    key={calendario.id}
                                                    className={`calendar-item group ${isSelected ? 'calendar-item-selected' : ''}`}
                                                    style={{
                                                        borderColor: templateColor,
                                                        boxShadow: `0 0 20px ${templateColor}15, inset 0 0 20px ${templateColor}08`
                                                    }}
                                                >
                                                    {/* Color Badge */}
                                                    <div
                                                        className="calendar-color-badge"
                                                        style={{ backgroundColor: templateColor }}
                                                        title={`Color: ${templateColor}`}
                                                    />

                                                    <div className="flex items-center gap-2.5">
                                                        <Checkbox
                                                            checked={isSelected}
                                                            onCheckedChange={(
                                                                checked,
                                                            ) => {
                                                                if (checked) {
                                                                    onCalendarIdsChange?.(
                                                                        [
                                                                            ...selectedCalendarIds,
                                                                            calendario.id,
                                                                        ],
                                                                    );
                                                                } else {
                                                                    onCalendarIdsChange?.(
                                                                        selectedCalendarIds.filter(
                                                                            (id) =>
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
                                                            className="flex flex-1 cursor-pointer items-center gap-2.5 hover:text-primary transition-colors"
                                                        >
                                                            <Calendar className="h-4 w-4" />
                                                            <span className="truncate text-sm font-medium">
                                                                {calendario.nombre}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-1.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-7 w-7 hover:bg-primary/10 hover:text-primary"
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
                                                                <Edit className="h-3.5 w-3.5" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-7 w-7 hover:bg-destructive/10 hover:text-destructive"
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
                                                                <Trash2 className="h-3.5 w-3.5" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
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
                                        .map((calendario) => {
                                            const templateColor = calendario.template?.color || '#000000';
                                            const isSelected = selectedCalendarIds.includes(calendario.id);

                                            return (
                                                <div
                                                    key={calendario.id}
                                                    className={`calendar-item group ${isSelected ? 'calendar-item-selected' : ''}`}
                                                    style={{
                                                        borderColor: templateColor,
                                                        boxShadow: `0 0 20px ${templateColor}15, inset 0 0 20px ${templateColor}08`
                                                    }}
                                                >
                                                    {/* Color Badge */}
                                                    <div
                                                        className="calendar-color-badge"
                                                        style={{ backgroundColor: templateColor }}
                                                        title={`Color: ${templateColor}`}
                                                    />

                                                    <div className="flex items-center gap-2.5">
                                                        <Checkbox
                                                            checked={isSelected}
                                                            onCheckedChange={(
                                                                checked,
                                                            ) => {
                                                                if (checked) {
                                                                    onCalendarIdsChange?.(
                                                                        [
                                                                            ...selectedCalendarIds,
                                                                            calendario.id,
                                                                        ],
                                                                    );
                                                                } else {
                                                                    onCalendarIdsChange?.(
                                                                        selectedCalendarIds.filter(
                                                                            (id) =>
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
                                                            className="flex flex-1 cursor-pointer items-center gap-2.5 hover:text-primary transition-colors"
                                                        >
                                                            <Calendar className="h-4 w-4" />
                                                            <span className="truncate text-sm font-medium">
                                                                {calendario.nombre}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {isCollapsed && (
                    <div className="space-y-1">
                        <div className="flex justify-center py-2">
                            <AppearanceToggleDropdown />
                        </div>
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
