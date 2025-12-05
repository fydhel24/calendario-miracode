import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight, Calendar, Plus, X } from 'lucide-react';
import { useState } from 'react';

interface CalendarItem {
    id: string;
    name: string;
}

interface RightSidebarProps {
    className?: string;
    onToggle?: () => void;
}

export function RightSidebar({ className, onToggle }: RightSidebarProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [calendars] = useState<CalendarItem[]>([
        { id: '1', name: 'Calendario 1' },
        { id: '2', name: 'Calendario 2' },
    ]);

    const toggleExpanded = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div className={`bg-sidebar border-l border-sidebar-border ${className}`}>
            <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
                <h3 className="text-sm font-medium">Mis Calendarios</h3>
                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleExpanded}
                        className="h-8 w-8"
                        title={isExpanded ? "Contraer contenido" : "Expandir contenido"}
                    >
                        {isExpanded ? (
                            <ChevronDown className="h-4 w-4" />
                        ) : (
                            <ChevronRight className="h-4 w-4" />
                        )}
                    </Button>
                    {onToggle && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onToggle}
                            className="h-8 w-8"
                            title="Ocultar sidebar"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </div>
            
            <Collapsible open={isExpanded}>
                <CollapsibleContent className="p-2">
                    <div className="space-y-1">
                        {calendars.map((calendar) => (
                            <div
                                key={calendar.id}
                                className="flex items-center gap-2 p-2 rounded-md hover:bg-sidebar-accent cursor-pointer transition-colors"
                            >
                                <Calendar className="h-4 w-4 text-sidebar-foreground/60" />
                                <span className="text-sm">{calendar.name}</span>
                            </div>
                        ))}
                        
                        <div className="pt-2 border-t border-sidebar-border">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="w-full justify-start gap-2 h-8"
                            >
                                <Plus className="h-4 w-4" />
                                <span className="text-sm">Agregar Calendario</span>
                            </Button>
                        </div>
                    </div>
                </CollapsibleContent>
            </Collapsible>
        </div>
    );
}