import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const About = () => {
    return (
        <div className="flex flex-col bg-white">
            {/* Hero Section */}
            <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=1974&auto=format&fit=crop"
                        alt="Botanical background"
                        className="w-full h-full object-cover scale-110 opacity-40 blur-sm"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white" />
                </div>

                <div className="relative z-10 container mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                        className="flex flex-col items-center gap-6"
                    >
                        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">The Heritage</span>
                        <h1 className="text-6xl md:text-8xl font-black text-dark tracking-tighter leading-[0.9]">
                            Rooted in <span className="italic font-serif text-primary">Nature.</span><br />
                            Refined by <span className="text-secondary italic font-serif">Science.</span>
                        </h1>
                        <p className="max-w-xl text-gray-500 font-medium text-lg leading-relaxed mt-4">
                            Born in the gardens of the Mediterranean and perfected in our Parisian laboratories,
                            Blossom represents the ultimate synergy of botanical mastery and clinical skincare.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Values Section - Placeholder for real values */}
            <section className="py-32 bg-gray-50 px-6">
                <div className="container mx-auto text-center">
                    <div className="flex flex-col gap-4 max-w-2xl mx-auto">
                        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">Our Philosophy</span>
                        <h2 className="text-4xl font-black text-dark tracking-tighter">Commitment to Purity.</h2>
                        <p className="text-gray-400 font-medium leading-relaxed">
                            Blossom is dedicated to the fusion of botanical mastery and clinical science. 
                            Our journey is defined by a relentless pursuit of ethical sourcing and results-driven skincare ritual.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
