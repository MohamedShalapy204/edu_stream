import React from 'react';
import { Hero } from './Hero';
import { Features } from './Features';
import { LandingCTA } from './LandingCTA';

export const GuestLanding: React.FC = () => {
    return (
        <div className="animate-in fade-in duration-700">
            <Hero />
            <Features />
            <LandingCTA />
        </div>
    );
};
