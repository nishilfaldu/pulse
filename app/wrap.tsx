import { DailyWrap } from '@/components/views/DailyWrap';
import { useRouter } from 'expo-router';
import React from 'react';

export default function WrapScreen() {
    const router = useRouter();

    const handleClose = () => {
        router.back();
    };

    return <DailyWrap onClose={handleClose} />;
}
