import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Bell, Calendar, Smartphone, Users } from 'lucide-react';

export default function Welcome({ canRegister = true }: { canRegister?: boolean }) {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Bienvenido">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>

            <div className="min-h-screen w-full bg-gradient-to-br from-black via-blue-900 via-red-900 to-cyan-700 text-white">

                {/* NAVBAR */}
                <header className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
                    <h1 className="text-3xl font-extrabold tracking-wide">MiCalendario</h1>

                    <nav className="hidden md:flex gap-6 text-lg">
                        <a href="#features" className="transition hover:text-cyan-300">Características</a>
                        <a href="#" className="transition hover:text-cyan-300">Sobre Nosotros</a>
                        <a href="#" className="transition hover:text-cyan-300">Contacto</a>
                    </nav>

                    {auth.user ? (
                        <Link href={dashboard()}>
                            <Button className="bg-cyan-500 font-semibold text-black hover:bg-cyan-400">
                                Ingresar
                            </Button>
                        </Link>
                    ) : (
                        <div className="flex gap-4">
                            <Link href={login()}>
                                <Button className="bg-red-500 text-black font-semibold hover:bg-red-400">
                                    Iniciar Sesion
                                </Button>
                            </Link>

                            
                        </div>
                    )}
                </header>

                {/* HERO */}
                <section className="grid grid-cols-1 items-center gap-10 px-8 py-20 max-w-7xl mx-auto lg:grid-cols-2">

                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7 }}
                    >
                        <h2 className="mb-6 text-5xl font-extrabold leading-tight">
                            El calendario moderno<br />que organiza tu vida
                        </h2>

                        <p className="text-lg text-gray-200 max-w-md mb-8">
                            Un sistema colaborativo, diseñado para equipos, familias,
                            empresas y proyectos que necesitan organización real.
                        </p>

                        <Link href={login()}>
                            <Button className="rounded-xl bg-red-500 px-6 py-3 text-lg text-black shadow-lg hover:bg-red-400">
                                Comenzar ahora
                            </Button>
                        </Link>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7 }}
                    >
                        <div className="h-80 w-full rounded-3xl bg-gradient-to-br from-blue-600 via-cyan-500 to-red-500 shadow-xl blur-[1px]"></div>
                    </motion.div>
                </section>

                {/* FEATURES */}
                <section id="features" className="px-8 py-24 max-w-7xl mx-auto">
                    <h3 className="text-4xl font-bold mb-16 text-center">Características principales</h3>

                    <div className="grid gap-10 md:grid-cols-3">
                        <Card className="rounded-2xl border-white/20 bg-white/10 text-white shadow-xl backdrop-blur-lg">
                            <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
                                <Calendar size={40} />
                                <h4 className="text-2xl font-bold">Calendarios compartidos</h4>
                                <p className="text-gray-200 text-sm">
                                    Comparte eventos y actividades con tus equipos, familia o proyectos.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="rounded-2xl border-white/20 bg-white/10 text-white shadow-xl backdrop-blur-lg">
                            <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
                                <Users size={40} />
                                <h4 className="text-2xl font-bold">Colaboración en tiempo real</h4>
                                <p className="text-gray-200 text-sm">
                                    Todos ven cambios instantáneamente, sin confusiones ni retrasos.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="rounded-2xl border-white/20 bg-white/10 text-white shadow-xl backdrop-blur-lg">
                            <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
                                <Bell size={40} />
                                <h4 className="text-2xl font-bold">Recordatorios inteligentes</h4>
                                <p className="text-gray-200 text-sm">
                                    Alertas personalizadas para que nunca olvides nada.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </section>


                {/* FOOTER */}
                <footer id="contact" className="border-t border-white/10 py-10 text-center">
                    <p className="text-gray-300">© 2025 MiCalendario — Todos los derechos reservados</p>
                </footer>
            </div>
        </>
    );
}
