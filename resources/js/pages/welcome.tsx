import { dashboard, login } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { 
    Calendar as CalendarIcon, 
    FileText, 
    Video, 
    CheckCircle2, 
    ArrowRight,
    Play,
    LayoutDashboard
} from 'lucide-react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    // Variantes para animaciones coordinadas
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 25 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    return (
        <div className="min-h-screen w-full bg-[#050505] font-['Instrument_Sans',sans-serif] text-white selection:bg-red-600/30">
            <Head title="Admus Productions | Tu Producción, Bajo Control" />

            {/* Background Gradient Sutil */}
            <div className="fixed inset-0 -z-10">
                <div className="absolute top-0 left-1/2 h-[600px] w-full -translate-x-1/2 bg-gradient-to-b from-red-900/10 via-transparent to-transparent opacity-50" />
            </div>

            {/* 1. NAVIGATION BAR */}
            <nav className="sticky top-0 z-50 border-b border-white/5 bg-black/40 backdrop-blur-md">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="h-7 w-7 rounded bg-[#CC0000] shadow-[0_0_15px_rgba(204,0,0,0.4)]" />
                        <span className="text-lg font-bold tracking-tight uppercase">Admus <span className="text-gray-400 font-light">Productions</span></span>
                    </div>

                    <Link href={auth.user ? dashboard() : login()}>
                        <Button className="bg-[#CC0000] hover:bg-[#b30000] text-white font-bold rounded-md px-6 transition-all active:scale-95 shadow-lg shadow-red-900/20">
                            {auth.user ? 'Ir al Panel' : 'Ingresar'}
                        </Button>
                    </Link>
                </div>
            </nav>

            <main className="mx-auto max-w-7xl px-6">
                
                {/* 2. HERO SECTION */}
                <section className="flex flex-col items-center py-24 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mb-8 rounded-full border border-red-500/20 bg-red-500/5 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#CC0000]"
                    >
                        Sistema de Gestión de Clientes
                    </motion.div>

                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 text-5xl font-extrabold tracking-tight sm:text-7xl lg:text-8xl"
                    >
                        Tu Producción, <br />
                        <span className="text-gray-600">Bajo Control.</span>
                    </motion.h1>

                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="mx-auto mb-12 max-w-2xl text-lg leading-relaxed text-gray-400 sm:text-xl"
                    >
                        Bienvenido al centro de gestión de Admus Productions. Aquí podrás visualizar 
                        el cronograma de tus guiones, fechas de rodaje y estados de producción en tiempo real.
                    </motion.p>

                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="flex flex-col sm:flex-row gap-4"
                    >
                        <Button size="lg" className="bg-[#CC0000] hover:bg-[#b30000] h-14 px-8 rounded-md text-base font-bold flex gap-3 group">
                            Explorar mi Calendario 
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </Button>
                        <Button variant="outline" size="lg" className="h-14 px-8 rounded-md border-white/10 bg-white/5 hover:bg-white/10 text-base font-bold flex gap-3 backdrop-blur-sm">
                            <Play size={18} fill="currentColor" /> Ver Demo
                        </Button>
                    </motion.div>
                </section>

                {/* VISUAL PREVIEW (Glassmorphism Mockup) */}
                <motion.div 
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="relative mb-32 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-4 backdrop-blur-3xl shadow-2xl"
                >
                    <div className="rounded-xl bg-[#0d0d0d] p-6">
                         <div className="flex items-center gap-4 mb-8 border-b border-white/5 pb-4">
                            <CalendarIcon className="text-[#CC0000]" />
                            <h3 className="font-bold text-gray-300">Cronograma de Producción - Noviembre 2024</h3>
                         </div>
                         <div className="opacity-40 pointer-events-none grayscale contrast-125">
                            <FullCalendar
                                plugins={[dayGridPlugin]}
                                initialView="dayGridMonth"
                                headerToolbar={false}
                                height="400px"
                            />
                         </div>
                    </div>
                </motion.div>

                {/* 3. INFO CARDS SECTION (Workflow) */}
                <section className="pb-32">
                    <div className="mb-16">
                        <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
                            <div className="h-1 w-12 bg-[#CC0000]" />
                            Flujo de Trabajo
                        </h2>
                        <p className="text-gray-500 max-w-xl">Gestionamos cada fase de tu proyecto cinematográfico con precisión quirúrgica.</p>
                    </div>

                    <motion.div 
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid gap-6 md:grid-cols-3"
                    >
                        <WorkflowCard 
                            icon={<FileText size={24} />}
                            title="Guiones"
                            description="Planificación de guiones día a día. Accede a las versiones más recientes y aprueba cambios al instante."
                        />
                        <WorkflowCard 
                            icon={<Video size={24} />}
                            title="Producción"
                            description="Detalles técnicos de cómo realizaremos cada toma. Visualiza el equipo, localizaciones y hojas de ruta."
                        />
                        <WorkflowCard 
                            icon={<CheckCircle2 size={24} />}
                            title="Entregas"
                            description="Fechas estimadas de finalización y revisión. Gestiona el feedback y descarga tus archivos finales."
                        />
                    </motion.div>
                </section>
            </main>

            {/* FOOTER */}
            <footer className="border-t border-white/5 bg-[#080808] py-16">
                <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-3">
                        <div className="h-5 w-5 rounded-sm bg-[#CC0000]" />
                        <span className="font-bold uppercase tracking-tighter text-sm">Admus Productions</span>
                    </div>
                    <p className="text-xs text-gray-600 uppercase tracking-widest text-center">
                        © 2025 Admus Productions. Elevando el estándar audiovisual.
                    </p>
                    <div className="flex gap-6 text-xs text-gray-500 uppercase font-bold tracking-widest">
                        <a href="#" className="hover:text-[#CC0000] transition-colors">Instagram</a>
                        <a href="#" className="hover:text-[#CC0000] transition-colors">Vimeo</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}

// Sub-componente para las tarjetas de flujo de trabajo
function WorkflowCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <motion.div 
            variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
            }}
        >
            <Card className="h-full border-white/5 bg-white/[0.03] transition-all hover:bg-white/[0.06] hover:border-red-600/30 group">
                <CardContent className="p-8">
                    <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-red-600/10 text-[#CC0000] group-hover:scale-110 group-hover:bg-[#CC0000] group-hover:text-white transition-all duration-300">
                        {icon}
                    </div>
                    <h4 className="mb-4 text-xl font-bold text-white group-hover:text-[#CC0000] transition-colors">{title}</h4>
                    <p className="text-sm leading-relaxed text-gray-500 group-hover:text-gray-400">
                        {description}
                    </p>
                </CardContent>
            </Card>
        </motion.div>
    );
}