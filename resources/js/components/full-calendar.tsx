import { useIsMobile } from '@/hooks/use-mobile';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { useEffect, useMemo, useRef } from 'react';

interface EventInput {
    id: string;
    title: string;
    start: string;
    end?: string;
    allDay?: boolean;
}

interface BackendEvent {
    id: number;
    titulo: string;
    descripcion?: string;
    fecha_inicio: string;
    fecha_fin?: string;
    color?: string;
    emoji?: string;
}

interface FullCalendarComponentProps {
    events?: BackendEvent[];
    onDateSelect?: (date: string) => void;
    onEventClick?: (eventId: string) => void;
}

export default function FullCalendarComponent({
    events = [],
    onDateSelect,
    onEventClick,
}: FullCalendarComponentProps) {
    const isMobile = useIsMobile();
    const calendarRef = useRef<any>(null);

    const formattedEvents = useMemo(() => {
        return events.map((event) => ({
            id: event.id.toString(),
            title: `${event.emoji || '📱'} ${event.titulo}`,
            start: event.fecha_inicio,
            end: event.fecha_fin,
            backgroundColor: event.color || '#2563eb',
            borderColor: event.color || '#2563eb',
        }));
    }, [events]);

    useEffect(() => {
        const resizeObserver = new ResizeObserver(() => {
            if (calendarRef.current) {
                calendarRef.current.getApi().updateSize();
            }
        });
        const container = document.querySelector('.full-calendar-container');
        if (container) {
            resizeObserver.observe(container);
        }
        return () => {
            if (container) {
                resizeObserver.unobserve(container);
            }
        };
    }, []);

    const handleDateClick = (info: any) => {
        if (onDateSelect) {
            onDateSelect(info.dateStr);
        }
    };

    const handleEventClick = (info: any) => {
        if (onEventClick) {
            onEventClick(info.event.id);
        }
    };

    return (
        <div className="full-calendar-container h-full w-full rounded-2xl border border-red-200 bg-background p-4 shadow-2xl backdrop-blur-sm md:p-6">
            <style>{`
                .fc-header-toolbar {
                    background: linear-gradient(to right, transparent, rgba(239, 68, 68, 0.1), transparent);
                    border-bottom: 1px solid rgba(239, 68, 68, 0.2);
                    padding: 0.5rem;
                    border-radius: 0.75rem 0.75rem 0 0;
                }
                .fc-button {
                    color: rgb(185, 28, 28);
                    font-weight: bold;
                    background: white;
                    border: 1px solid rgb(220, 38, 38);
                    border-radius: 0.375rem;
                    padding: 0.25rem 0.75rem;
                    transition: all 0.2s;
                    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
                }
                .fc-button:hover {
                    color: rgb(127, 29, 29);
                    background: rgb(254, 242, 242);
                }
                .fc-col-header {
                    border-bottom: 2px solid rgb(220, 38, 38);
                    background: rgba(239, 68, 68, 0.05);
                }
                .fc-day-today {
                    background-color: rgba(239, 68, 68, 0.15) !important;
                }
                .fc-daygrid-day {
                    border: 1px solid rgba(220, 38, 38, 0.1);
                }
                .fc-toolbar-title {
                    color: rgb(185, 28, 28);
                    font-weight: 700;
                    font-size: 1.25rem;
                }
            `}</style>
            <FullCalendar
                ref={calendarRef}
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: isMobile
                        ? 'dayGridMonth'
                        : 'dayGridMonth,timeGridWeek,timeGridDay',
                }}
                initialView="dayGridMonth"
                editable={true}
                selectable={true}
                selectMirror={true}
                dayMaxEvents={true}
                weekends={true}
                events={formattedEvents}
                dateClick={handleDateClick}
                eventClick={handleEventClick}
                height="100%"
                locale="es"
                buttonText={{
                    today: 'HOY',
                    month: 'MES',
                    week: 'SEMANA',
                    day: 'DÍA',
                    prev: 'ANTERIOR',
                    next: 'SIGUIENTE',
                }}
                eventDisplay="block"
                displayEventTime={false}
                eventBackgroundColor="#3b82f6"
                eventBorderColor="#2563eb"
                eventTextColor="#ffffff"
                allDayText="Todo el día"
                moreLinkText="más"
                noEventsText="No hay eventos para mostrar"
                weekText="Sm"
                allDaySlot={true}
                slotMinTime="06:00:00"
                slotMaxTime="22:00:00"
                expandRows={true}
                contentHeight="auto"
                dayHeaderFormat={{
                    weekday: 'short',
                    day: 'numeric',
                    omitCommas: true,
                }}
                slotLabelFormat={{
                    hour: '2-digit',
                    minute: '2-digit',
                    omitZeroMinute: false,
                    meridiem: 'short',
                }}
                dayHeaderClassNames="bg-muted/30 text-muted-foreground font-semibold"
                dayCellClassNames="hover:bg-primary/5 cursor-pointer transition-colors duration-200"
                eventClassNames="cursor-pointer hover:shadow-md hover:scale-[1.02] transition-all duration-200 shadow-sm"
                windowResizeDelay={0}
            />
        </div>
    );
}
