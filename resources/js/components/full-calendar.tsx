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
    const backgroundColor = eventInfo.event.backgroundColor

    return (
      <div
        className="group relative flex h-full w-full items-center overflow-hidden rounded-md border border-white/20 shadow-sm transition-all duration-300 hover:shadow-md"
        style={{
          backgroundColor: backgroundColor,
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
        }}
      >
        {emoji && (
          <div
            className="flex h-full w-8 min-w-[32px] items-center justify-center text-sm shadow-inner"
            style={{
              backgroundColor: stripColor,
              borderRight: '1px solid rgba(255, 255, 255, 0.2)'
            }}
          >
            {emoji}
          </div>
        )}
        <div className="min-w-0 flex-1 truncate px-2.5 text-[11px] font-bold tracking-tight text-white drop-shadow-md">
          {eventInfo.event.title}
        </div>

        {/* Shine effect on hover */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
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
      <style dangerouslySetInnerHTML={{
        __html: `
        .fc {
          --fc-border-color: hsl(var(--border) / 0.4);
          --fc-page-bg-color: transparent;
          --fc-today-bg-color: hsl(var(--primary) / 0.12);
          --fc-today-text-color: hsl(var(--primary-foreground));
          height: auto;
        }

        .fc .fc-toolbar {
          margin-bottom: 1.5rem;
          padding: 1rem;
          background: hsl(var(--card));
          border-radius: 1rem;
          border: 1px solid oklch(0.9 0.01 240);
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05);
        }

        .fc .fc-toolbar-title {
          font-size: 1.5rem;
          font-weight: 800;
          color: hsl(var(--foreground));
          letter-spacing: -0.025em;
        }

        .fc .fc-button-primary {
          background-color: hsl(var(--background));
          border: 1px solid hsl(var(--border));
          color: hsl(var(--foreground));
          font-weight: 600;
          border-radius: 0.75rem;
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          text-transform: capitalize;
        }

        .fc .fc-button-primary:hover {
          background-color: hsl(var(--accent));
          color: hsl(var(--accent-foreground));
          border-color: hsl(var(--accent));
          transform: translateY(-1px);
        }

        .fc .fc-button-active {
          background-color: hsl(var(--primary)) !important;
          color: hsl(var(--primary-foreground)) !important;
          border-color: hsl(var(--primary)) !important;
        }

        .fc .fc-col-header-cell {
          padding: 1rem 0;
          background: hsl(var(--muted)/0.3);
        }

        .fc .fc-col-header-cell-cushion {
          color: hsl(var(--muted-foreground));
          font-weight: 700;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .fc .fc-daygrid-day-number {
          color: hsl(var(--foreground));
          font-weight: 700;
          font-size: 0.9rem;
          padding: 0.5rem;
          margin: 0.25rem;
          transition: all 0.2s;
        }

        .fc .fc-daygrid-day:hover .fc-daygrid-day-number {
          transform: scale(1.1);
          color: hsl(var(--primary));
        }

        .fc .fc-daygrid-day.fc-day-today {
          background-color: hsl(var(--primary) / 0.05) !important;
        }

        .fc .fc-daygrid-day.fc-day-today .fc-daygrid-day-number {
          background-color: hsl(var(--primary));
          color: white;
          border-radius: 0.5rem;
          min-width: 2rem;
          height: 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .fc .fc-daygrid-event {
          margin: 2px 4px;
          border-radius: 0.5rem;
          border: none;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          transition: all 0.2s;
        }

        .fc .fc-daygrid-event:hover {
            z-index: 10;
            transform: translateY(-1px) scale(1.02);
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        /* Improved Grid Borders */
        .fc-theme-standard td, .fc-theme-standard th {
          border: 1px solid hsl(var(--border) / 0.6);
        }

        .fc .fc-scrollgrid {
          border-radius: 1.25rem;
          overflow: hidden;
          border: 1px solid hsl(var(--border) / 0.8);
        }

        .fc .fc-col-header {
          background: hsl(var(--muted)/0.3);
        }
      `}} />

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
        dayMaxEvents={false}
        weekends={true}
        events={formattedEvents}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        eventContent={renderEventContent}
        height="auto"
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
        dayCellClassNames="hover:bg-primary/10 transition-colors duration-150 cursor-pointer"
        eventClassNames="cursor-pointer"
      />
    </div>
  )
}
