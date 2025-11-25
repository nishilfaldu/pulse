import { ChatModal } from '@/components/modals/chat-modal';
import { SerendipityView } from '@/components/views/serendipity-view';
import React, { useState } from 'react';

export default function SerendipityScreen() {
    const [showChatModal, setShowChatModal] = useState(false);

    return (
        <>
            <SerendipityView onOpenChat={() => setShowChatModal(true)} />
            <ChatModal isOpen={showChatModal} onClose={() => setShowChatModal(false)} />
        </>
    );
}
