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
    const [isRightMenuCollapsed, setIsRightMenuCollapsed] = useState(true);

    const toggleLeftSidebar = () => {
        setIsLeftSidebarCollapsed(!isLeftSidebarCollapsed);
    };

    const toggleRightMenu = () => {
        setIsRightMenuCollapsed(!isRightMenuCollapsed);
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

                {/* Menú de la derecha - Opciones de creación (solo cuando está expandido) */}
                {!isRightMenuCollapsed && (
                    <div className="w-80 overflow-hidden transition-all duration-300 border-l border-sidebar-border">
                        <RightMenu className="h-full" onToggle={toggleRightMenu} />
                    </div>
                )}

                {/* Botón flotante del menú de creación - cuando está colapsado */}
                {isRightMenuCollapsed && (
                    <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-50">
                        <button
                            onClick={toggleRightMenu}
                            className="p-3 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-colors"
                            title="Mostrar menú de creación"
                        >
                            <Plus className="h-6 w-6" />
                        </button>
                    </div>
                )}
            </div>
        </AppShell>
    );
}
