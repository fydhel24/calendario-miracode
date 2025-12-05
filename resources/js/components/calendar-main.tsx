import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarMainProps {
    currentDate: Date;
    onPreviousMonth: () => void;
    onNextMonth: () => void;
}

export default function CalendarMain({ 
    currentDate, 
    onPreviousMonth, 
    onNextMonth 
}: CalendarMainProps) {
    const monthNames = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    
    const getDaysInMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const renderCalendarDays = () => {
        const daysInMonth = getDaysInMonth(currentDate);
        const firstDay = getFirstDayOfMonth(currentDate);
        const days = [];

        // Días vacíos del mes anterior
        for (let i = 0; i < firstDay; i++) {
            days.push(
                <div key={`empty-${i}`} className="h-10 w-10"></div>
            );
        }

        // Días del mes actual
        for (let day = 1; day <= daysInMonth; day++) {
            const isToday = 
                day === new Date().getDate() && 
                currentDate.getMonth() === new Date().getMonth() &&
                currentDate.getFullYear() === new Date().getFullYear();
            
            days.push(
                <div 
                    key={day} 
                    className={`h-10 w-10 flex items-center justify-center text-sm cursor-pointer rounded-lg hover:bg-accent ${
                        isToday ? 'bg-primary text-primary-foreground' : ''
                    }`}
                >
                    {day}
                </div>
            );
        }

        return days;
    };

    return (
        <div className="w-full h-full bg-background rounded-xl border border-border p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={onPreviousMonth}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={onNextMonth}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-4">
                {dayNames.map(day => (
                    <div key={day} className="h-10 w-10 flex items-center justify-center text-sm font-medium text-muted-foreground">
                        {day}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
                {renderCalendarDays()}
            </div>
        </div>
    );
}