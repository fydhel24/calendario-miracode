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
            <div className="relative flex h-screen overflow-hidden bg-gradient-to-br from-red-500 via-red-300 to-white">
                {/* Sidebar izquierdo - Navegación - Hidden on mobile, overlay on tablet */}
                <div className="hidden lg:flex">
                    {/* Botón toggle cuando está colapsado */}
                    {isLeftSidebarCollapsed && (
                        <div className="flex w-16 flex-col items-center justify-center border-r border-red-200/50 bg-gradient-to-b from-red-400 to-white shadow-xl">
                            <button
                                onClick={toggleLeftSidebar}
                                className="group rounded-xl p-3 transition-all duration-300 hover:scale-110 hover:bg-gradient-to-r hover:from-red-500 hover:to-red-400 hover:shadow-lg"
                                title="Mostrar navegación"
                            >
                                <Calendar className="h-6 w-6 text-sidebar-foreground/80 drop-shadow-sm transition-colors group-hover:text-sidebar-accent-foreground" />
                            </button>
                        </div>
                    )}

                    {/* Sidebar izquierdo - Navegación */}
                    <div
                        className={`${isLeftSidebarCollapsed ? 'w-0' : 'w-64'} overflow-hidden transition-all duration-300 ease-in-out`}
                    >
                        <LeftSidebar
                            className="h-full bg-gradient-to-b from-red-400 to-white shadow-xl"
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
                                    setSelectedCalendars((prev) => {
                                        const updated = prev.map((c) =>
                                            c.id === updatedCalendar.id
                                                ? updatedCalendar
                                                : c,
                                        );
                                        // Update events with the new selectedCalendars
                                        setEvents(
                                            updated.flatMap(
                                                (c) => c.eventos || [],
                                            ),
                                        );
                                        return updated;
                                    });
                                }
                            }}
                            auth={auth}
                        />
                    </div>
                </div>

                {/* Área principal del calendario - se ajusta dinámicamente según el menú derecho */}
                <div className="min-w-0 flex-1 p-2 transition-all duration-300 ease-in-out sm:p-4 lg:p-6">
                    {/* Mobile/Tablet header with controls */}
                    <div className="mb-3 flex items-center justify-between sm:mb-6 lg:hidden">
                        <button
                            onClick={toggleLeftSidebar}
                            className="group rounded-xl bg-gradient-to-r from-red-400 to-red-300 p-3 shadow-lg transition-all duration-200 hover:scale-105 hover:from-red-500 hover:to-red-400 hover:shadow-xl"
                            title="Mostrar navegación"
                        >
                            <Calendar className="h-5 w-5 text-sidebar-foreground transition-colors group-hover:text-sidebar-accent-foreground" />
                        </button>
                        <button
                            onClick={() =>
                                setIsRightMenuExpanded(!isRightMenuExpanded)
                            }
                            className="group rounded-xl bg-gradient-to-r from-red-400 to-red-300 p-3 shadow-lg transition-all duration-200 hover:scale-105 hover:from-red-500 hover:to-red-400 hover:shadow-xl"
                            title="Mostrar menú"
                        >
                            <Calendar className="h-5 w-5 text-sidebar-foreground transition-colors group-hover:text-sidebar-accent-foreground" />
                        </button>
                    </div>

                    {/* Header with calendar name */}
                    {selectedCalendars.length > 0 && (
                        <div className="mb-3 sm:mb-6">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-1 rounded-full bg-gradient-to-b from-primary to-primary/60"></div>
                                <div className="min-w-0 flex-1">
                                    <h1 className="truncate bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-xl font-bold text-foreground sm:text-2xl lg:text-3xl">
                                        {selectedCalendars.length === 1
                                            ? selectedCalendars[0].nombre
                                            : 'Calendarios Combinados'}
                                    </h1>
                                    {selectedCalendars.length === 1 &&
                                        selectedCalendars[0].descripcion && (
                                            <p className="mt-1 line-clamp-2 text-sm font-medium text-muted-foreground/80">
                                                {
                                                    selectedCalendars[0]
                                                        .descripcion
                                                }
                                            </p>
                                        )}
                                    {selectedCalendars.length > 1 && (
                                        <p className="mt-1 line-clamp-2 text-sm font-medium text-muted-foreground/80">
                                            {selectedCalendars
                                                .map((c) => c.nombre)
                                                .join(' • ')}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="h-full w-full overflow-hidden rounded-2xl border border-red-200/50 bg-gradient-to-br from-red-400/80 via-red-200/90 to-white/95 shadow-2xl backdrop-blur-md sm:rounded-3xl">
                        <FullCalendarComponent
                            events={events}
                            onDateSelect={handleDateSelect}
                            onEventClick={handleEventClick}
                        />
                    </div>
                </div>

                {/* Menú de la derecha - Hidden on mobile/tablet, overlay on larger screens */}
                <div className="hidden flex-shrink-0 border-l border-red-200/50 shadow-xl xl:flex">
                    <RightMenu
                        className="h-full bg-gradient-to-b from-red-400 to-white"
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
                                                  ? cal.eventos.map((e: any) =>
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
                                              (e: any) => e.id !== eventId,
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
                            }
                        }}
                        onCalendarSelect={handleCalendarSelect}
                        onDateClear={() => setSelectedDate(null)}
                    />
                </div>

                {/* Mobile Right Menu Overlay */}
                {isRightMenuExpanded && (
                    <div
                        className="fixed inset-0 z-50 bg-black/50 xl:hidden"
                        onClick={() => setIsRightMenuExpanded(false)}
                    >
                        <div
                            className="absolute top-0 right-0 h-full w-full max-w-sm bg-gradient-to-b from-red-400 to-white shadow-xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <RightMenu
                                className="h-full"
                                isExpanded={true}
                                onExpansionChange={setIsRightMenuExpanded}
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
                                                          ? [
                                                                ...cal.eventos,
                                                                newEvent,
                                                            ]
                                                          : [newEvent],
                                                  }
                                                : cal,
                                        ),
                                    );
                                }}
                                onEventUpdated={(updatedEvent) => {
                                    setEvents((prev) =>
                                        prev.map((e: any) =>
                                            e.id === updatedEvent.id
                                                ? updatedEvent
                                                : e,
                                        ),
                                    );
                                    setSelectedCalendars((prev) =>
                                        prev.map((cal) =>
                                            cal.id ===
                                            updatedEvent.calendario_id
                                                ? {
                                                      ...cal,
                                                      eventos: cal.eventos
                                                          ? cal.eventos.map(
                                                                (e: any) =>
                                                                    e.id ===
                                                                    updatedEvent.id
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
                                                      (e: any) =>
                                                          e.id !== eventId,
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
                                    }
                                }}
                                onCalendarSelect={handleCalendarSelect}
                                onDateClear={() => setSelectedDate(null)}
                            />
                        </div>
                    </div>
                )}

                {/* Mobile Left Sidebar Overlay */}
                {!isLeftSidebarCollapsed && (
                    <div
                        className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                        onClick={toggleLeftSidebar}
                    >
                        <div
                            className="absolute top-0 left-0 h-full w-full max-w-sm bg-gradient-to-b from-red-400 to-white shadow-xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <LeftSidebar
                                className="h-full"
                                isCollapsed={false}
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
                                        setSelectedCalendars((prev) => {
                                            const updated = prev.map((c) =>
                                                c.id === updatedCalendar.id
                                                    ? updatedCalendar
                                                    : c,
                                            );
                                            // Update events with the new selectedCalendars
                                            setEvents(
                                                updated.flatMap(
                                                    (c) => c.eventos || [],
                                                ),
                                            );
                                            return updated;
                                        });
                                    }
                                }}
                                auth={auth}
                            />
                        </div>
                    </div>
                )}
            </div>
        </AppShell>
    );
}
