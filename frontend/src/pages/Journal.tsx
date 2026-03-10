import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight, User } from 'lucide-react';

const Journal = () => {
    const articles = [
        {
            title: "The Art of Layering: A Guide to Botanical Extracts",
            category: "Rituals",
            date: "May 10, 2024",
            readTime: "5 min",
            author: "Sophia Laurent",
            image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=1974&auto=format&fit=crop",
            excerpt: "Discover the ancient secrets of botanical layering and how it can transform your daily skincare into a moment of pure bliss."
        },
        {
            title: "Sustainable Sourcing: From Garden to Bottle",
            category: "Heritage",
            date: "May 5, 2024",
            readTime: "8 min",
            author: "Marco Rossi",
            image: "https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=2070&auto=format&fit=crop",
            excerpt: "A deep dive into our supply chain and how we ensure every drop of our serum respects the earth and its biodiversity."
        },
        {
            title: "Morning Sun Protection: The Ultimate Ritual",
            category: "Science",
            date: "April 28, 2024",
            readTime: "4 min",
            author: "Dr. Elena Vance",
            image: "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1920&auto=format&fit=crop",
            excerpt: "Clinical research shows that morning protection is the single most important step in preventing premature aging."
        }
    ];

    return (
        <div className="bg-white min-h-screen">
            <header className="py-24 px-6 container mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center gap-6"
                >
                    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">Our Journal</span>
                    <h1 className="text-6xl md:text-8xl font-black text-dark tracking-tighter leading-[0.9]">
                        Insights & <span className="italic font-serif text-secondary">Inspiration.</span>
                    </h1>
                    <p className="max-w-xl text-gray-400 font-medium text-lg leading-relaxed mt-4">
                        Explore the philosophy of mindful beauty, clinical breakthroughs, and the stories behind our botanicals.
                    </p>
                </motion.div>
            </header>

            <section className="px-6 container mx-auto pb-32">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {articles.map((article, idx) => (
                        <motion.article
                            key={article.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="flex flex-col group cursor-pointer"
                        >
                            <div className="relative aspect-[4/5] rounded-[40px] overflow-hidden mb-8 shadow-2xl shadow-black/5">
                                <img
                                    src={article.image}
                                    alt={article.title}
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                />
                                <div className="absolute top-8 left-8">
                                    <span className="px-6 py-2 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-black uppercase tracking-widest text-dark shadow-sm">
                                        {article.category}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 mb-4 text-[10px] font-black uppercase tracking-widest text-gray-300">
                                <span className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5" />{article.date}</span>
                                <span className="w-1.5 h-1.5 bg-gray-200 rounded-full" />
                                <span className="flex items-center gap-2"><Clock className="w-3.5 h-3.5" />{article.readTime} read</span>
                            </div>

                            <h2 className="text-3xl font-black text-dark tracking-tight leading-tight mb-4 group-hover:text-primary transition-colors">
                                {article.title}
                            </h2>

                            <p className="text-gray-400 font-medium leading-relaxed mb-8 line-clamp-3">
                                {article.excerpt}
                            </p>

                            <div className="mt-auto flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-dark/20 overflow-hidden">
                                        <User className="w-4 h-4" />
                                    </div>
                                    <span className="text-xs font-black text-dark/60 tracking-wider font-serif italic">{article.author}</span>
                                </div>

                                <motion.div
                                    whileHover={{ x: 5 }}
                                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary"
                                >
                                    Read Story <ArrowRight className="w-4 h-4" />
                                </motion.div>
                            </div>
                        </motion.article>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Journal;
