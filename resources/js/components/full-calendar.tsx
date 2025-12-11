import { useIsMobile } from '@/hooks/use-mobile';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { useMemo } from 'react';

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

    const formattedEvents = useMemo(() => {
        return events.map((event) => ({
            id: event.id.toString(),
            title: event.titulo,
            start: event.fecha_inicio,
            end: event.fecha_fin,
            backgroundColor: event.color || '#2563eb',
            borderColor: event.color || '#2563eb',
        }));
    }, [events]);

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
        <div className="h-full w-full rounded-2xl border border-red-200/50 bg-white p-4 shadow-2xl backdrop-blur-sm md:p-6">
            <FullCalendar
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
                    today: 'Hoy',
                    month: 'Mes',
                    week: 'Semana',
                    day: 'Día',
                    prev: 'Anterior',
                    next: 'Siguiente',
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
                aspectRatio={1.35}
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
            />
        </div>
    );
}
