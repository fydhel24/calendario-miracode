import { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

interface EventInput {
    id: string;
    title: string;
    start: string;
    end?: string;
    allDay?: boolean;
}

interface FullCalendarComponentProps {
    onDateSelect?: (date: string) => void;
    onEventClick?: (eventId: string) => void;
}

export default function FullCalendarComponent({ 
    onDateSelect, 
    onEventClick 
}: FullCalendarComponentProps) {
    const [events] = useState<EventInput[]>([
        {
            id: '1',
            title: 'Reunión de equipo',
            start: '2025-12-08T10:00:00',
            end: '2025-12-08T11:00:00'
        },
        {
            id: '2',
            title: 'Presentación de proyecto',
            start: '2025-12-10T14:00:00',
            end: '2025-12-10T15:30:00'
        },
        {
            id: '3',
            title: 'Conferencia de trabajo',
            start: '2025-12-15T09:00:00',
            end: '2025-12-15T17:00:00',
            allDay: true
        }
    ]);

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
        <div className="w-full h-full bg-background/80 backdrop-blur-sm rounded-2xl border border-border/50 shadow-2xl overflow-hidden">
            <div className="p-6 h-full">
                <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    headerToolbar={{
                        left: 'prev,next today',
                        center: 'title',
                        right: 'dayGridMonth,timeGridWeek,timeGridDay'
                    }}
                    initialView="dayGridMonth"
                    editable={true}
                    selectable={true}
                    selectMirror={true}
                    dayMaxEvents={true}
                    weekends={true}
                    events={events}
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
                        next: 'Siguiente'
                    }}
                    eventDisplay="block"
                    eventBackgroundColor="rgb(37, 99, 235)"
                    eventBorderColor="rgb(37, 99, 235)"
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
                        omitCommas: true
                    }}
                    eventTimeFormat={{
                        hour: '2-digit',
                        minute: '2-digit',
                        meridiem: 'short'
                    }}
                    slotLabelFormat={{
                        hour: '2-digit',
                        minute: '2-digit',
                        omitZeroMinute: false,
                        meridiem: 'short'
                    }}
                    dayHeaderClassNames="bg-gradient-to-r from-muted/50 to-muted/30 text-muted-foreground font-semibold border-b border-border/20"
                    dayCellClassNames="hover:bg-gradient-to-br hover:from-accent/50 hover:to-accent/30 cursor-pointer transition-all duration-200 border border-transparent hover:border-accent/50"
                    eventClassNames="cursor-pointer hover:opacity-90 hover:shadow-md transition-all duration-200 border-0 rounded-md shadow-sm"
                    themeSystem="standard"
                />
            </div>
        </div>
    );
}