import AppLogoIcon from '@/components/app-logo-icon';
import { HeroGeometric } from '@/components/ui/shadcn-io/shape-landing-hero';
import { home } from '@/routes';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: PropsWithChildren<AuthLayoutProps>) {
    return (
        <HeroGeometric
            badge=""
            title1=""
            title2=""
            description=""
            className="relative"
        >
            <div className="absolute inset-0 z-10 flex items-center justify-center p-6 md:p-10">
                <div className="w-full max-w-sm">
                    <div className="flex flex-col gap-8 rounded-2xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-xl">
                        <div className="flex flex-col items-center gap-4">
                            <Link
                                href={home()}
                                className="flex flex-col items-center gap-2 font-medium"
                            >
                                <div className="mb-1 flex h-9 w-9 items-center justify-center rounded-md bg-white/10">
                                    <AppLogoIcon className="size-9 fill-current text-white" />
                                </div>
                                <span className="sr-only">{title}</span>
                            </Link>

                            <div className="space-y-2 text-center">
                                <h1 className="text-xl font-medium text-white">
                                    {title}
                                </h1>
                                <p className="text-center text-sm text-white/70">
                                    {description}
                                </p>
                            </div>
                        </div>
                        <div className="text-white">{children}</div>
                    </div>
                </div>
            </div>
        </HeroGeometric>
    );
}
