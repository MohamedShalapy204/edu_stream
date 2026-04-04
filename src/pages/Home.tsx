import React from 'react';
import { LandingFactory } from '@/features/landing';

/**
 * 🏠 Home Page
 * 
 * The main entry point. It delegates the landing experience to the
 * LandingFactory to provide personalized Guest/User variants.
 */
const Home: React.FC = () => {
    return (
        <div className="bg-base-100 min-h-screen">
            <LandingFactory />
        </div>
    );
};

export default Home;
