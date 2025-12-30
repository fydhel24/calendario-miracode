// src/layouts/CalendarLayout.tsx
import { AppShell } from '@/components/app-shell'
import FullCalendarComponent from '@/components/full-calendar'
import { LeftSidebar } from '@/components/left-sidebar'
import { RightMenu } from '@/components/right-menu'
import { CalendarIcon } from 'lucide-react'
import { usePage } from '@inertiajs/react'
import { useState } from 'react'

import { useCalendarSelection } from '@/hooks/useCalendarSelection'

interface CalendarLayoutProps {
  calendarios: any[]
  selectedCalendarId?: number
  selectedCalendars?: any[]
}

export default function CalendarLayout({
  calendarios = [],
  selectedCalendarId,
  selectedCalendars: initialSelectedCalendars,
}: CalendarLayoutProps) {
  const { auth } = usePage().props as any

  // Estados de UI
  const [leftCollapsed, setLeftCollapsed] = useState(() => {
    const saved = localStorage.getItem('leftSidebarCollapsed')
    return saved ? JSON.parse(saved) : true
  })

  const [rightExpanded, setRightExpanded] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<any>(null)

  // Hook principal de negocio
  const {
    allCalendars,
    selectedCalendars,
    selectedCalendarIds,
    events,
    selectCalendars,
    selectCalendarIds,
    addCalendar,
    updateCalendar,
    addEventToState,
    updateEventInState,
    deleteEventFromState,
  } = useCalendarSelection({
    initialCalendarios: calendarios,
    selectedCalendarId,
    propSelectedCalendars: initialSelectedCalendars,
  })

  // Handlers simples
  const toggleLeft = () => {
    const next = !leftCollapsed
    setLeftCollapsed(next)
    localStorage.setItem('leftSidebarCollapsed', JSON.stringify(next))
  }

  const handleDateSelect = (date: string) => {
    setSelectedDate(date)
    setSelectedEvent(null)
    setRightExpanded(true)
  }

  const handleEventClick = (eventId: string) => {
    const found = events.find(e => String(e.id) === eventId)
    if (found) {
      setSelectedEvent(found)
      setSelectedDate(null)
      setRightExpanded(true)
    }
  }

  // Cálculos de layout
  const leftWidth = leftCollapsed ? 64 : 256
  const rightWidth = rightExpanded ? 384 : 64
  const calendarWidth = `calc(100vw - ${leftWidth}px - ${rightWidth}px)`

  const hasSelection = selectedCalendars.length > 0
  const isSingleCalendar = selectedCalendars.length === 1
  const currentCalendar = isSingleCalendar ? selectedCalendars[0] : null

  return (
    <AppShell variant="sidebar">
      <div className="relative flex h-screen overflow-hidden bg-background">
        {/* LEFT SIDEBAR - Desktop */}
        <div className="hidden lg:flex">
          {/* Toggle button when collapsed */}
          {leftCollapsed && (
            <div className="flex w-16 flex-col items-center border-r bg-background shadow-sm">
              <button
                onClick={toggleLeft}
                className="group mt-4 rounded-full p-3 transition hover:bg-accent hover:text-accent-foreground"
                title="Abrir navegación"
                aria-label="Abrir navegación lateral"
              >
                <CalendarIcon className="h-6 w-6" />
              </button>
            </div>
          )}

          {/* Sidebar content */}
          <div
            className={`
              h-full overflow-hidden border-r bg-background transition-all duration-300
              ${leftCollapsed ? 'w-0' : 'w-64'}
            `}
          >
            <LeftSidebar
              isCollapsed={leftCollapsed}
              onToggle={toggleLeft}
              calendarios={allCalendars}
              selectedCalendarIds={selectedCalendarIds}
              onCalendarSelect={cal => selectCalendars([cal])}
              onCalendarsSelect={selectCalendars}
              onCalendarIdsChange={selectCalendarIds}
              onCalendarCreated={addCalendar}
              onCalendarUpdated={updateCalendar}
              auth={auth}
            />
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="relative flex min-w-0 flex-1 flex-col">
          {/* Mobile top bar */}
          <div className="flex items-center justify-between border-b bg-background p-3 lg:hidden">
            <button
              onClick={toggleLeft}
              className="rounded-lg p-2 hover:bg-accent"
              aria-label="Abrir menú lateral"
            >
              <CalendarIcon className="h-6 w-6" />
            </button>

            <button
              onClick={() => setRightExpanded(!rightExpanded)}
              className="rounded-lg p-2 hover:bg-accent"
              aria-label="Abrir panel derecho"
            >
              <CalendarIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Header info */}
          {hasSelection && (
            <div className="border-b bg-card/50 px-4 py-3 sm:px-6">
              <div className="flex items-center gap-3">
                <div className="h-8 w-1.5 rounded-full bg-primary" />
                <div className="min-w-0 flex-1">
                  <h1 className="truncate text-xl font-semibold sm:text-2xl">
                    {isSingleCalendar
                      ? currentCalendar.nombre
                      : 'Múltiples calendarios'}
                  </h1>
                  {isSingleCalendar && currentCalendar.descripcion && (
                    <p className="mt-0.5 line-clamp-1 text-sm text-muted-foreground">
                      {currentCalendar.descripcion}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Calendar */}
          <div className="relative flex-1 overflow-hidden">
            <FullCalendarComponent
              events={events}
              onDateSelect={handleDateSelect}
              onEventClick={handleEventClick}
            />
          </div>
        </div>

        {/* RIGHT PANEL - Desktop */}
        <div className="hidden border-l shadow-sm xl:block">
          <div
            className={`
              h-full overflow-y-auto bg-background transition-all duration-300
              ${rightExpanded ? 'w-96' : 'w-16'}
            `}
          >
            <RightMenu
              isExpanded={rightExpanded}
              onExpansionChange={setRightExpanded}
              selectedDate={selectedDate}
              selectedEvent={selectedEvent}
              selectedCalendars={selectedCalendars}
              calendarios={allCalendars}
              onEventCreated={addEventToState}
              onEventUpdated={updateEventInState}
              onEventDeleted={deleteEventFromState}
              onCalendarUpdated={updateCalendar}
              onCalendarSelect={cal => selectCalendars([cal])}
              onDateClear={() => setSelectedDate(null)}
            />
          </div>
        </div>

        {/* ── MOBILE OVERLAYS ── */}

        {/* Mobile Right Menu */}
        {rightExpanded && (
          <div
            className="fixed inset-0 z-50 bg-black/60 xl:hidden"
            onClick={() => setRightExpanded(false)}
          >
            <div
              className="absolute right-0 top-0 h-full w-full max-w-md bg-background shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <RightMenu
                isExpanded={true}
                onExpansionChange={setRightExpanded}
                selectedDate={selectedDate}
                selectedEvent={selectedEvent}
                selectedCalendars={selectedCalendars}
                calendarios={allCalendars}
                onEventCreated={addEventToState}
                onEventUpdated={updateEventInState}
                onEventDeleted={deleteEventFromState}
                onCalendarUpdated={updateCalendar}
                onCalendarSelect={cal => selectCalendars([cal])}
                onDateClear={() => setSelectedDate(null)}
              />
            </div>
          </div>
        )}
      </div>
    </AppShell>
  )
}
