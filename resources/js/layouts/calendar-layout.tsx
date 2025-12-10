import { AppShell } from '@/components/app-shell';
import FullCalendarComponent from '@/components/full-calendar';
import { LeftSidebar } from '@/components/left-sidebar';
import { RightMenu } from '@/components/right-menu';
import { type BreadcrumbItem } from '@/types';
import { usePage } from '@inertiajs/react';
import { Calendar } from 'lucide-react';
import { useEffect, useState } from 'react';

interface CalendarLayoutProps {
    children?: React.ReactNode;
    breadcrumbs?: BreadcrumbItem[];
    calendarios?: any[];
    selectedCalendarId?: number;
    selectedCalendars?: any[];
}

export default function CalendarLayout({
    children,
    breadcrumbs = [],
    calendarios = [],
    selectedCalendarId,
    selectedCalendars: propSelectedCalendars,
}: CalendarLayoutProps) {
    const { auth } = usePage().props as any;
    const [isLeftSidebarCollapsed, setIsLeftSidebarCollapsed] = useState(true);
    const [isRightMenuExpanded, setIsRightMenuExpanded] = useState(false);
    const [calendariosState, setCalendariosState] =
        useState<any[]>(calendarios);
    const [selectedCalendars, setSelectedCalendars] = useState<any[]>([]);
    const [events, setEvents] = useState<any[]>([]);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedEvent, setSelectedEvent] = useState<any>(null);

    useEffect(() => {
        setCalendariosState(calendarios);
    }, [calendarios]);

    useEffect(() => {
        if (calendariosState.length > 0) {
            if (propSelectedCalendars && propSelectedCalendars.length > 0) {
                setSelectedCalendars(propSelectedCalendars);
                setEvents(
                    propSelectedCalendars.flatMap((c) => c.eventos || []),
                );
            } else {
                let calendarToSelect = calendariosState[0];
                if (selectedCalendarId) {
                    const found = calendariosState.find(
                        (c) => c.id === selectedCalendarId,
                    );
                    if (found) {
                        calendarToSelect = found;
                    }
                }
                setSelectedCalendars([calendarToSelect]);
                setEvents(calendarToSelect.eventos || []);
            }
        }
    }, [calendariosState, selectedCalendarId, propSelectedCalendars]);

    const toggleLeftSidebar = () => {
        setIsLeftSidebarCollapsed(!isLeftSidebarCollapsed);
    };

    const handleRightMenuExpansionChange = (expanded: boolean) => {
        setIsRightMenuExpanded(expanded);
    };

    const handleCalendarSelect = (calendar: any) => {
        setSelectedCalendars([calendar]);
        setEvents(calendar.eventos || []);
        setSelectedDate(null); // Reset selected date when changing calendar
    };

    const handleCalendarsSelect = (calendars: any[]) => {
        setSelectedCalendars(calendars);
        setEvents(calendars.flatMap((c) => c.eventos || []));
        setSelectedDate(null);
    };

    const handleDateSelect = (date: string) => {
        setSelectedDate(date);
        setSelectedEvent(null); // Clear selected event
        setIsRightMenuExpanded(true); // Expand the right menu
    };

    const handleEventClick = (eventId: string) => {
        const event = events.find((e) => e.id.toString() === eventId);
        if (event) {
            setSelectedEvent(event);
            setSelectedDate(null); // Clear selected date
            setIsRightMenuExpanded(true); // Expand the right menu
        }
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
                            onCalendarsSelect={handleCalendarsSelect}
                            onCalendarCreated={(newCalendar) => {
                                setCalendariosState((prev) => [
                                    newCalendar,
                                    ...prev,
                                ]);
                                setSelectedCalendars([newCalendar]);
                                setEvents(newCalendar.eventos || []);
                            }}
                            onCalendarUpdated={(updatedCalendar) => {
                                setCalendariosState((prev) =>
                                    prev.map((c) =>
                                        c.id === updatedCalendar.id
                                            ? updatedCalendar
                                            : c,
                                    ),
                                );
                                if (
                                    selectedCalendars.some(
                                        (c) => c.id === updatedCalendar.id,
                                    )
                                ) {
                                    setSelectedCalendars((prev) =>
                                        prev.map((c) =>
                                            c.id === updatedCalendar.id
                                                ? updatedCalendar
                                                : c,
                                        ),
                                    );
                                    setEvents(
                                        selectedCalendars.flatMap(
                                            (c) => c.eventos || [],
                                        ),
                                    );
                                }
                            }}
                            auth={auth}
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
                    {selectedCalendars.length > 0 && (
                        <div className="mb-4">
                            <h1 className="text-2xl font-bold text-foreground">
                                {selectedCalendars.length === 1
                                    ? selectedCalendars[0].nombre
                                    : 'Calendarios Combinados'}
                            </h1>
                            {selectedCalendars.length === 1 &&
                                selectedCalendars[0].descripcion && (
                                    <p className="mt-1 text-muted-foreground">
                                        {selectedCalendars[0].descripcion}
                                    </p>
                                )}
                            {selectedCalendars.length > 1 && (
                                <p className="mt-1 text-muted-foreground">
                                    {selectedCalendars
                                        .map((c) => c.nombre)
                                        .join(', ')}
                                </p>
                            )}
                        </div>
                    )}

                    <div className="h-full w-full overflow-hidden rounded-2xl border border-border/50 bg-background/50 shadow-2xl backdrop-blur-sm">
                        <FullCalendarComponent
                            events={events}
                            onDateSelect={handleDateSelect}
                            onEventClick={handleEventClick}
                        />
                    </div>
                </div>

                {/* Menú de la derecha - Siempre visible con comportamiento expandible */}
                <div className="flex-shrink-0 border-l border-sidebar-border shadow-xl">
                    <RightMenu
                        className="h-full bg-gradient-to-b from-sidebar to-sidebar/95"
                        isExpanded={isRightMenuExpanded}
                        onExpansionChange={handleRightMenuExpansionChange}
                        selectedDate={selectedDate}
                        selectedEvent={selectedEvent}
                        selectedCalendars={selectedCalendars}
                        calendarios={calendariosState}
                        onEventCreated={(newEvent) => {
                            setEvents((prev) => [...prev, newEvent]);
                            setSelectedCalendars((prev) =>
                                prev.map((cal) =>
                                    cal.id === newEvent.calendario_id
                                        ? {
                                              ...cal,
                                              eventos: cal.eventos
                                                  ? [...cal.eventos, newEvent]
                                                  : [newEvent],
                                          }
                                        : cal,
                                ),
                            );
                        }}
                        onEventUpdated={(updatedEvent) => {
                            setEvents((prev) =>
                                prev.map((e) =>
                                    e.id === updatedEvent.id ? updatedEvent : e,
                                ),
                            );
                            setSelectedCalendars((prev) =>
                                prev.map((cal) =>
                                    cal.id === updatedEvent.calendario_id
                                        ? {
                                              ...cal,
                                              eventos: cal.eventos
                                                  ? cal.eventos.map((e) =>
                                                        e.id === updatedEvent.id
                                                            ? updatedEvent
                                                            : e,
                                                    )
                                                  : [],
                                          }
                                        : cal,
                                ),
                            );
                            setSelectedEvent(updatedEvent);
                        }}
                        onEventDeleted={(eventId) => {
                            setEvents((prev) =>
                                prev.filter((e) => e.id !== eventId),
                            );
                            setSelectedCalendars((prev) =>
                                prev.map((cal) => ({
                                    ...cal,
                                    eventos: cal.eventos
                                        ? cal.eventos.filter(
                                              (e) => e.id !== eventId,
                                          )
                                        : [],
                                })),
                            );
                            setSelectedEvent(null);
                        }}
                        onCalendarUpdated={(updatedCalendar) => {
                            setCalendariosState((prev) =>
                                prev.map((c) =>
                                    c.id === updatedCalendar.id
                                        ? updatedCalendar
                                        : c,
                                ),
                            );
                            if (selectedCalendar?.id === updatedCalendar.id) {
                                setSelectedCalendar(updatedCalendar);
                            }
                        }}
                        onCalendarSelect={handleCalendarSelect}
                        onDateClear={() => setSelectedDate(null)}
                    />
                </div>
            </div>
        </AppShell>
    );
}
