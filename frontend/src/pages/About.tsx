import { motion } from 'framer-motion';
import { Leaf, ShieldCheck, Heart, Sparkles, Sprout, Globe } from 'lucide-react';

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

            {/* Values Section */}
            <section className="py-32 bg-gray-50 px-6">
                <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
                    {[
                        { icon: Sprout, title: "Botanical Mastery", desc: "Every extract is harvested at its nutritional peak from our sustainable gardens.", color: "primary" },
                        { icon: ShieldCheck, title: "Clinical Purity", desc: "Rigorous testing ensures results-driven performance without harmful synthetics.", color: "secondary" },
                        { icon: Globe, title: "Ethical Impact", desc: "A commitment to 100% recyclable glass and zero carbon-neutral distribution.", color: "dark" }
                    ].map((value, idx) => (
                        <motion.div
                            key={value.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="p-10 bg-white rounded-[50px] shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden relative group"
                        >
                            <div className={`w-16 h-16 rounded-2xl bg-${value.color}/10 flex items-center justify-center text-${value.color} mb-8 group-hover:bg-${value.color} group-hover:text-white transition-all duration-500`}>
                                <value.icon className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-black text-dark tracking-tight mb-4">{value.title}</h3>
                            <p className="text-gray-400 font-medium leading-relaxed">{value.desc}</p>
                            <div className="absolute top-0 right-0 p-8 text-black/5">
                                <value.icon className="w-24 h-24" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Timeline Section */}
            <section className="py-32 px-6 container mx-auto">
                <div className="flex flex-col gap-20">
                    <div className="flex flex-col gap-4 text-center">
                        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">Our Journey</span>
                        <h2 className="text-5xl font-black text-dark tracking-tighter">The Evolution of Blossom.</h2>
                    </div>

                    <div className="relative">
                        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-100 hidden md:block" />

                        <div className="flex flex-col gap-12">
                            {[
                                { year: "2016", title: "The First Bloom", desc: "Blossom started as a small boutique garden in Provence, focusing on pure rose extracts." },
                                { year: "2018", title: "Scientific Synergy", desc: "Partnered with dermatologists to blend botanical extracts with clinical actives." },
                                { year: "2021", title: "Global Rituals", desc: "Launched across 40 countries, bringing premium rituals to modern homes worldwide." },
                                { year: "2024", title: "The New Essence", desc: "Achieved B-Corp status with 100% sustainable packaging and carbon-neutral goals." }
                            ].map((milestone, idx) => (
                                <motion.div
                                    key={milestone.year}
                                    initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    className={`flex flex-col md:flex-row items-center gap-10 ${idx % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
                                >
                                    <div className="flex-1 text-center md:text-right px-10">
                                        {idx % 2 === 0 ? (
                                            <>
                                                <span className="text-3xl font-black text-primary/20 tracking-tighter mb-2 block">{milestone.year}</span>
                                                <h4 className="text-2xl font-black text-dark mb-4">{milestone.title}</h4>
                                                <p className="text-gray-400 font-medium">{milestone.desc}</p>
                                            </>
                                        ) : null}
                                    </div>
                                    <div className="w-4 h-4 rounded-full bg-dark ring-8 ring-white z-10 hidden md:block" />
                                    <div className="flex-1 text-center md:text-left px-10">
                                        {idx % 2 === 1 ? (
                                            <>
                                                <span className="text-3xl font-black text-primary/20 tracking-tighter mb-2 block">{milestone.year}</span>
                                                <h4 className="text-2xl font-black text-dark mb-4">{milestone.title}</h4>
                                                <p className="text-gray-400 font-medium">{milestone.desc}</p>
                                            </>
                                        ) : null}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
