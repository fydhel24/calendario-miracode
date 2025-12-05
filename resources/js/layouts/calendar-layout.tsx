import { AppShell } from '@/components/app-shell';
import FullCalendarComponent from '@/components/full-calendar';
import { LeftSidebar } from '@/components/left-sidebar';
import { RightMenu } from '@/components/right-menu';
import { type BreadcrumbItem } from '@/types';
import { Calendar, Plus } from 'lucide-react';
import { useState } from 'react';

interface CalendarLayoutProps {
    children?: React.ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default function CalendarLayout({
    children,
    breadcrumbs = [],
}: CalendarLayoutProps) {
    const [isLeftSidebarCollapsed, setIsLeftSidebarCollapsed] = useState(true);
    const [isRightMenuExpanded, setIsRightMenuExpanded] = useState(false);

    const toggleLeftSidebar = () => {
        setIsLeftSidebarCollapsed(!isLeftSidebarCollapsed);
    };

    const handleRightMenuExpansionChange = (expanded: boolean) => {
        setIsRightMenuExpanded(expanded);
    };

    // Calculate dynamic widths
    const leftSidebarWidth = isLeftSidebarCollapsed ? 64 : 256; // w-16 or w-64
    const rightMenuWidth = isRightMenuExpanded ? 384 : 64; // w-96 or w-16
    const calendarWidth = `calc(100vw - ${leftSidebarWidth}px - ${rightMenuWidth}px)`;

    return (
        <AppShell variant="sidebar">
            <div className="relative flex h-screen overflow-hidden bg-gradient-to-br from-background to-muted/20">
                {/* Sidebar izquierdo - Navegación */}
                <div className="flex">
                    {/* Botón toggle cuando está colapsado */}
                    {isLeftSidebarCollapsed && (
                        <div className="w-16 flex flex-col items-center justify-center bg-gradient-to-b from-sidebar to-sidebar/95 border-r border-sidebar-border shadow-lg">
                            <button
                                onClick={toggleLeftSidebar}
                                className="p-3 rounded-lg hover:bg-sidebar-accent transition-all duration-300 hover:scale-105 hover:shadow-md group"
                                title="Mostrar navegación"
                            >
                                <Calendar className="h-6 w-6 text-sidebar-foreground/80 group-hover:text-sidebar-accent-foreground transition-colors" />
                            </button>
                        </div>
                    )}
                    
                    {/* Sidebar izquierdo - Navegación */}
                    <div
                        className={`${isLeftSidebarCollapsed ? 'w-0' : 'w-64'} overflow-hidden transition-all duration-300 ease-in-out`}
                    >
                        <LeftSidebar className="h-full bg-gradient-to-b from-sidebar to-sidebar/95 shadow-xl" isCollapsed={isLeftSidebarCollapsed} onToggle={toggleLeftSidebar} />
                    </div>
                </div>

                {/* Área principal del calendario - se ajusta dinámicamente según el menú derecho */}
                <div 
                    className="transition-all duration-300 ease-in-out p-6"
                    style={{
                        width: calendarWidth,
                        maxWidth: '100%'
                    }}
                >
                    <div className="h-full w-full bg-background/50 backdrop-blur-sm rounded-2xl border border-border/50 shadow-2xl overflow-hidden">
                        <FullCalendarComponent />
                    </div>
                </div>

                {/* Menú de la derecha - Siempre visible con comportamiento expandible */}
                <div className="border-l border-sidebar-border shadow-xl flex-shrink-0">
                    <RightMenu 
                        className="h-full bg-gradient-to-b from-sidebar to-sidebar/95" 
                        isExpanded={isRightMenuExpanded}
                        onExpansionChange={handleRightMenuExpansionChange}
                    />
                </div>
            </div>
        </AppShell>
    );
}
