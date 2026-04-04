import React from 'react';
import { Link } from 'react-router-dom';
import { Hero, Features } from '@/features/landing';

const Home: React.FC = () => {
    return (
        <div className="bg-base-100 min-h-screen">
            <Hero />
            <Features />

            {/* Final CTA Section */}
            <section className="py-24 bg-primary text-primary-content">
                <div className="container mx-auto px-6 lg:px-12 text-center space-y-8">
                    <h2 className="text-4xl lg:text-6xl font-heading font-black tracking-tight">Ready to join the <span className="italic font-medium">Digital Atheneum?</span></h2>
                    <p className="max-w-2xl mx-auto text-lg lg:text-xl font-medium opacity-80 leading-relaxed">
                        Secure your place in the future of education. Join 42,000+ scholars mastering the world's most curated knowledge.
                    </p>
                    <div className="pt-8">
                        <Link to="/register" className="btn btn-secondary h-16 px-12 rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-2xl hover:scale-105 active:scale-95 transition-all border-none">
                            Create Free Account
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
