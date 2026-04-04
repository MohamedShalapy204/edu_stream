import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

export const LandingCTA: React.FC = () => {
    return (
        <section className="py-24 bg-primary text-primary-content overflow-hidden relative">
            {/* Decorative background accent */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

            <div className="container mx-auto px-6 lg:px-12 text-center space-y-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="text-4xl lg:text-6xl font-heading font-black tracking-tight">
                        Ready to join the <span className="italic font-medium text-secondary-content">Digital Atheneum?</span>
                    </h2>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 0.8, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    className="max-w-2xl mx-auto text-lg lg:text-xl font-medium leading-relaxed"
                >
                    Secure your place in the future of education. Join 42,000+ scholars mastering the world's most curated knowledge.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="pt-8"
                >
                    <Link
                        to="/register"
                        className="btn btn-secondary h-16 px-12 rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-2xl hover:scale-105 active:scale-95 transition-all border-none"
                    >
                        Create Free Account
                    </Link>
                </motion.div>
            </div>
        </section>
    );
};
