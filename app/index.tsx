import { BootSplash } from '@/components/views/BootSplash';
import { api } from '@/convex/_generated/api';
import { useAuthenticatedQuery } from '@/hooks/use-authenticated-query';
import { authClient } from '@/lib/auth-client';
import { Redirect } from 'expo-router';
import React, { useState } from 'react';

export default function IndexScreen() {
    const { data: session, isPending } = authClient.useSession();
    const user = session?.user as any;
    const hasCompletedToday = useAuthenticatedQuery(api.quests.hasCompletedTodaysQuest, {});
    const [isBootComplete, setIsBootComplete] = useState(false);

    console.log('Index Screen State:', {
        isPending,
        hasUser: !!user,
        hasUsername: !!user?.username,
        hasCompletedToday,
        isBootComplete
    });

    // Determine boot state
    const isAuthenticated = !!user;
    const isLoading = isPending || (isAuthenticated && user?.username && hasCompletedToday === undefined);

    // If boot sequence isn't done OR still loading data, show the splash
    if (!isBootComplete || isLoading) {
        return (
            <BootSplash
                state={isLoading ? 'loading' : (isAuthenticated ? 'authenticated' : 'unauthenticated')}
                onComplete={() => setIsBootComplete(true)}
            />
        );
    }

    // Not authenticated -> Onboarding
    if (!user) {
        return <Redirect href="/onboarding/splash" />;
    }

    // No username yet -> Username setup
    if (!user.username) {
        return <Redirect href="/onboarding/username" />;
    }

    // Fully onboarded -> Check if quest completed
    if (hasCompletedToday) {
        return <Redirect href="/lobby" />;
    }

    return <Redirect href="/gate" />;
}
