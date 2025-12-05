import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight, Home, Calendar, Users, Settings, HelpCircle } from 'lucide-react';
import { useState } from 'react';

interface LeftSidebarProps {
    className?: string;
    isCollapsed: boolean;
    onToggle: () => void;
}

export function LeftSidebar({ className, isCollapsed, onToggle }: LeftSidebarProps) {
    const [isExpanded, setIsExpanded] = useState(true);

    const menuItems = [
        { id: 'home', label: 'Inicio', icon: Home, active: false },
        { id: 'calendar', label: 'Calendario Principal', icon: Calendar, active: true },
        { id: 'users', label: 'Usuarios', icon: Users, active: false },
        { id: 'settings', label: 'Configuración', icon: Settings, active: false },
    ];

    return (
        <div className={`bg-sidebar border-r border-sidebar-border h-full ${className}`}>
            <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
                <h3 className="text-sm font-medium">Navegación</h3>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onToggle}
                    className="h-8 w-8"
                >
                    {isCollapsed ? (
                        <ChevronRight className="h-4 w-4" />
                    ) : (
                        <ChevronDown className="h-4 w-4" />
                    )}
                </Button>
            </div>
            
            <div className="p-2">
                {!isCollapsed && (
                    <div className="space-y-1">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <div
                                    key={item.id}
                                    className={`flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors ${
                                        item.active 
                                            ? 'bg-sidebar-accent text-sidebar-accent-foreground' 
                                            : 'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                                    }`}
                                >
                                    <Icon className="h-4 w-4" />
                                    <span className="text-sm">{item.label}</span>
                                </div>
                            );
                        })}
                        
                        <div className="pt-4 border-t border-sidebar-border">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="w-full justify-start gap-2 h-8"
                            >
                                <HelpCircle className="h-4 w-4" />
                                <span className="text-sm">Ayuda</span>
                            </Button>
                        </div>
                    </div>
                )}
                
                {isCollapsed && (
                    <div className="space-y-1">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Button
                                    key={item.id}
                                    variant="ghost"
                                    size="icon"
                                    className={`w-full h-10 ${
                                        item.active 
                                            ? 'bg-sidebar-accent text-sidebar-accent-foreground' 
                                            : ''
                                    }`}
                                >
                                    <Icon className="h-4 w-4" />
                                </Button>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}