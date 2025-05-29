import Link from "next/link";
import Image from "next/image";


const footerSections = {
    discover: {
        title: "Discover",
        links: [
            { label: "How it works", href: "/how-it-works" },
            { label: "Success stories", href: "/success-stories" },
            { label: "Categories", href: "/categories" },
            { label: "Popular tasks", href: "/popular-tasks" },
        ],
    },
    company: {
        title: "Company",
        links: [
            { label: "About us", href: "/about" },
            { label: "Careers", href: "/careers" },
            { label: "Media enquiries", href: "/media" },
            { label: "Community guidelines", href: "/guidelines" },
        ],
    },
    support: {
        title: "Support",
        links: [
            { label: "Help center", href: "/help" },
            { label: "Contact us", href: "/contact" },
            { label: "Trust & safety", href: "/trust" },
            { label: "Terms of service", href: "/terms" },
        ],
    },
};

export function LandingFooter() {
    return (
        <footer className="bg-emerald-600 text-white py-12">
            <div className="max-w-6xl mx-auto px-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

                    {/* “Get the app” column */}
                    <div className="flex flex-col space-y-4">
                        <h3 className="text-xl font-semibold">Get the app</h3>
                        <div className="flex space-x-4">
                            <Link href="/download/app-store">
                                <p className="inline-block">
                                    <Image
                                        src="/app-store-badge.svg"
                                        alt="Download on the App Store"
                                        width={120}
                                        height={40}
                                    />
                                </p>
                            </Link>
                            <Link href="/download/google-play">
                                <p className="inline-block">
                                    <Image
                                        src="/google-play-badge.png"
                                        alt="Get it on Google Play"
                                        width={120}
                                        height={40}
                                    />
                                </p>
                            </Link>
                        </div>
                    </div>

                    {/* Other footer sections */}
                    {Object.entries(footerSections).map(([key, section]) => (
                        <div key={key}>
                            <h3 className="text-xl font-semibold mb-4">{section.title}</h3>
                            <ul className="space-y-2">
                                {section.links.map((link) => (
                                    <li key={link.href}>
                                        <Link href={link.href}>
                                            <p className="text-sm hover:text-emerald-300 transition-colors">
                                                {link.label}
                                            </p>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <h1 className='text-center mt-10 text-[3.3rem]  md:text-[8.5rem] font-extrabold'>DUOTASKS</h1>

                {/* Bottom bar */}
                <div className="mt-12 pt-6 border-t border-emerald-500 flex flex-col md:flex-row items-center justify-between text-sm">
                    <div className="mb-4 md:mb-0 opacity-90">
                        &copy; {new Date().getFullYear()} Duotasks. All rights reserved.
                    </div>
                    <div className="flex space-x-6">
                        <Link href="/privacy">
                            <p className="hover:text-emerald-300 transition-colors">Privacy Policy</p>
                        </Link>
                        <Link href="/terms">
                            <p className="hover:text-emerald-300 transition-colors">Terms of Service</p>
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
