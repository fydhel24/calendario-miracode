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

    const toggleLeftSidebar = () => {
        setIsLeftSidebarCollapsed(!isLeftSidebarCollapsed);
    };

    return (
        <AppShell variant="sidebar">
            <div className="relative flex h-screen overflow-hidden">
                {/* Sidebar izquierdo - Navegación */}
                <div className="flex">
                    {/* Botón toggle cuando está colapsado */}
                    {isLeftSidebarCollapsed && (
                        <div className="w-16 flex flex-col items-center justify-center bg-sidebar border-r border-sidebar-border">
                            <button
                                onClick={toggleLeftSidebar}
                                className="p-3 rounded-lg hover:bg-sidebar-accent transition-colors"
                                title="Mostrar navegación"
                            >
                                <Calendar className="h-6 w-6" />
                            </button>
                        </div>
                    )}
                    
                    {/* Sidebar izquierdo - Navegación */}
                    <div
                        className={`${isLeftSidebarCollapsed ? 'w-0' : 'w-64'} overflow-hidden transition-all duration-300`}
                    >
                        <LeftSidebar className="h-full" isCollapsed={isLeftSidebarCollapsed} onToggle={toggleLeftSidebar} />
                    </div>
                </div>

                {/* Área principal del calendario - se extiende hasta el borde derecho cuando el menú está colapsado */}
                <div className="flex flex-1 p-6">
                    <div className="h-full w-full">
                        <FullCalendarComponent />
                    </div>
                </div>

                {/* Menú de la derecha - Siempre visible con comportamiento expandible */}
                <div className="border-l border-sidebar-border">
                    <RightMenu className="h-full" />
                </div>
            </div>
        </AppShell>
    );
}
