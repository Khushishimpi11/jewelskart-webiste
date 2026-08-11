import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Mail, Gem, Sparkles, Clock } from "lucide-react";
import logo from "../assets/logo1.jpg";

const ComingSoonSection = () => {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!email.trim()) return;
        setSubmitted(true);
        setEmail("");
        // Redirect to business email
        window.location.href = "mailto:business@jewelskartindia.com";
    };

    return (
        <section className="relative w-full overflow-hidden bg-[#F8F1ED] px-3 py-3 sm:px-4 md:px-6">
            {/* ======================================== */}
            {/* BACKGROUND GRADIENT - PREMIUM LUXURY POSTER */}
            {/* ======================================== */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#F8F1ED] via-[#f5ebe6] via-[#f0dfd8] via-[#e8d0c8] to-[#611431] opacity-90" />

            {/* Subtle satin light effect - bottom area */}
            <motion.div
                animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                }}
                className="absolute bottom-0 left-0 right-0 h-2/5 bg-gradient-to-r from-transparent via-[#E8C99B]/10 to-transparent bg-[length:200%_100%]"
            />

            {/* Soft champagne-gold curved glow moving across bottom */}
            <motion.div
                animate={{
                    x: ["-100%", "200%"],
                    opacity: [0, 0.3, 0],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                    repeatDelay: 3,
                }}
                className="absolute bottom-0 left-0 h-[300px] w-[200px] rounded-full bg-[#E8C99B]/20 blur-3xl"
            />

            {/* ======================================== */}
            {/* MAIN POSTER CONTAINER */}
            {/* ======================================== */}
            <div className="relative mx-auto flex min-h-[85vh] max-h-[95vh] max-w-[1400px] flex-col rounded-2xl border-[1.5px] border-[#611431]/30 bg-white/5 backdrop-blur-[1px] shadow-2xl">
                {/* Inner soft glow */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/10 via-transparent to-[#611431]/5" />

                {/* ======================================== */}
                {/* SPARKLES - BLACK COLOR */}
                {/* ======================================== */}
                <Sparkle
                    color="#1a0d0f"
                    className="absolute left-3 top-3 sm:left-4 sm:top-4"
                />
                <Sparkle
                    color="#1a0d0f"
                    className="absolute right-3 top-3 sm:right-4 sm:top-4"
                />
                <Sparkle
                    color="#1a0d0f"
                    className="absolute left-6 top-1/2 hidden -translate-y-1/2 md:block"
                />
                <Sparkle
                    color="#1a0d0f"
                    className="absolute right-6 top-1/3 hidden -translate-y-1/2 md:block"
                />
                <Sparkle
                    color="#1a0d0f"
                    className="absolute bottom-6 right-3 sm:right-4"
                />

                {/* ======================================== */}
                {/* GOLD LIGHT TRAIL - SVG */}
                {/* ======================================== */}
                <svg
                    className="pointer-events-none absolute bottom-1/3 left-0 right-0 h-32 w-full opacity-20 md:h-48"
                    viewBox="0 0 400 100"
                    preserveAspectRatio="none"
                >
                    <motion.path
                        d="M 0 50 Q 100 10 200 50 T 400 50"
                        stroke="#E8C99B"
                        strokeWidth="1.5"
                        fill="none"
                        initial={{ strokeDashoffset: 400, opacity: 0 }}
                        animate={{
                            strokeDashoffset: 0,
                            opacity: [0.2, 0.6, 0.2],
                        }}
                        transition={{
                            strokeDashoffset: { duration: 6, ease: "easeInOut" },
                            opacity: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                        }}
                        strokeDasharray="400"
                    />
                    <motion.path
                        d="M 20 55 Q 120 15 220 55 T 380 55"
                        stroke="#E8C99B"
                        strokeWidth="0.8"
                        fill="none"
                        initial={{ strokeDashoffset: 380, opacity: 0 }}
                        animate={{
                            strokeDashoffset: 0,
                            opacity: [0.1, 0.4, 0.1],
                        }}
                        transition={{
                            strokeDashoffset: { duration: 8, ease: "easeInOut", delay: 0.5 },
                            opacity: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 },
                        }}
                        strokeDasharray="380"
                    />
                </svg>

                {/* ======================================== */}
                {/* CONTENT */}
                {/* ======================================== */}
                <div className="relative z-10 flex flex-1 flex-col items-center px-4 py-5 text-center sm:px-6 sm:py-6 md:px-12 md:py-8 lg:px-16">
                    {/* ========== LOGO ========== */}
                    <motion.div
                        initial={{ opacity: 0, y: -30, filter: "blur(8px)" }}
                        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        viewport={{ once: true }}
                        transition={{
                            duration: 1,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                        className="mb-3 flex min-h-[60px] items-center justify-center sm:mb-4 sm:min-h-[70px] md:mb-5"
                    >
                        <img
                            src={logo}
                            alt="JewelsKart"
                            className="max-h-[55px] w-auto max-w-[160px] object-contain sm:max-h-[70px] sm:max-w-[200px] md:max-h-[85px] md:max-w-[240px]"
                        />
                    </motion.div>

                    {/* ========== TOP TEXT - SEPARATE WORDS ========== */}
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{
                            duration: 0.7,
                            delay: 0.2,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                        className="mb-1 flex flex-wrap items-center justify-center gap-x-2 text-[8px] font-medium uppercase tracking-[0.3em] text-[#611431] sm:text-[9px] md:text-[10px]"
                    >
                        <span>S</span>
                        <span>O</span>
                        <span>M</span>
                        <span>E</span>
                        <span>T</span>
                        <span>H</span>
                        <span>I</span>
                        <span>N</span>
                        <span>G</span>
                        <span className="w-1"></span>
                        <span>P</span>
                        <span>R</span>
                        <span>E</span>
                        <span>C</span>
                        <span>I</span>
                        <span>O</span>
                        <span>U</span>
                        <span>S</span>
                        <span className="w-1"></span>
                        <span>I</span>
                        <span>S</span>
                        <span className="w-1"></span>
                        <span>A</span>
                        <span>R</span>
                        <span>R</span>
                        <span>I</span>
                        <span>V</span>
                        <span>I</span>
                        <span>N</span>
                        <span>G</span>
                    </motion.div>

                    {/* Decorative line */}
                    <motion.div
                        initial={{ scaleX: 0, opacity: 0 }}
                        whileInView={{ scaleX: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{
                            duration: 0.8,
                            delay: 0.3,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                        className="mb-3 text-[#E8C99B] tracking-[0.3em] sm:mb-4 md:mb-5"
                    >
                        ──── ✦ ────
                    </motion.div>

                    {/* ========== MAIN COMING SOON ========== */}
                    <div className="flex flex-1 flex-col items-center justify-center -space-y-1 sm:-space-y-2">
                        {/* COMING */}
                        <div className="overflow-hidden w-full">
                            <motion.h2
                                initial={{ y: "100%", filter: "blur(8px)" }}
                                whileInView={{ y: 0, filter: "blur(0px)" }}
                                viewport={{ once: true }}
                                transition={{
                                    duration: 1,
                                    delay: 0.4,
                                    ease: [0.22, 1, 0.36, 1],
                                }}
                                className="font-serif text-[clamp(3.5rem,16vw,7rem)] leading-[0.85] tracking-[-0.03em] text-[#1a0d0f]"
                                style={{ fontFamily: "'Playfair Display', serif" }}
                            >
                                COMING
                            </motion.h2>
                        </div>

                        {/* SOON with STAY TUNED overlay */}
                        <div className="relative w-full overflow-visible">
                            <div className="overflow-hidden w-full">
                                <motion.h2
                                    initial={{ y: "100%", filter: "blur(8px)" }}
                                    whileInView={{ y: 0, filter: "blur(0px)" }}
                                    viewport={{ once: true }}
                                    transition={{
                                        duration: 1,
                                        delay: 0.55,
                                        ease: [0.22, 1, 0.36, 1],
                                    }}
                                    className="font-serif text-[clamp(4.5rem,20vw,8rem)] leading-[0.8] tracking-[-0.04em] bg-black bg-clip-text text-transparent"
                                    style={{ fontFamily: "'Playfair Display', serif" }}
                                >
                                    SOON
                                </motion.h2>
                            </div>

                            {/* STAY TUNED - Handwritten style overlay */}
                            <motion.div
                                initial={{ clipPath: "inset(0 100% 0 0)" }}
                                whileInView={{ clipPath: "inset(0 0% 0 0)" }}
                                viewport={{ once: true }}
                                transition={{
                                    duration: 1.2,
                                    delay: 1.0,
                                    ease: [0.22, 1, 0.36, 1],
                                }}
                                className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 rotate-[-3deg]"
                            >
                                <span
                                    className="block font-script font-semibold md:font-medium text-[clamp(2rem,9vw,4.5rem)] leading-none tracking-wide text-[#e0417e]"
                                    style={{
                                        fontFamily: "'Great Vibes', cursive",
                                        textShadow:
                                            "0 0 30px rgba(232, 201, 155, 0.3), 0 0 60px rgba(232, 201, 155, 0.1)",
                                    }}
                                >
                                    Stay Tuned
                                </span>
                            </motion.div>
                        </div>
                    </div>

                    {/* ========== DESCRIPTION ========== */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{
                            duration: 0.8,
                            delay: 1.2,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                        className="mx-auto mt-4 max-w-xs text-[11px] leading-relaxed text-[#3d2a2a]/80 sm:mt-5 sm:max-w-sm sm:text-[12px] md:mt-6 md:max-w-md md:text-[13px]"
                    >
                        “A new destination for timeless
                        <br className="sm:hidden" />
                        jewellery and modern elegance
                        <br />
                        is almost ready to be unveiled.”
                    </motion.p>

                    {/* ========== EMAIL CTA - BURGUNDY BORDER ========== */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{
                            duration: 0.8,
                            delay: 1.35,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                        className="mt-4 w-full max-w-md sm:mt-5 md:max-w-lg"
                    >
                        {!submitted ? (
                            <form
                                onSubmit={handleSubmit}
                                className="group flex items-center overflow-hidden rounded-full border-2 border-[#611431] bg-white/10 backdrop-blur-sm transition-all duration-300 hover:border-[#7A173D] focus-within:border-[#7A173D]"
                            >
                                <div className="flex flex-1 items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2">
                                    <Mail className="h-3.5 w-3.5 text-[#611431]/60 sm:h-4 sm:w-4" />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email"
                                        className="min-w-0 flex-1 bg-transparent py-1 text-[11px] text-[#1a0d0f] outline-none placeholder:text-[#611431]/40 sm:text-[12px]"
                                    />
                                </div>
                                <motion.button
                                    whileHover={{ x: 4 }}
                                    whileTap={{ scale: 0.95 }}
                                    type="submit"
                                    className="flex items-center gap-1 bg-[#611431] px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.15em] text-[#F8F1ED] transition-colors duration-300 hover:bg-[#7A173D] sm:px-5 sm:py-2 sm:text-[10px]"
                                >
                                    Notify Me
                                    <ArrowRight size={12} className="transition-transform duration-300 group-hover:translate-x-1 sm:size-[14px]" />
                                </motion.button>
                            </form>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="rounded-full border-2 border-[#611431]/30 bg-white/20 px-4 py-2.5 backdrop-blur-sm sm:px-6 sm:py-3"
                            >
                                <p className="text-[11px] font-medium text-[#611431] sm:text-[13px]">
                                    ✦ You're on the list. Be the first to know.
                                </p>
                            </motion.div>
                        )}

                        {/* Sub-text */}
                        <motion.p
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 1.5 }}
                            className="mt-2 text-[8px] tracking-[0.2em] text-[#000] sm:text-[12px]"
                        >
                            ◇  Be the first to know
                        </motion.p>
                    </motion.div>

                    {/* ========== BOTTOM AREA - BLACK BOLD TEXT, BURGUNDY ICONS WITH GOLDEN COLOR ========== */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{
                            duration: 0.8,
                            delay: 1.5,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                        className="mt-3 w-full pt-3 sm:mt-4 sm:pt-4 md:mt-5 md:pt-5"
                    >
                        <div className="flex items-center justify-center gap-3 sm:gap-5 md:gap-7">
                            <span className="flex flex-col items-center gap-0.5">
                                <div className="rounded-full bg-[#611431] p-1">
                                    <Gem className="h-3 w-3 text-[#E8C99B] sm:h-3.5 sm:w-3.5" />
                                </div>
                                <span className="text-[7px] font-bold uppercase tracking-[0.25em] text-[#1a0d0f] sm:text-[8px] md:text-[9px]">Fine</span>
                                <span className="text-[7px] font-bold uppercase tracking-[0.25em] text-[#1a0d0f] sm:text-[8px] md:text-[9px]">Jewellery</span>
                            </span>

                            <span className="h-8 w-px bg-[#1a0d0f]/20 sm:h-10" />

                            <span className="flex flex-col items-center gap-0.5">
                                <div className="rounded-full bg-[#611431] p-1">
                                    <Sparkles className="h-3 w-3 text-[#E8C99B] sm:h-3.5 sm:w-3.5" />
                                </div>
                                <span className="text-[7px] font-bold uppercase tracking-[0.25em] text-[#1a0d0f] sm:text-[8px] md:text-[9px]">Jewels</span>
                                <span className="text-[7px] font-bold uppercase tracking-[0.25em] text-[#1a0d0f] sm:text-[8px] md:text-[9px]">Kart</span>
                            </span>

                            <span className="h-8 w-px bg-[#1a0d0f]/20 sm:h-10" />

                            <span className="flex flex-col items-center gap-0.5">
                                <div className="rounded-full bg-[#611431] p-1">
                                    <Clock className="h-3 w-3 text-[#E8C99B] sm:h-3.5 sm:w-3.5" />
                                </div>
                                <span className="text-[7px] font-bold uppercase tracking-[0.25em] text-[#1a0d0f] sm:text-[8px] md:text-[9px]">Coming</span>
                                <span className="text-[7px] font-bold uppercase tracking-[0.25em] text-[#1a0d0f] sm:text-[8px] md:text-[9px]">Soon</span>
                            </span>
                        </div>

                        {/* Double chevron - Black bold */}
                        <motion.div
                            animate={{
                                y: [0, 3, 0],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                            className="mt-2 flex flex-col items-center text-[#1a0d0f]/40 sm:mt-3"
                        >
                            <span className="-mb-1 text-[8px] font-bold">⌄</span>
                            <span className="text-[8px] font-bold">⌄</span>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default ComingSoonSection;

/* =====================================================
   SPARKLE COMPONENT - 4-point jewellery sparkle (BLACK)
===================================================== */

type SparkleProps = {
    color?: string;
    className?: string;
};

const Sparkle = ({ color = "#1a0d0f", className = "" }: SparkleProps) => {
    return (
        <motion.div
            animate={{
                scale: [0.6, 1.15, 0.6],
                opacity: [0.3, 1, 0.3],
                rotate: [0, 15, 0],
            }}
            transition={{
                duration: 3.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 2,
            }}
            className={`relative h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 ${className}`}
        >
            <div
                className="absolute inset-0"
                style={{
                    backgroundColor: color,
                    clipPath:
                        "polygon(50% 0%, 55% 35%, 100% 50%, 55% 65%, 50% 100%, 45% 65%, 0% 50%, 45% 35%)",
                }}
            />
            {/* Inner sparkle dot */}
            <div
                className="absolute left-1/2 top-1/2 h-0.5 w-0.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#E8C99B] sm:h-0.5 sm:w-0.5"
                style={{
                    opacity: 0.6,
                }}
            />
        </motion.div>
    );
};