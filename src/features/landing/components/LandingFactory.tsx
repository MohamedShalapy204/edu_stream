import React from 'react';
import { useCurrentAccount } from '@/features/auth';
import { GuestLanding } from './GuestLanding';
import { UserLanding } from './UserLanding';

/**
 * 🏭 LandingFactory
 * 
 * Determines which landing experience to provide based on account state.
 * Implements the Factory Design Pattern to separate Guest/User logic.
 */
export const LandingFactory: React.FC = () => {
    const { data: account } = useCurrentAccount();

    // Return the appropriate landing variant based on authentication
    if (account) {
        return <UserLanding account={account} />;
    }

    return <GuestLanding />;
};
