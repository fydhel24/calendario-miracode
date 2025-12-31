// src/hooks/useCalendarSelection.ts
import { useEffect, useState } from 'react';

interface Calendar {
  id: number;
  nombre: string;
  descripcion?: string;
  template: any;
  eventos?: any[];
}

interface UseCalendarSelectionProps {
  initialCalendarios: Calendar[];
  selectedCalendarId?: number;
  propSelectedCalendars?: Calendar[];
  onCalendarsChange?: (calendarios: Calendar[]) => void; // opcional, por si el padre necesita saber
}

export function useCalendarSelection({
  initialCalendarios,
  selectedCalendarId,
  propSelectedCalendars,
}: UseCalendarSelectionProps) {
  // Estado local completo de calendarios (para reflejar creaciones/actualizaciones en tiempo real)
  const [allCalendars, setAllCalendars] = useState<Calendar[]>(initialCalendarios);

  const [selectedCalendars, setSelectedCalendars] = useState<Calendar[]>([]);
  const [selectedCalendarIds, setSelectedCalendarIds] = useState<number[]>([]);
  const [events, setEvents] = useState<any[]>([]);

  // Sincronizar con prop inicial cuando cambie (nuevo render desde servidor)
  useEffect(() => {
    setAllCalendars(initialCalendarios);
  }, [initialCalendarios]);

  // Lógica de selección inicial
  useEffect(() => {
    if (allCalendars.length === 0) {
      setSelectedCalendars([]);
      setSelectedCalendarIds([]);
      setEvents([]);
      return;
    }

    if (propSelectedCalendars && propSelectedCalendars.length > 0) {
      setSelectedCalendars(propSelectedCalendars);
      setSelectedCalendarIds(propSelectedCalendars.map(c => c.id));
      setEvents(
        propSelectedCalendars.flatMap(c =>
          c.eventos?.map(e => ({ ...e, template: c.template })) || []
        )
      );
      return;
    }

    const storedIds = localStorage.getItem('selectedCalendarIds');
    let idsToSelect: number[] = [];

    if (storedIds) {
      try {
        idsToSelect = JSON.parse(storedIds).filter((id: number) =>
          allCalendars.some(c => c.id === id)
        );
      } catch { }
    }

    if (idsToSelect.length === 0) {
      const fallback =
        allCalendars.find(c => c.id === selectedCalendarId) || allCalendars[0];
      idsToSelect = fallback ? [fallback.id] : [];
    }

    const calendarsToSelect = allCalendars.filter(c =>
      idsToSelect.includes(c.id)
    );

    setSelectedCalendars(calendarsToSelect);
    setSelectedCalendarIds(idsToSelect);
    setEvents(
      calendarsToSelect.flatMap(c =>
        c.eventos?.map(e => ({ ...e, template: c.template })) || []
      )
    );
  }, [allCalendars, selectedCalendarId, propSelectedCalendars]);

  const selectCalendars = (calendars: Calendar[]) => {
    const ids = calendars.map(c => c.id);
    setSelectedCalendars(calendars);
    setSelectedCalendarIds(ids);
    setEvents(
      calendars.flatMap(c =>
        c.eventos?.map(e => ({ ...e, template: c.template })) || []
      )
    );
    localStorage.setItem('selectedCalendarIds', JSON.stringify(ids));
  };

  const selectCalendarIds = (ids: number[]) => {
    const validIds = ids.filter(id => allCalendars.some(c => c.id === id));
    const calendars = allCalendars.filter(c => validIds.includes(c.id));
    selectCalendars(calendars);
  };

  // === Actualizaciones en tiempo real ===

  const addCalendar = (newCalendar: Calendar) => {
    setAllCalendars(prev => [newCalendar, ...prev]);
    selectCalendars([newCalendar]); // Auto-seleccionar el nuevo
  };

  const updateCalendar = (updatedCalendar: Calendar) => {
    setAllCalendars(prev =>
      prev.map(c => (c.id === updatedCalendar.id ? updatedCalendar : c))
    );

    // Actualizar si está seleccionado
    if (selectedCalendars.some(c => c.id === updatedCalendar.id)) {
      setSelectedCalendars(prev =>
        prev.map(c => (c.id === updatedCalendar.id ? updatedCalendar : c))
      );
      setEvents(prev =>
        prev.map(e =>
          e.calendario_id === updatedCalendar.id
            ? { ...e, template: updatedCalendar.template }
            : e
        )
      );
    }
  };

  const addEventToState = (newEvent: any) => {
    setEvents(prev => [...prev, newEvent]);

    // Actualizar el calendario correspondiente en allCalendars y selected
    setAllCalendars(prev =>
      prev.map(cal =>
        cal.id === newEvent.calendario_id
          ? {
            ...cal,
            eventos: cal.eventos ? [...cal.eventos, newEvent] : [newEvent],
          }
          : cal
      )
    );

    setSelectedCalendars(prev =>
      prev.map(cal =>
        cal.id === newEvent.calendario_id
          ? {
            ...cal,
            eventos: cal.eventos ? [...cal.eventos, newEvent] : [newEvent],
          }
          : cal
      )
    );
  };

  const updateEventInState = (updatedEvent: any) => {
    setEvents(prev =>
      prev.map(e => (String(e.id) === String(updatedEvent.id) ? { ...e, ...updatedEvent } : e))
    );

    const updateEventInCalendars = (calendars: Calendar[]) =>
      calendars.map(cal =>
        cal.id === updatedEvent.calendario_id
          ? {
            ...cal,
            eventos: cal.eventos?.map((e: any) =>
              String(e.id) === String(updatedEvent.id) ? { ...e, ...updatedEvent } : e
            ),
          }
          : cal
      );

    setAllCalendars(updateEventInCalendars);
    setSelectedCalendars(updateEventInCalendars);
  };

  const deleteEventFromState = (eventId: number | string) => {
    const numericId = typeof eventId === 'string' ? parseInt(eventId, 10) : eventId;
    setEvents(prev => prev.filter(e => e.id !== numericId));

    const removeEventFromCalendars = (calendars: Calendar[]) =>
      calendars.map(cal => ({
        ...cal,
        eventos: cal.eventos?.filter((e: any) => e.id !== numericId),
      }));

    setAllCalendars(removeEventFromCalendars);
    setSelectedCalendars(removeEventFromCalendars);
  };

  return {
    allCalendars,                  // ← NUEVO: lista completa actualizada
    selectedCalendars,
    selectedCalendarIds,
    events,

    selectCalendars,
    selectCalendarIds,

    addCalendar,                   // ← Para creación
    updateCalendar,                // ← Para edición
    addEventToState,
    updateEventInState,
    deleteEventFromState,

    setEvents, // por si acaso
  };
}
