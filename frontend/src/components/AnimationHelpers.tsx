import { motion } from 'framer-motion';
import { useRef, useState } from 'react';

// ═══ Text Reveal Animation ═══
export const TextReveal = ({ text, className = "" }: { text: string; className?: string }) => {
    const words = text.split(" ");
    
    return (
        <span className={`inline-block ${className}`}>
            {words.map((word, i) => (
                <span key={i} className="inline-block overflow-hidden mr-[0.2em] py-[0.1em] -my-[0.1em]">
                    <motion.span
                        initial={{ y: "100%" }}
                        whileInView={{ y: 0 }}
                        viewport={{ once: true }}
                        transition={{ 
                            duration: 1.2, 
                            delay: i * 0.1, 
                            ease: [0.16, 1, 0.3, 1] 
                        }}
                        className="inline-block pr-[0.1em] pb-[0.1em]"
                    >
                        {word}
                    </motion.span>
                </span>
            ))}
        </span>
    );
};

// ═══ Magnetic Button Effect ═══
export const MagneticButton = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouse = (e: React.MouseEvent) => {
        const { clientX, clientY } = e;
        const { left, top, width, height } = ref.current!.getBoundingClientRect();
        const centerX = left + width / 2;
        const centerY = top + height / 2;
        const x = (clientX - centerX) * 0.35;
        const y = (clientY - centerY) * 0.35;
        setPosition({ x, y });
    };

    const reset = () => {
        setPosition({ x: 0, y: 0 });
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouse}
            onMouseLeave={reset}
            animate={{ x: position.x, y: position.y }}
            transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

// ═══ Skeleton Loader for Luxury UI ═══
export const SkeletonLoader = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="flex flex-col gap-6 animate-pulse">
                    <div className="aspect-[3/4] bg-primary/[0.03] rounded-[50px] border border-secondary/5" />
                    <div className="flex flex-col items-center gap-3 px-10">
                        <div className="h-2 w-20 bg-primary/[0.03] rounded-full" />
                        <div className="h-6 w-48 bg-primary/[0.05] rounded-full" />
                        <div className="h-4 w-24 bg-primary/[0.03] rounded-full" />
                    </div>
                </div>
            ))}
        </div>
    );
};
// ═══ Global Product Sanitizer ═══
export const sanitizeProductName = (name: string | undefined): string => {
    if (!name) return "Aesthetic Adornment";
    const lower = name.toLowerCase();
    
    // Legacy Skincare -> Hair Accessory Mapping
    if (lower.includes('cream') || lower.includes('face')) return "Silk Ribbon Adornment";
    if (lower.includes('soap')) return "Pearl Hair Pin";
    if (lower.includes('brush') || lower.includes('towel')) return "Velvet Bow Clip";
    if (lower.includes('skin')) return "Artisan Hair Band";
    if (lower.includes('apothecary')) return "Vintage Gold Clip";
    
    return name;
};

export const sanitizeCategoryName = (name: string | undefined): string => {
    if (!name) return "Studio Selection";
    const lower = name.toLowerCase();
    if (lower.includes('skin')) return "Adornments";
    return name;
};
