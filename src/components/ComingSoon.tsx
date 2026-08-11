import { motion } from "framer-motion";
import { ArrowRight, Instagram, Mail, Sparkles } from "lucide-react";
import { useState } from "react";

export default function ComingSoon() {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!email.trim()) return;

        setSubmitted(true);
        setEmail("");
    };

    return (
        <main className="relative min-h-screen overflow-hidden bg-[#090506] text-white">
            {/* Background glow */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute left-1/2 top-[-250px] h-[650px] w-[650px] -translate-x-1/2 rounded-full bg-[#611431]/30 blur-[140px]" />

                <div className="absolute bottom-[-300px] right-[-200px] h-[600px] w-[600px] rounded-full bg-[#7a173d]/20 blur-[160px]" />

                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.68)_70%,rgba(0,0,0,0.95)_100%)]" />
            </div>

            {/* Grain */}
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.035]"
                style={{
                    backgroundImage:
                        "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='.7'/%3E%3C/svg%3E\")",
                }}
            />

            {/* Animated light sweep */}
            <motion.div
                initial={{ x: "-150%" }}
                animate={{ x: "180%" }}
                transition={{
                    duration: 5,
                    repeat: Infinity,
                    repeatDelay: 2,
                    ease: "easeInOut",
                }}
                className="pointer-events-none absolute top-0 h-full w-[140px] rotate-[10deg] bg-gradient-to-r from-transparent via-[#e7c987]/10 to-transparent blur-2xl"
            />

            {/* Header */}
            <header className="relative z-20 flex items-center justify-between px-6 py-6 md:px-12 lg:px-20">
                <motion.div
                    initial={{ opacity: 0, y: -15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="flex items-center"
                >
                    {/* Replace with your actual logo */}
                    <img
                        src="/logo.png"
                        alt="JewelsKart"
                        className="h-10 w-auto object-contain md:h-12"
                    />
                </motion.div>

                <motion.a
                    initial={{ opacity: 0, y: -15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.15 }}
                    href="https://instagram.com"
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-white/60 transition-colors hover:text-white"
                >
                    <Instagram size={17} />
                    <span className="hidden sm:inline">Instagram</span>
                </motion.a>
            </header>

            {/* Hero */}
            <section className="relative z-10 flex min-h-[calc(100vh-96px)] items-center justify-center px-6 pb-12 pt-8">
                <div className="mx-auto w-full max-w-6xl text-center">
                    {/* Small top badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="mb-7 flex justify-center"
                    >
                        <div className="flex items-center gap-2 rounded-full border border-[#d7b875]/20 bg-white/[0.03] px-4 py-2 backdrop-blur-md">
                            <Sparkles size={13} className="text-[#d7b875]" />

                            <span className="text-[10px] uppercase tracking-[0.32em] text-[#dfc98f]">
                                Something Precious Is Coming
                            </span>
                        </div>
                    </motion.div>

                    {/* Main heading */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                            duration: 1,
                            delay: 0.35,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                    >
                        <p className="mb-4 text-xs uppercase tracking-[0.45em] text-white/40">
                            Introducing
                        </p>

                        <h1 className="font-serif text-[clamp(3.2rem,10vw,8.5rem)] font-light leading-[0.85] tracking-[-0.04em]">
                            JEWELS
                            <span className="bg-gradient-to-r from-[#ad8845] via-[#f1dc9b] to-[#ad8845] bg-clip-text text-transparent">
                                KART
                            </span>
                        </h1>
                    </motion.div>

                    {/* Divider */}
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: 110 }}
                        transition={{ duration: 1.1, delay: 0.8 }}
                        className="mx-auto my-8 h-px bg-gradient-to-r from-transparent via-[#d8bd7a] to-transparent"
                    />

                    {/* Coming Soon */}
                    <motion.h2
                        initial={{ opacity: 0, letterSpacing: "0.7em" }}
                        animate={{ opacity: 1, letterSpacing: "0.38em" }}
                        transition={{ duration: 1.2, delay: 0.65 }}
                        className="text-sm font-medium uppercase text-[#e3cd99] md:text-base"
                    >
                        Coming Soon
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.9, delay: 0.9 }}
                        className="mx-auto mt-6 max-w-xl text-sm leading-7 text-white/50 md:text-base"
                    >
                        A new destination for timeless jewellery, crafted details and
                        modern elegance is almost ready to be unveiled.
                    </motion.p>

                    {/* Email Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.9, delay: 1.1 }}
                        className="mx-auto mt-10 max-w-md"
                    >
                        {!submitted ? (
                            <form
                                onSubmit={handleSubmit}
                                className="flex items-center border-b border-white/20 pb-2 transition-colors focus-within:border-[#d9bd79]/70"
                            >
                                <Mail
                                    size={17}
                                    className="mr-3 shrink-0 text-white/35"
                                />

                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email for early access"
                                    className="min-w-0 flex-1 bg-transparent py-3 text-sm text-white outline-none placeholder:text-white/30"
                                />

                                <motion.button
                                    whileHover={{ x: 4 }}
                                    whileTap={{ scale: 0.95 }}
                                    type="submit"
                                    aria-label="Notify me"
                                    className="ml-3 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#d9bd79]/30 text-[#e0c681] transition-colors hover:bg-[#d9bd79] hover:text-black"
                                >
                                    <ArrowRight size={16} />
                                </motion.button>
                            </form>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="border border-[#d9bd79]/20 bg-[#d9bd79]/5 px-5 py-4 text-sm text-[#e5ce95]"
                            >
                                You're on the list. We'll let you know when JewelsKart
                                launches.
                            </motion.div>
                        )}
                    </motion.div>

                    {/* Bottom luxury text */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 1.5 }}
                        className="mt-16 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-[9px] uppercase tracking-[0.3em] text-white/25"
                    >
                        <span>Fine Jewellery</span>

                        <span className="h-1 w-1 rounded-full bg-[#d8bd7a]/50" />

                        <span>Timeless Craftsmanship</span>

                        <span className="h-1 w-1 rounded-full bg-[#d8bd7a]/50" />

                        <span>Designed To Be Remembered</span>
                    </motion.div>
                </div>
            </section>

            {/* Side decorative lines */}
            <div className="pointer-events-none absolute bottom-12 left-6 top-28 hidden w-px bg-gradient-to-b from-transparent via-white/10 to-transparent md:block lg:left-12" />

            <div className="pointer-events-none absolute bottom-12 right-6 top-28 hidden w-px bg-gradient-to-b from-transparent via-white/10 to-transparent md:block lg:right-12" />
        </main>
    );
}