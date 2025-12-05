import { AppShell } from '@/components/app-shell';
import FullCalendarComponent from '@/components/full-calendar';
import { LeftSidebar } from '@/components/left-sidebar';
import { RightMenu } from '@/components/right-menu';
import { type BreadcrumbItem } from '@/types';
import { Calendar } from 'lucide-react';
import { useEffect, useState } from 'react';

interface CalendarLayoutProps {
    children?: React.ReactNode;
    breadcrumbs?: BreadcrumbItem[];
    calendarios?: any[];
    selectedCalendarId?: number;
}

export default function CalendarLayout({
    children,
    breadcrumbs = [],
    calendarios = [],
    selectedCalendarId,
}: CalendarLayoutProps) {
    const [isLeftSidebarCollapsed, setIsLeftSidebarCollapsed] = useState(true);
    const [isRightMenuExpanded, setIsRightMenuExpanded] = useState(false);
    const [calendariosState, setCalendariosState] =
        useState<any[]>(calendarios);
    const [selectedCalendar, setSelectedCalendar] = useState<any>(null);
    const [events, setEvents] = useState<any[]>([]);

    useEffect(() => {
        setCalendariosState(calendarios);
    }, [calendarios]);

    useEffect(() => {
        if (calendariosState.length > 0) {
            let calendarToSelect = calendariosState[0];
            if (selectedCalendarId) {
                const found = calendariosState.find(
                    (c) => c.id === selectedCalendarId,
                );
                if (found) {
                    calendarToSelect = found;
                }
            }
            setSelectedCalendar(calendarToSelect);
            setEvents(calendarToSelect.eventos || []);
        }
    }, [calendariosState, selectedCalendarId]);

    const toggleLeftSidebar = () => {
        setIsLeftSidebarCollapsed(!isLeftSidebarCollapsed);
    };

    const handleRightMenuExpansionChange = (expanded: boolean) => {
        setIsRightMenuExpanded(expanded);
    };

    const handleCalendarSelect = (calendar: any) => {
        setSelectedCalendar(calendar);
        setEvents(calendar.eventos || []);
    };

    // Calculate dynamic widths
    const leftSidebarWidth = isLeftSidebarCollapsed ? 64 : 256; // w-16 or w-64
    const rightMenuWidth = isRightMenuExpanded ? 384 : 64; // w-96 or w-16
    const calendarWidth = `calc(100vw - ${leftSidebarWidth}px - ${rightMenuWidth}px)`;

    return (
        <AppShell variant="sidebar">
            <div className="relative flex h-screen overflow-hidden bg-gradient-to-br from-background to-muted/20">
                {/* Sidebar izquierdo - Navegación */}
                <div className="flex">
                    {/* Botón toggle cuando está colapsado */}
                    {isLeftSidebarCollapsed && (
                        <div className="flex w-16 flex-col items-center justify-center border-r border-sidebar-border bg-gradient-to-b from-sidebar to-sidebar/95 shadow-lg">
                            <button
                                onClick={toggleLeftSidebar}
                                className="group rounded-lg p-3 transition-all duration-300 hover:scale-105 hover:bg-sidebar-accent hover:shadow-md"
                                title="Mostrar navegación"
                            >
                                <Calendar className="h-6 w-6 text-sidebar-foreground/80 transition-colors group-hover:text-sidebar-accent-foreground" />
                            </button>
                        </div>
                    )}

                    {/* Sidebar izquierdo - Navegación */}
                    <div
                        className={`${isLeftSidebarCollapsed ? 'w-0' : 'w-64'} overflow-hidden transition-all duration-300 ease-in-out`}
                    >
                        <LeftSidebar
                            className="h-full bg-gradient-to-b from-sidebar to-sidebar/95 shadow-xl"
                            isCollapsed={isLeftSidebarCollapsed}
                            onToggle={toggleLeftSidebar}
                            calendarios={calendariosState}
                            onCalendarSelect={handleCalendarSelect}
                            onCalendarCreated={(newCalendar) => {
                                setCalendariosState((prev) => [
                                    newCalendar,
                                    ...prev,
                                ]);
                                setSelectedCalendar(newCalendar);
                                setEvents(newCalendar.eventos || []);
                            }}
                        />
                    </div>
                </div>

                {/* Área principal del calendario - se ajusta dinámicamente según el menú derecho */}
                <div
                    className="p-6 transition-all duration-300 ease-in-out"
                    style={{
                        width: calendarWidth,
                        maxWidth: '100%',
                    }}
                >
                    {/* Header with calendar name */}
                    {selectedCalendar && (
                        <div className="mb-4">
                            <h1 className="text-2xl font-bold text-foreground">
                                {selectedCalendar.nombre}
                            </h1>
                            {selectedCalendar.descripcion && (
                                <p className="mt-1 text-muted-foreground">
                                    {selectedCalendar.descripcion}
                                </p>
                            )}
                        </div>
                    )}

                    <div className="h-full w-full overflow-hidden rounded-2xl border border-border/50 bg-background/50 shadow-2xl backdrop-blur-sm">
                        <FullCalendarComponent events={events} />
                    </div>
                </div>

                {/* Menú de la derecha - Siempre visible con comportamiento expandible */}
                <div className="flex-shrink-0 border-l border-sidebar-border shadow-xl">
                    <RightMenu
                        className="h-full bg-gradient-to-b from-sidebar to-sidebar/95"
                        isExpanded={isRightMenuExpanded}
                        onExpansionChange={handleRightMenuExpansionChange}
                    />
                </div>
            </div>
        </AppShell>
    );
}
