import CalendarLayout from '@/layouts/calendar-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

interface DashboardProps {
    calendarios: any[];
    selectedCalendarId?: number;
}

export default function Dashboard({
    calendarios,
    selectedCalendarId,
}: DashboardProps) {
    const { auth } = usePage<SharedData>().props;

    return (
        <CalendarLayout
            breadcrumbs={breadcrumbs}
            calendarios={calendarios}
            selectedCalendarId={selectedCalendarId}
        >
            <Head title="Dashboard" />
        </CalendarLayout>
    );
}
