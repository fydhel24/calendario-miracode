import { Dock, DockIcon, DockItem, DockLabel } from '@/components/ui/shadcn-io/dock';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface VerticalDockProps {
    className?: string;
    children: React.ReactNode;
}

export function VerticalDock({ className, children }: VerticalDockProps) {
    return (
        <div className={cn('flex flex-col h-fit', className)}>
            <Dock className="flex-col h-fit bg-background/80 backdrop-blur-sm border border-border">
                {children}
            </Dock>
        </div>
    );
}

interface VerticalDockItemProps {
    children: React.ReactNode;
    onClick?: () => void;
    label: string;
    className?: string;
}

export function VerticalDockItem({ children, onClick, label, className }: VerticalDockItemProps) {
    return (
        <DockItem>
            <DockIcon>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClick}
                    className={cn('h-12 w-12', className)}
                >
                    {children}
                </Button>
            </DockIcon>
            <DockLabel>{label}</DockLabel>
        </DockItem>
    );
}