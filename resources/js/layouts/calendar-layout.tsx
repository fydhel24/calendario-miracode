import { AppShell } from '@/components/app-shell';
import FullCalendarComponent from '@/components/full-calendar';
import { RightSidebar } from '@/components/right-sidebar';
import { type BreadcrumbItem } from '@/types';
import { Calendar } from 'lucide-react';
import { useState } from 'react';

interface CalendarLayoutProps {
    children?: React.ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default function CalendarLayout({
    children,
    breadcrumbs = [],
}: CalendarLayoutProps) {
    const [isRightSidebarCollapsed, setIsRightSidebarCollapsed] = useState(true);

    const toggleRightSidebar = () => {
        setIsRightSidebarCollapsed(!isRightSidebarCollapsed);
    };

    return (
        <AppShell variant="sidebar">
            <div className="relative flex h-screen overflow-hidden">
                {/* Botón toggle y Sidebar izquierdo - Calendarios */}
                <div className="flex">
                    {/* Botón toggle cuando está colapsado */}
                    {isRightSidebarCollapsed && (
                        <div className="w-16 flex flex-col items-center justify-center bg-sidebar border-r border-sidebar-border">
                            <button
                                onClick={toggleRightSidebar}
                                className="p-3 rounded-lg hover:bg-sidebar-accent transition-colors"
                                title="Mostrar Calendarios"
                            >
                                <Calendar className="h-6 w-6" />
                            </button>
                        </div>
                    )}
                    
                    {/* Sidebar izquierdo - Calendarios */}
                    <div
                        className={`${isRightSidebarCollapsed ? 'w-0' : 'w-64'} overflow-hidden transition-all duration-300`}
                    >
                        <RightSidebar className="h-full" onToggle={toggleRightSidebar} />
                    </div>
                </div>

                {/* Área principal del calendario - centrada */}
                <div className="flex flex-1 items-center justify-center p-6">
                    <div className="h-full w-full max-w-4xl">
                        <FullCalendarComponent />
                    </div>
                </div>
            </div>
        </AppShell>
    );
}
