import { CameraView } from '@/components/views/CameraView';
import { api } from '@/convex/_generated/api';
import { useQuery } from 'convex/react';
import { useRouter } from 'expo-router';
import React from 'react';

export default function CameraScreen() {
    const router = useRouter();
    const quest = useQuery(api.quests.getActiveQuest);

    const handleClose = () => {
        router.back();
    };

    return <CameraView onClose={handleClose} quest={quest} />;
}
