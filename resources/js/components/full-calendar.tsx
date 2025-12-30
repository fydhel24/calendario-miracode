// src/components/full-calendar.tsx
import { useIsMobile } from '@/hooks/use-mobile'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import { useEffect, useMemo, useRef } from 'react'

interface BackendEvent {
  id: number
  titulo: string
  descripcion?: string
  fecha_inicio: string
  fecha_fin?: string
  color?: string
  emoji?: string
  template?: string
}

interface FullCalendarComponentProps {
  events?: BackendEvent[]
  onDateSelect?: (date: string) => void
  onEventClick?: (eventId: string) => void
}

export default function FullCalendarComponent({
  events = [],
  onDateSelect,
  onEventClick,
}: FullCalendarComponentProps) {
  const isMobile = useIsMobile()
  const calendarRef = useRef<any>(null)

  const formattedEvents = useMemo(() => {
    return events.map((event) => {
      const backgroundColor = event.template || 'hsl(var(--primary))'
      const stripColor = event.color || event.template || 'hsl(var(--primary))'

      return {
        id: event.id.toString(),
        title: event.titulo,
        start: event.fecha_inicio,
        end: event.fecha_fin,
        backgroundColor,
        borderColor: backgroundColor,
        textColor: '#ffffff',
        extendedProps: {
          emoji: event.emoji,
          stripColor,
        },
      }
    })
  }, [events])

  const renderEventContent = (eventInfo: any) => {
    const { emoji, stripColor } = eventInfo.event.extendedProps

    return (
      <div className="group relative flex h-full w-full items-center overflow-hidden rounded-sm">
        {emoji && (
          <div
            className="flex h-full w-7 min-w-[28px] items-center justify-center text-sm font-semibold"
            style={{ backgroundColor: stripColor }}
          >
            {emoji}
          </div>
        )}
        <div className="min-w-0 flex-1 truncate px-1.5 text-xs font-medium text-white">
          {eventInfo.event.title}
        </div>
        {/* Hover overlay */}
        <div className="pointer-events-none absolute inset-0 rounded-sm bg-black/10 opacity-0 transition-opacity group-hover:opacity-100" />
      </div>
    )
  }

  // Mantener tamaño actualizado
  useEffect(() => {
    const api = calendarRef.current?.getApi()
    if (!api) return

    const resizeObserver = new ResizeObserver(() => {
      api.updateSize()
    })

    const container = document.querySelector('.full-calendar-container')
    if (container) {
      resizeObserver.observe(container)
    }

    return () => {
      if (container) resizeObserver.unobserve(container)
    }
  }, [])

  const handleDateClick = (info: any) => {
    onDateSelect?.(info.dateStr)
  }

  const handleEventClick = (info: any) => {
    info.jsEvent.preventDefault()
    onEventClick?.(info.event.id)
  }

  return (
    <div className="full-calendar-container h-full w-full overflow-hidden">
      {/* Estilos mejorados */}
      <style jsx>{`
        .fc {
          --fc-border-color: hsl(var(--border) / 0.4);
          --fc-page-bg-color: transparent;
          --fc-today-bg-color: hsl(var(--primary) / 0.12);
          --fc-today-text-color: hsl(var(--primary-foreground));
          height: 100%;
        }

        .fc .fc-toolbar {
          margin-bottom: 0.75rem;
        }

        .fc .fc-toolbar-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: hsl(var(--foreground));
        }

        .fc .fc-button-primary {
          background-color: hsl(var(--primary));
          border: none;
          color: hsl(var(--primary-foreground));
          font-weight: 500;
          border-radius: 0.375rem;
          padding: 0.375rem 0.75rem;
          font-size: 0.875rem;
          transition: all 0.2s ease;
        }

        .fc .fc-button-primary:hover {
          background-color: hsl(var(--primary) / 0.9);
          transform: translateY(-1px);
        }

        .fc .fc-button-primary:not(.fc-prev-button):not(.fc-next-button):not(.fc-today-button) {
          background-color: hsl(var(--muted));
          color: hsl(var(--muted-foreground));
        }

        .fc .fc-col-header-cell-cushion {
          color: hsl(var(--muted-foreground));
          font-weight: 600;
          font-size: 0.8125rem;
          text-transform: uppercase;
          letter-spacing: 0.025em;
        }

        .fc .fc-daygrid-day-number {
          color: hsl(var(--foreground));
          font-weight: 500;
          font-size: 0.875rem;
          padding: 0.25rem;
        }

        .fc .fc-daygrid-day.fc-day-today {
          background-color: var(--fc-today-bg-color) !important;
        }

        .fc .fc-daygrid-day.fc-day-today .fc-daygrid-day-number {
          background-color: hsl(var(--primary));
          color: white;
          border-radius: 9999px;
          width: 1.75rem;
          height: 1.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
        }

        .fc .fc-daygrid-event {
          margin: 1px 2px;
          border-radius: 0.25rem;
          overflow: hidden;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        }

        .fc .fc-more-link {
          color: hsl(var(--primary));
          font-weight: 500;
          font-size: 0.8125rem;
        }
      `}</style>

      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: isMobile ? 'dayGridMonth' : 'dayGridMonth,timeGridWeek,timeGridDay',
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
        eventContent={renderEventContent}
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
        allDayText="Todo el día"
        moreLinkText={(n) => `+${n} más`}
        noEventsText="Sin eventos"
        slotMinTime="06:00:00"
        slotMaxTime="23:00:00"
        expandRows={true}
        dayCellClassNames="hover:bg-accent/40 transition-colors duration-150 cursor-pointer"
        eventClassNames="hover:shadow-md hover:scale-[1.01] transition-all duration-150 cursor-pointer"
      />
    </div>
  )
}
