// src/layouts/CalendarLayout.tsx
import { AppShell } from '@/components/app-shell'
import FullCalendarComponent from '@/components/full-calendar'
import { LeftSidebar } from '@/components/left-sidebar'
import { RightMenu } from '@/components/right-menu'
import { CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react'
import { usePage } from '@inertiajs/react'
import { useState } from 'react'
import { cn } from '@/lib/utils' // si tienes esta utilidad de shadcn

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

  const [leftCollapsed, setLeftCollapsed] = useState(() => {
    const saved = localStorage.getItem('leftSidebarCollapsed')
    return saved ? JSON.parse(saved) : false // Cambiado a false por defecto para mejor primera impresión
  })

  const [rightExpanded, setRightExpanded] = useState(false) // Cerrado por defecto hasta que el usuario lo abra
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<any>(null)

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

  const hasSelection = selectedCalendars.length > 0
  const isSingle = selectedCalendars.length === 1
  const primaryCalendar = isSingle ? selectedCalendars[0] : selectedCalendars[0]

  // Color del calendario activo (fallback a primary si no hay template)
  const accentColor = primaryCalendar?.template?.color || 'hsl(var(--primary))'

  return (
    <AppShell variant="sidebar">
      <div className="relative flex h-screen overflow-hidden bg-gradient-to-br from-background via-background to-muted/30">
        {/* LEFT SIDEBAR */}
        <div className="hidden lg:flex">
          {leftCollapsed && (
            <div className="flex w-16 flex-col items-center border-r border-border/50 bg-background/95 backdrop-blur-sm">
              <button
                onClick={toggleLeft}
                className="group mt-6 rounded-2xl p-4 transition-all duration-300 hover:bg-primary hover:text-primary-foreground hover:shadow-xl"
                title="Expandir navegación"
              >
                <ChevronRight className="h-6 w-6 transition-transform group-hover:scale-110" />
              </button>
            </div>
          )}

          <div
            className={cn(
              "h-full border-r border-border/50 bg-background/95 backdrop-blur-sm shadow-2xl transition-all duration-500",
              leftCollapsed ? "w-0 opacity-0" : "w-80 opacity-100"
            )}
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

        {/* MAIN AREA */}
        <div className="flex flex-1 flex-col">
          {/* Elegant Header */}
          <header className="relative border-b border-border/50 bg-background/90 backdrop-blur-md">
            <div className="flex items-center justify-between px-6 py-5">
              <div className="flex items-center gap-5">
                {/* Mobile menu button */}
                <button
                  onClick={toggleLeft}
                  className="rounded-xl p-3 lg:hidden hover:bg-accent/70 transition"
                >
                  <CalendarIcon className="h-7 w-7" />
                </button>

                {/* Calendar title with accent */}
                {hasSelection && (
                  <div className="flex items-center gap-4">
                    <div
                      className="h-12 w-1.5 rounded-full"
                      style={{ backgroundColor: accentColor }}
                    />
                    <div>
                      <h1 className="text-2xl font-bold tracking-tight lg:text-3xl">
                        {isSingle
                          ? primaryCalendar.nombre
                          : `${selectedCalendars.length} calendarios`}
                      </h1>
                      {isSingle && primaryCalendar.descripcion && (
                        <p className="mt-1 text-sm text-muted-foreground opacity-80">
                          {primaryCalendar.descripcion}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile right menu button */}
              <button
                onClick={() => setRightExpanded(!rightExpanded)}
                className="rounded-xl p-3 lg:hidden hover:bg-accent/70 transition"
              >
                <CalendarIcon className="h-7 w-7" />
              </button>
            </div>
          </header>

          {/* Full Calendar */}
          <main className="flex-1 overflow-hidden bg-background/50">
            <div className="h-full rounded-t-3xl bg-background shadow-inner">
              <FullCalendarComponent
                events={events}
                onDateSelect={handleDateSelect}
                onEventClick={handleEventClick}
              />
            </div>
          </main>
        </div>

        {/* RIGHT PANEL - Desktop */}
        <div className="hidden xl:block">
          <div
            className={cn(
              "h-full border-l border-border/50 bg-background/95 backdrop-blur-sm shadow-2xl transition-all duration-500",
              rightExpanded ? "w-96" : "w-16"
            )}
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

          {/* Collapse button when expanded */}
          {rightExpanded && (
            <button
              onClick={() => setRightExpanded(false)}
              className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-background p-2 shadow-xl hover:scale-110 transition"
            >
              <ChevronRight className="h-5 w-5 rotate-180" />
            </button>
          )}
        </div>

        {/* MOBILE RIGHT MENU OVERLAY */}
        {rightExpanded && (
          <div
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm xl:hidden"
            onClick={() => setRightExpanded(false)}
          >
            <div
              className="absolute right-0 top-0 h-full w-full max-w-lg bg-background shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="   items-center justify-between border-b border-border/50 p-5">
                <h2 className="text-xl font-semibold">Detalles</h2>
                <button
                  onClick={() => setRightExpanded(false)}
                  className="rounded-lg p-2 hover:bg-accent"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </div>
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
