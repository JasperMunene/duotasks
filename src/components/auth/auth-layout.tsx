import Link from 'next/link';
import Image from 'next/image';

interface AuthLayoutProps {
    children: React.ReactNode;
    heading: string;
    subheading: string;
    backTo?: {
        href: string;
        label: string;
    };
}

export function AuthLayout({
                               children,
                               heading,
                               subheading,
                               backTo,
                           }: AuthLayoutProps) {
    return (
        <div className="min-h-screen flex bg-gray-50 dark:bg-[#1C1917] overflow-hidden">
            {/* Left side - Image */}
            <div className="hidden lg:flex lg:w-1/3 relative overflow-hidden bg-primary/5">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
                <div className="relative w-full h-full">
                    <Image
                        src="/auth.png"
                        alt="Tasker smiling"
                        fill
                        className="object-cover object-center opacity-90"
                        priority
                        sizes="(min-width: 1024px) 33vw, 100vw"
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>

            {/* Right side - Auth Form */}
            <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 lg:px-16">
                {/* Background Accents */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-bl-full -z-10" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/10 rounded-tr-full -z-10" />

                <div className="w-full max-w-md space-y-10">
                    <div className="text-center">
                        <Link
                            href="/"
                            className="inline-flex items-center space-x-2 mb-6 transition-transform hover:scale-105"
                        >
                            <span className="font-extrabold text-4xl text-primary">Duotasks</span>
                        </Link>

                        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                            {heading}
                        </h1>
                        <p className="mt-2 text-lg text-muted-foreground">{subheading}</p>
                    </div>

                    <div className="relative bg-white dark:bg-card p-8 rounded-2xl shadow-xl border border-primary/10">
                        {/* Corner Accents */}
                        <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-primary/30 rounded-tl-xl" />
                        <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-primary/30 rounded-br-xl" />

                        {children}
                    </div>

                    {backTo && (
                        <div className="text-center">
                            <Link
                                href={backTo.href}
                                className="text-sm text-primary hover:underline transition-colors"
                            >
                                {backTo.label}
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
