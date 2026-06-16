import { QuestLog } from '@/components/views/QuestLog';
import { useRouter } from 'expo-router';
import React from 'react';

export default function ArchiveScreen() {
    const router = useRouter();

    const handleClose = () => {
        router.back();
    };

    const handleSelectQuest = (questId: string) => {
        router.push('/wrap');
    };

    return <QuestLog onClose={handleClose} onSelectQuest={handleSelectQuest} />;
}
